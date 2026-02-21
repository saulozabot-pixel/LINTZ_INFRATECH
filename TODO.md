# LUX - Lista de Tarefas

## ✅ CONCLUÍDO: Correção dos Botões de Permissão
- [x] Corrigir `openAccessibilitySettings` → abre `Settings.ACTION_ACCESSIBILITY_SETTINGS`
- [x] Melhorar `checkAccessibility` → verifica componente completo `pacote/classe` com fallback
- [x] Rebuild do APK ✅ BUILD SUCCESSFUL
- [x] Testado no dispositivo — funcionando ✅

---

## 🔄 EM ANDAMENTO: Verificação com Uber + Correção do Cálculo Real

### 📁 Arquivos relevantes analisados:
- `RideService.kt` — Serviço de acessibilidade que monitora outros apps e exibe overlay
- `OverlayManager.kt` — Exibe o card flutuante com tarifa/lucro
- `LuxDriverPlugin.java` — Plugin Capacitor: salva config em SharedPreferences
- `VehicleContext.tsx` — Contexto React: carrega/salva config do veículo
- `SettingsScreen.tsx` — Tela de configurações do usuário
- `calculator.ts` — Fórmula de cálculo de lucro real
- `LuxDriver.ts` — Interface TypeScript do plugin nativo

### 🐛 BUG CRÍTICO ENCONTRADO — `saveSettings` usa estado React desatualizado

**Arquivo:** `SettingsScreen.tsx` + `VehicleContext.tsx`

**Problema:** Em `handleSave()`, `setVehicleConfig(localConfig)` e `setPreferences(localPrefs)` são
chamadas assíncronas do React. Quando `saveSettings()` é chamado logo em seguida, o estado do
contexto ainda tem os valores ANTIGOS. Resultado: os valores novos do usuário NÃO são salvos
no Android (SharedPreferences), apenas no localStorage (na próxima renderização).

```tsx
// SettingsScreen.tsx — BUG AQUI:
const handleSave = () => {
    setVehicleConfig(localConfig);  // ← async, estado ainda não atualizou
    setPreferences(localPrefs);      // ← async, estado ainda não atualizou
    saveSettings();                  // ← usa vehicleConfig/preferences ANTIGOS!
    onSave();
};

// VehicleContext.tsx — saveSettings usa estado desatualizado:
const saveSettings = () => {
    localStorage.setItem('vehicleConfig', JSON.stringify(vehicleConfig));  // ANTIGO
    syncToAndroid(vehicleConfig, preferences);  // ANTIGO → Android recebe config errada!
};
```

**Fix planejado:** Modificar `saveSettings` para aceitar config/prefs como parâmetros:
```tsx
// VehicleContext.tsx — CORRIGIDO:
const saveSettings = (config?: VehicleConfig, prefs?: NotificationPreferences) => {
    const configToSave = config ?? vehicleConfig;
    const prefsToSave = prefs ?? preferences;
    localStorage.setItem('vehicleConfig', JSON.stringify(configToSave));
    localStorage.setItem('notificationPreferences', JSON.stringify(prefsToSave));
    syncToAndroid(configToSave, prefsToSave);
};

// SettingsScreen.tsx — CORRIGIDO:
const handleSave = () => {
    setVehicleConfig(localConfig);
    setPreferences(localPrefs);
    saveSettings(localConfig, localPrefs);  // ← passa valores novos diretamente
    onSave();
};
```

### 🔍 Melhorias de Log para debug com Uber

**Arquivo:** `RideService.kt`

**Problemas:**
1. Package name não é logado em `onAccessibilityEvent` → difícil saber qual app disparou
2. `combinedText.take(300)` trunca o texto → pode esconder dados importantes do Uber
3. Não há log quando `hasAppKeyword=false` ou `hasTrigger=false` → não sabe por que não detectou
4. Config do veículo não é logada completamente (falta consumptionPerKm, consumptionPerHour)

**Fix planejado:**
```kotlin
// Adicionar no início de onAccessibilityEvent:
Log.d("LUX_DEBUG", "📦 EVENTO: pkg=$packageName | tipo=${event.eventType}")

// Aumentar take(300) para take(500)

// Adicionar log quando não detecta:
if (!hasAppKeyword || (!hasTrigger && !combinedText.contains("R$"))) {
    Log.d("LUX_DEBUG", "⏭️ SKIP: appKw=$hasAppKeyword trigger=$hasTrigger pkg=$packageName")
}

// Log completo da config:
Log.e("LUX_DEBUG", "⚙️ CONFIG: combustivel=R$$fuelPrice/L | consumo=${consumptionPerKm}km/L" +
    " | consumoHora=${consumptionPerHour}L/h | manut=R$$maintenanceCostPerKm/km")
```

### 📋 IMPLEMENTAÇÃO CONCLUÍDA ✅

- [x] **1. Corrigir `VehicleContext.tsx`** — `saveSettings` aceita parâmetros opcionais (`config?`, `prefs?`)
- [x] **2. Corrigir `SettingsScreen.tsx`** — `handleSave` passa `localConfig`/`localPrefs` diretamente
- [x] **3. Melhorar `RideService.kt`** — logs: pkg name, take(500), SKIP log, ⚙️ CONFIG log completo
- [x] **4. Rebuild do APK** ✅ BUILD SUCCESSFUL in 4s

---

## ✅ CONCLUÍDO: Redesign do Overlay — Múltiplas Métricas

### O que foi implementado:
- `LuxDriver.ts` — Adicionado `visibleMetrics: string[]` ao payload
- `VehicleContext.tsx` — `syncToAndroid` agora passa `visibleMetrics`
- `LuxDriverPlugin.java` — Salva `visible_metrics` como string CSV no SharedPreferences
- `RideService.kt` — Lê `visible_metrics`, constrói lista de métricas calculadas, determina cor do card
- `OverlayManager.kt` — Redesign completo: grid de métricas + código de cores + barra colorida

### Novo layout do overlay:
```
┌──────────────────────────────────┐  ← borda verde/amarela/vermelha
│ LUX                  R$ 15,80   │  ← tarifa bruta (menor destaque)
├──────────────────────────────────┤
│  Liq/h   │  Liq/km  │   Lucro   │  ← labels das métricas selecionadas
│ │ R$52,80 │ │ R$2,35 │ │ R$38,90 │  ← barra colorida + valor
├──────────────────────────────────┤
│        18,3km  •  8min          │  ← distância + tempo (se selecionado)
└──────────────────────────────────┘
```

### Código de cores (baseado na métrica principal):
- 🟢 Verde: profitPerHour ≥ R$25 | profitPerKm ≥ R$1,50 | netProfit ≥ R$8
- 🟡 Amarelo: profitPerHour ≥ R$12 | profitPerKm ≥ R$0,80 | netProfit ≥ R$4
- 🔴 Vermelho: abaixo dos limites acima

### Rebuild: ✅ BUILD SUCCESSFUL in 7s

### 📱 TESTADO COM UBER ✅

**Logs confirmados (PID 32125 — novo APK):**
- ✅ `com.ubercab.driver` detectado com `known=true`
- ✅ Throttle funcionando: eventos a cada ~400ms (antes: ~50ms)
- ✅ Blacklist Xiaomi: `com.mi.android.globalminusscreen` bloqueado
- ✅ `R$ 0,00` filtrado corretamente (fare > 3.0 não satisfeito)
- ✅ Threshold `fare > 3.0` correto — corridas reais do Uber começam em R$5,50
- ⏳ Overlay pendente de confirmação visual com corrida real

---

## ✅ CONCLUÍDO: Auditoria Completa + Correção de Bugs

### 🛠️ Ambiente configurado:
- [x] **VSCode settings.json** — JDK apontado para `Android Studio\jbr` (elimina aviso "Please download JDK")
- [x] **ADB no PATH do terminal** — `C:\Users\SAULO\AppData\Local\Android\Sdk\platform-tools` adicionado ao `terminal.integrated.env.windows`
- [x] **ANDROID_HOME / ANDROID_SDK_ROOT** — variáveis de ambiente configuradas no terminal VSCode

### 🔴 Bugs críticos corrigidos:

**1. `RideService.kt` — `overlayManager` sem proteção**
- Adicionado `if (!::overlayManager.isInitialized) return` no início de `showOverlayWithCalculation`
- Evita `UninitializedPropertyAccessException` se `onServiceConnected` falhar

**2. `RideService.kt` — Memory leak em `extractText`**
- Adicionado `child.recycle()` após processar cada nó filho
- Evita vazamento de memória em hierarquias grandes (Uber tem ~200 nodes por evento)

**3. `OverlayManager.kt` — `removeViewImmediate` fora da main thread**
- `safeRemoveOverlay` agora verifica `Looper.myLooper() == Looper.getMainLooper()`
- Se não estiver na main thread, usa `Handler(Looper.getMainLooper()).post { ... }`
- Evita crash silencioso quando `onDestroy` chama `removeOverlay()`

### 🟡 Melhorias de performance e confiabilidade:

**4. `RideService.kt` — Whitelist de packages Uber/99**
- Adicionada `rideAppPackages` com: `com.ubercab.driver`, `com.ubercab`, `com.a99.driver`, etc.
- Apps conhecidos: só exige `R$` para disparar (sem precisar de keywords genéricas)
- Apps desconhecidos: mantém verificação completa de keywords
- Log agora mostra `known=true/false` para debug

**5. `accessibility_service_config.xml` — `notificationTimeout` 100ms → 500ms**
- Reduz disparos de até 10x/segundo para até 2x/segundo
- Menos consumo de bateria, sem perder detecção de corridas

**6. `OverlayManager.kt` — Removido `FLAG_WATCH_OUTSIDE_TOUCH`**
- Este flag interceptava toques fora do overlay
- Podia bloquear o botão "Aceitar" do Uber

**7. `SettingsScreen.tsx` — `localConfig` não sincronizava ao reabrir**
- Adicionados `useEffect` para sincronizar `localConfig` e `localPrefs` com o contexto
- Corrige: usuário abria Settings e via valores default em vez dos salvos

### 📦 Rebuild: ✅ BUILD SUCCESSFUL in 6s

### 📱 PRÓXIMO PASSO: Testar com Uber
Instalar o APK e usar `adb logcat | grep LUX_DEBUG` para monitorar os logs.

### 🔄 Fórmula de cálculo (já correta no RideService.kt, idêntica ao calculator.ts):
```
fuelCostDistance = (distance / consumptionPerKm) * fuelPrice
fuelCostTime     = (time/60) * consumptionPerHour * fuelPrice
maintenanceCost  = distance * maintenanceCostPerKm
totalCost        = fuelCostDistance + fuelCostTime + maintenanceCost
netProfit        = fare - totalCost
```
O cálculo em si está correto — o problema é que os valores do usuário não chegam ao Android
por causa do bug no `saveSettings`.
