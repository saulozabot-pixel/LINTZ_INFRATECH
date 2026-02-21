package com.lux.motorista

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import java.util.regex.Pattern

class RideService : AccessibilityService() {

    private lateinit var overlayManager: OverlayManager

    // Blacklist de pacotes para ignorar (ruídos do sistema + próprio app)
    private val packageBlacklist = listOf(
        "com.lux.motorista",                    // próprio app — nunca processar a si mesmo
        "com.android.systemui",
        "com.android.launcher",
        "com.android.launcher3",
        "com.samsung.android.app.launcher",
        "com.sec.android.app.launcher",
        "com.miui.home",
        "com.mi.android.globalminusscreen",     // Xiaomi: tela lateral esquerda (minus screen)
        "com.miui.miwallpaper",
        "com.miui.systemui",
        "com.huawei.android.launcher",
        "com.coloros.launcher",
        "com.oppo.launcher",
        "com.android.deskclock",
        "com.google.android.gms",
        "com.android.vending"
    )

    // Throttle por package: evita processar o mesmo app mais de 1x a cada 400ms
    private val lastProcessByPackage = mutableMapOf<String, Long>()
    private val THROTTLE_MS = 400L

    // Whitelist de packages de apps de transporte conhecidos (detecção confiável)
    private val rideAppPackages = listOf(
        "com.ubercab.driver",
        "com.ubercab",
        "com.a99.driver",
        "com.ninetynine",
        "br.com.99app"
    )

    // Gatilhos OBRIGATÓRIOS: só dispara quando o card de corrida está visível
    // "Aceitar" e "Selecionar" são os botões de ação exclusivos do card de oferta
    private val mandatoryTriggers = listOf(
        "Aceitar", "aceitar",
        "Selecionar", "selecionar"
    )

    // Keywords de apps de transporte
    private val appKeywords = listOf(
        "Uber", "99", "99Pop", "Uber Driver", "Motorista",
        "tarifa", "Tarifa", "KM", "km", "min", "Min",
        "R$", "distância", "Distância"
    )

    // Trava de repetição: evita disparar 50x para a mesma corrida
    private var lastShowTimestamp: Long = 0
    private var lastDetectedHash: String = ""

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.e("LUX_DEBUG", "💓 HEARTBEAT: SERVICO VIVO!")

        try {
            val prefs = getSharedPreferences("lux_driver_prefs", MODE_PRIVATE)
            val overlayDuration = prefs.getLong("overlay_duration", 10000L)

            overlayManager = OverlayManager(this, overlayDuration)

            val info = serviceInfo ?: AccessibilityServiceInfo()
            info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                              AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            info.flags = info.flags or
                         AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or
                         AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS or
                         AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            serviceInfo = info

            Log.e("LUX_DEBUG", "✅ SERVICO: Configuracao completa! Duracao: ${overlayDuration}ms")
        } catch (e: Exception) {
            Log.e("LUX_DEBUG", "❌ SERVICO ERRO: " + e.message)
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val packageName = event.packageName?.toString() ?: return
        if (packageBlacklist.any { packageName.contains(it) }) return

        // Verifica se é um app de transporte conhecido (fast-path)
        val isKnownRideApp = rideAppPackages.any { packageName.contains(it) }

        // Throttle por package: evita processar o mesmo app mais de 1x a cada 400ms
        val now = System.currentTimeMillis()
        val lastProcess = lastProcessByPackage[packageName] ?: 0L
        if (now - lastProcess < THROTTLE_MS) return
        lastProcessByPackage[packageName] = now

        // Obtém a janela ativa — operação cara, só faz se necessário
        val rootNode = rootInActiveWindow ?: event.source ?: return

        // Verifica também o pacote da janela ativa (rootInActiveWindow pode ser do Lux mesmo
        // quando o evento vem de outro app)
        val rootPackage = rootNode.packageName?.toString() ?: packageName
        if (packageBlacklist.any { rootPackage.contains(it) }) return

        // Log do pacote ativo para debug
        Log.d("LUX_DEBUG", "📦 EVENTO: pkg=$packageName | rootPkg=$rootPackage | known=$isKnownRideApp | tipo=${event.eventType}")

        val allTexts = mutableListOf<String>()
        extractText(rootNode, allTexts)
        val combinedText = allTexts.joinToString(" ")

        // Pré-filtro: verifica se é um app de transporte (keyword ou pacote conhecido)
        val hasAppKeyword = isKnownRideApp || appKeywords.any { combinedText.contains(it, ignoreCase = true) }

        // Gatilho OBRIGATÓRIO: "Aceitar" ou "Selecionar" — exclusivos do card de corrida
        // Isso evita disparar na tela do mapa com preços dinâmicos, ganhos, etc.
        val hasMandatoryTrigger = mandatoryTriggers.any { combinedText.contains(it) }
        val hasFare = combinedText.contains("R$")

        // Log quando não detecta — ajuda a entender por que o Uber não foi capturado
        if (!hasAppKeyword || !hasMandatoryTrigger || !hasFare) {
            if (combinedText.isNotBlank()) {
                Log.d("LUX_DEBUG", "⏭️ SKIP: appKw=$hasAppKeyword mandatory=$hasMandatoryTrigger fare=$hasFare pkg=$packageName")
            }
            return
        }

        if (hasAppKeyword && hasMandatoryTrigger && hasFare) {
            Log.e("LUX_DEBUG", "🔍 CARD DETECTADO [pkg=$packageName]: ${combinedText.take(500)}")

            val fare = findFare(combinedText)
            val totalDistance = findTotalDistance(combinedText)
            val totalTime = findTotalTime(combinedText)

            if (fare != null && fare > 3.0) {
                val contentHash = "$fare-$totalDistance-$totalTime"
                val nowMs = System.currentTimeMillis()

                if (contentHash == lastDetectedHash && (nowMs - lastShowTimestamp) < 8000) {
                    return
                }

                Log.println(Log.ASSERT, "LUX_DEBUG",
                    "🎯 CORRIDA: R$$fare | ${totalDistance}km | ${totalTime}min")

                lastDetectedHash = contentHash
                lastShowTimestamp = nowMs

                showOverlayWithCalculation(fare, totalDistance, totalTime)
            }
        }
    }

    /**
     * Calcula o lucro real com base nas configurações do veículo salvas pelo app React
     * e exibe o overlay com a métrica selecionada pelo usuário.
     *
     * Fórmula idêntica ao calculator.ts:
     *   fuelCostDistance = (distance / consumptionPerKm) * fuelPrice
     *   fuelCostTime     = (time / 60) * consumptionPerHour * fuelPrice
     *   maintenanceCost  = distance * maintenanceCostPerKm
     *   totalCost        = fuelCostDistance + fuelCostTime + maintenanceCost
     *   netProfit        = fare - totalCost
     */
    private fun showOverlayWithCalculation(fare: Double, distance: Double, time: Int) {
        // Proteção: se onServiceConnected falhou antes de inicializar overlayManager, não crasha
        if (!::overlayManager.isInitialized) {
            Log.e("LUX_DEBUG", "❌ overlayManager não inicializado — ignorando corrida R$$fare")
            return
        }

        val prefs = getSharedPreferences("lux_driver_prefs", MODE_PRIVATE)

        // Lê configurações salvas pelo LuxDriverPlugin.saveVehicleConfig()
        val fuelPrice            = prefs.getFloat("fuel_price", 5.89f).toDouble()
        val consumptionPerKm     = prefs.getFloat("consumption_per_km", 10.0f).toDouble()
        val consumptionPerHour   = prefs.getFloat("consumption_per_hour", 1.5f).toDouble()
        val maintenanceCostPerKm = prefs.getFloat("maintenance_cost_per_km", 0.20f).toDouble()
        val primaryMetric        = prefs.getString("primary_metric", "profitPerHour") ?: "profitPerHour"
        val overlayDuration      = prefs.getLong("overlay_duration", 10000L)
        val visibleMetricsStr    = prefs.getString("visible_metrics", "profitPerHour,netProfit") ?: "profitPerHour,netProfit"
        val visibleMetrics       = visibleMetricsStr.split(",").map { it.trim() }.filter { it.isNotEmpty() }

        overlayManager.setDuration(overlayDuration)

        // Log completo da config para verificar se os valores do usuário chegaram corretamente
        Log.e("LUX_DEBUG", "⚙️ CONFIG: combustivel=R$${"%.2f".format(fuelPrice)}/L" +
            " | consumo=${consumptionPerKm}km/L | consumoHora=${consumptionPerHour}L/h" +
            " | manut=R$${"%.2f".format(maintenanceCostPerKm)}/km" +
            " | metrica=$primaryMetric | metricas=$visibleMetricsStr | duracao=${overlayDuration}ms")

        // ── Cálculo real (mesma fórmula do calculator.ts) ────────────────────
        val timeHours = time / 60.0

        val fuelCostDistance = if (consumptionPerKm > 0)
            (distance / consumptionPerKm) * fuelPrice else 0.0
        val fuelCostTime     = timeHours * consumptionPerHour * fuelPrice
        val maintenanceCost  = distance * maintenanceCostPerKm
        val totalCost        = fuelCostDistance + fuelCostTime + maintenanceCost
        val netProfit        = fare - totalCost
        val profitPerHour    = if (timeHours > 0) netProfit / timeHours else 0.0
        val profitPerKm      = if (distance > 0)  netProfit / distance  else 0.0
        val farePerHour      = if (timeHours > 0) fare / timeHours      else 0.0
        val farePerKm        = if (distance > 0)  fare / distance       else 0.0

        Log.e("LUX_DEBUG", "💰 CALCULO: tarifa=R$${"%.2f".format(fare)}" +
            " | custo=R$${"%.2f".format(totalCost)}" +
            " | liquido=R$${"%.2f".format(netProfit)}" +
            " | liq/h=R$${"%.2f".format(profitPerHour)}" +
            " | metrica=$primaryMetric")

        // ── Semáforo: usa lucro líquido por minuto + thresholds do usuário ────
        val thresholdGreen  = prefs.getFloat("threshold_green",  0.50f).toDouble()
        val thresholdYellow = prefs.getFloat("threshold_yellow", 0.20f).toDouble()
        // profitPerMinute = netProfit / tempo em minutos
        val profitPerMinute = if (time > 0) netProfit / time.toDouble() else 0.0

        val accentColor = when {
            profitPerMinute >= thresholdGreen  -> android.graphics.Color.parseColor("#4CAF50") // 🟢 boa
            profitPerMinute >= thresholdYellow -> android.graphics.Color.parseColor("#FFC107") // 🟡 intermediária
            else                               -> android.graphics.Color.parseColor("#F44336") // 🔴 ruim
        }

        Log.e("LUX_DEBUG", "🚦 SEMÁFORO: R$${"%.3f".format(profitPerMinute)}/min" +
            " | verde≥$thresholdGreen | amarelo≥$thresholdYellow" +
            " | cor=${if (profitPerMinute >= thresholdGreen) "VERDE" else if (profitPerMinute >= thresholdYellow) "AMARELO" else "VERMELHO"}")

        // ── Constrói lista de métricas visíveis selecionadas pelo usuário ─────
        // "time" é tratado separadamente na barra inferior
        val showTime = visibleMetrics.contains("time")
        val metricItems = mutableListOf<Pair<String, String>>()

        for (metric in visibleMetrics) {
            when (metric) {
                "profitPerHour" -> metricItems.add(Pair("Liq/h",    "R$ ${"%.2f".format(profitPerHour).replace(".", ",")}"))
                "profitPerKm"   -> metricItems.add(Pair("Liq/km",   "R$ ${"%.2f".format(profitPerKm).replace(".", ",")}"))
                "farePerHour"   -> metricItems.add(Pair("Bruto/h",  "R$ ${"%.2f".format(farePerHour).replace(".", ",")}"))
                "farePerKm"     -> metricItems.add(Pair("Bruto/km", "R$ ${"%.2f".format(farePerKm).replace(".", ",")}"))
                "netProfit"     -> metricItems.add(Pair("Lucro",    "R$ ${"%.2f".format(netProfit).replace(".", ",")}"))
                "totalCost"     -> metricItems.add(Pair("Custo",    "R$ ${"%.2f".format(totalCost).replace(".", ",")}"))
            }
        }

        // Fallback: se nenhuma métrica foi selecionada, mostra lucro líquido
        if (metricItems.isEmpty()) {
            metricItems.add(Pair("Lucro", "R$ ${"%.2f".format(netProfit).replace(".", ",")}"))
        }

        val fareStr     = "%.2f".format(fare).replace(".", ",")
        val distanceStr = "%.1f".format(distance).replace(".", ",")

        overlayManager.showOverlay(
            fare        = fareStr,
            distance    = distanceStr,
            time        = time.toString(),
            showTime    = showTime,
            metrics     = metricItems,
            accentColor = accentColor
        )
    }

    private fun extractText(node: AccessibilityNodeInfo?, list: MutableList<String>) {
        if (node == null) return
        node.text?.toString()?.let { if (it.isNotBlank()) list.add(it) }
        node.contentDescription?.toString()?.let { if (it.isNotBlank()) list.add(it) }
        for (i in 0 until node.childCount) {
            val child = try { node.getChild(i) } catch (e: Exception) { null }
            if (child != null) {
                extractText(child, list)
                try { child.recycle() } catch (_: Exception) {} // evita memory leak
            }
        }
    }

    private fun findFare(text: String): Double? {
        val pattern = Pattern.compile("R\\$\\s?(\\d+[.,]\\d{2})")
        val matcher = pattern.matcher(text)
        val prices = mutableListOf<Double>()
        while (matcher.find()) {
            val value = matcher.group(1)?.replace(",", ".")?.toDoubleOrNull()
            if (value != null && value > 3.0) prices.add(value)
        }
        return prices.maxOrNull()
    }

    // Soma distância de deslocamento + viagem
    private fun findTotalDistance(text: String): Double {
        val pattern = Pattern.compile("(\\d+[.,]?\\d*)\\s?km", Pattern.CASE_INSENSITIVE)
        val matcher = pattern.matcher(text)
        val distances = mutableListOf<Double>()
        while (matcher.find()) {
            val value = matcher.group(1)?.replace(",", ".")?.toDoubleOrNull()
            if (value != null && value > 0.1) distances.add(value)
        }
        val total = if (distances.isNotEmpty()) distances.sum() else 0.0
        Log.d("LUX_DEBUG", "Distâncias: $distances → Total: $total km")
        return total
    }

    // Soma tempo de deslocamento + viagem
    private fun findTotalTime(text: String): Int {
        var totalMinutes = 0

        // Forma 1: "Xh Ym" ou "XhYm"
        val hourMinPattern = Pattern.compile(
            "(\\d+)\\s*h(?:oras?)?\\s*(\\d+)?\\s*m(?:in)?s?", Pattern.CASE_INSENSITIVE)
        val hourMinMatcher = hourMinPattern.matcher(text)
        if (hourMinMatcher.find()) {
            val hours = hourMinMatcher.group(1)?.toIntOrNull() ?: 0
            val mins  = hourMinMatcher.group(2)?.toIntOrNull() ?: 0
            totalMinutes = (hours * 60) + mins
            Log.d("LUX_DEBUG", "Tempo (Xh Ym): ${totalMinutes}min")
        }

        // Forma 2: apenas minutos "Xmin" ou "X min"
        if (totalMinutes == 0) {
            val minPattern = Pattern.compile("(\\d+)\\s*min(?:utos?)?", Pattern.CASE_INSENSITIVE)
            val minMatcher = minPattern.matcher(text)
            val minutes = mutableListOf<Int>()
            while (minMatcher.find()) {
                minMatcher.group(1)?.toIntOrNull()?.let { if (it > 0) minutes.add(it) }
            }
            if (minutes.isNotEmpty()) {
                totalMinutes = minutes.sum()
                Log.d("LUX_DEBUG", "Minutos: $minutes → Total: $totalMinutes min")
            }
        }

        return totalMinutes
    }

    override fun onInterrupt() {
        Log.e("LUX_DEBUG", "⚠️ SERVICO: Interrompido!")
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::overlayManager.isInitialized) overlayManager.removeOverlay()
        Log.e("LUX_DEBUG", "🔴 SERVICO: Destruído!")
    }
}
