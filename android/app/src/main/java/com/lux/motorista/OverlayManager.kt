package com.lux.motorista

import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.util.Log

class OverlayManager(private val context: Context, defaultDuration: Long = 10000L) {

    private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    private var overlayView: View? = null
    private var removeHandler: Handler? = null
    private var removeRunnable: Runnable? = null

    var overlayDuration: Long = defaultDuration

    fun showOverlay(
        fare: String,
        distance: String,
        time: String,
        showTime: Boolean,
        metrics: List<Pair<String, String>>,
        accentColor: Int
    ) {
        Log.e("LUX_DEBUG", "🎨 MANAGER: Exibindo overlay — ${metrics.size} métricas")

        cancelPendingTimer()
        if (overlayView != null) safeRemoveOverlay()

        // ── Card principal ────────────────────────────────────────────────────
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            val p = dpToPx(14)
            setPadding(p, p, p, p)
            minimumWidth = dpToPx(310)
            val bg = GradientDrawable().apply {
                setColor(Color.parseColor("#FFFFFFFF"))
                cornerRadius = dpToPx(14).toFloat()
                setStroke(dpToPx(3), accentColor)
            }
            setBackground(bg)
        }

        // ── Header: LUX + tarifa bruta ────────────────────────────────────────
        val headerRow = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        val logoText = TextView(context).apply {
            text = "LUX"
            textSize = 13f
            setTextColor(Color.parseColor("#FFD700"))
            typeface = Typeface.DEFAULT_BOLD
            letterSpacing = 0.18f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }
        val fareText = TextView(context).apply {
            text = "R$ $fare"
            textSize = 12f
            setTextColor(Color.parseColor("#555555"))
            gravity = Gravity.END
        }
        headerRow.addView(logoText)
        headerRow.addView(fareText)
        layout.addView(headerRow)

        // ── Divisor ───────────────────────────────────────────────────────────
        fun makeDivider(): View = View(context).apply {
            setBackgroundColor(Color.parseColor("#22000000"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dpToPx(1)
            ).also { it.topMargin = dpToPx(8); it.bottomMargin = dpToPx(8) }
        }
        layout.addView(makeDivider())

        // ── Grid de métricas (linhas de até 3 colunas) ────────────────────────
        val rows = metrics.chunked(3)
        rows.forEachIndexed { rowIdx, row ->
            if (rowIdx > 0) {
                val rowSep = View(context).apply {
                    setBackgroundColor(Color.parseColor("#22000000"))
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, dpToPx(1)
                    ).also { it.topMargin = dpToPx(6); it.bottomMargin = dpToPx(6) }
                }
                layout.addView(rowSep)
            }

            val rowLayout = LinearLayout(context).apply {
                orientation = LinearLayout.HORIZONTAL
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
            }

            row.forEach { (label, value) ->
                val cellLayout = LinearLayout(context).apply {
                    orientation = LinearLayout.VERTICAL
                    gravity = Gravity.CENTER_HORIZONTAL
                    layoutParams = LinearLayout.LayoutParams(
                        0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f
                    )
                }

                // Label da métrica (pequeno, cinza escuro)
                val labelView = TextView(context).apply {
                    text = label
                    textSize = 10f
                    setTextColor(Color.parseColor("#666666"))
                    gravity = Gravity.CENTER
                    letterSpacing = 0.06f
                }

                // Linha: barra colorida + valor
                val valueRow = LinearLayout(context).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = Gravity.CENTER_VERTICAL or Gravity.CENTER_HORIZONTAL
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                    ).also { it.topMargin = dpToPx(3) }
                }
                val colorBar = View(context).apply {
                    setBackgroundColor(accentColor)
                    layoutParams = LinearLayout.LayoutParams(dpToPx(4), dpToPx(24))
                        .also { it.rightMargin = dpToPx(5) }
                }
                val valueView = TextView(context).apply {
                    text = value
                    textSize = 24f
                    setTextColor(Color.parseColor("#111111"))
                    typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                }
                valueRow.addView(colorBar)
                valueRow.addView(valueView)

                cellLayout.addView(labelView)
                cellLayout.addView(valueRow)
                rowLayout.addView(cellLayout)
            }
            layout.addView(rowLayout)
        }

        // ── Barra inferior: distância + tempo ─────────────────────────────────
        layout.addView(makeDivider())
        val infoRow = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        val distanceText = TextView(context).apply {
            text = "${distance}km"
            textSize = 14f
            setTextColor(Color.parseColor("#555555"))
            gravity = Gravity.CENTER
        }
        infoRow.addView(distanceText)

        if (showTime) {
            val separatorText = TextView(context).apply {
                text = "  •  "
                textSize = 14f
                setTextColor(Color.parseColor("#999999"))
            }
            val timeText = TextView(context).apply {
                text = "${time}min"
                textSize = 15f
                setTextColor(Color.parseColor("#222222"))
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                gravity = Gravity.CENTER
            }
            infoRow.addView(separatorText)
            infoRow.addView(timeText)
        }
        layout.addView(infoRow)

        overlayView = layout

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            // FLAG_WATCH_OUTSIDE_TOUCH removido: interceptava toques no Uber (ex: botão Aceitar)
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            y = dpToPx(130)
        }

        try {
            Handler(Looper.getMainLooper()).post {
                try {
                    windowManager.addView(overlayView, params)
                    Log.println(Log.ASSERT, "LUX_DEBUG", "✅ OVERLAY: Exibido com SUCESSO!")
                } catch (e: Exception) {
                    Log.println(Log.ASSERT, "LUX_DEBUG", "❌ OVERLAY ERRO: " + e.message)
                }
            }
            scheduleRemove()
        } catch (e: Exception) {
            Log.println(Log.ASSERT, "LUX_DEBUG", "❌ MANAGER ERRO FATAL: " + e.message)
        }
    }

    private fun cancelPendingTimer() {
        removeRunnable?.let { removeHandler?.removeCallbacks(it) }
        removeHandler = null
        removeRunnable = null
    }

    private fun safeRemoveOverlay() {
        val view = overlayView ?: return
        overlayView = null // limpa referência imediatamente para evitar double-remove
        // removeView/removeViewImmediate exige main thread — garante isso independente de quem chamou
        if (Looper.myLooper() == Looper.getMainLooper()) {
            try {
                windowManager.removeViewImmediate(view)
                Log.e("LUX_DEBUG", "🔴 OVERLAY: Removido (main thread)")
            } catch (e: Exception) {
                Log.e("LUX_DEBUG", "❌ ERRO ao remover overlay: " + e.message)
            }
        } else {
            Handler(Looper.getMainLooper()).post {
                try {
                    windowManager.removeView(view)
                    Log.e("LUX_DEBUG", "🔴 OVERLAY: Removido (posted to main thread)")
                } catch (e: Exception) {
                    Log.e("LUX_DEBUG", "❌ ERRO ao remover overlay (post): " + e.message)
                }
            }
        }
    }

    private fun scheduleRemove() {
        cancelPendingTimer()
        removeHandler = Handler(Looper.getMainLooper())
        removeRunnable = Runnable {
            safeRemoveOverlay()
            Log.e("LUX_DEBUG", "⏰ TIMER: Overlay removido automaticamente")
        }
        removeHandler?.postDelayed(removeRunnable!!, overlayDuration)
    }

    fun removeOverlay() {
        cancelPendingTimer()
        safeRemoveOverlay()
    }

    fun setDuration(durationMs: Long) {
        overlayDuration = durationMs
        Log.e("LUX_DEBUG", "⏱️ DURAÇÃO: ${durationMs}ms")
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * context.resources.displayMetrics.density).toInt()
    }
}
