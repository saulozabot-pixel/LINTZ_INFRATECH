 # LUX - Lista de Tarefas

## ✅ CONCLUÍDO: Correção dos Botões de Permissão
- [x] Corrigir `openAccessibilitySettings` → abre `Settings.ACTION_ACCESSIBILITY_SETTINGS`
- [x] Melhorar `checkAccessibility` → verifica componente completo `pacote/classe` com fallback
- [x] Rebuild do APK ✅ BUILD SUCCESSFUL
- [x] Testado no dispositivo — funcionando ✅

## ✅ CONCLUÍDO: Verificação com Uber + Correção do Cálculo Real
- [x] Corrigir `VehicleContext.tsx` — `saveSettings` aceita parâmetros opcionais
- [x] Corrigir `SettingsScreen.tsx` — `handleSave` passa valores diretamente
- [x] Melhorar `RideService.kt` — logs completos
- [x] Rebuild do APK ✅ BUILD SUCCESSFUL in 4s

## ✅ CONCLUÍDO: Redesign do Overlay — Múltiplas Métricas
- [x] Grid de métricas + código de cores + barra colorida
- [x] Rebuild: ✅ BUILD SUCCESSFUL in 7s
- [x] Testado com Uber ✅

## ✅ CONCLUÍDO: Auditoria Completa + Correção de Bugs
- [x] Bugs críticos corrigidos (overlayManager, memory leak, main thread)
- [x] Whitelist de packages Uber/99
- [x] Rebuild: ✅ BUILD SUCCESSFUL in 6s

---

## ✅ CONCLUÍDO: Pitch Deck LuxDrive EV — Valores Corrigidos

### 📁 Arquivos relevantes:
- `docs/pitch-deck-locadora-ev.html` — Pitch deck completo (17 slides) ✅
- `docs/verify-pitch.js` — Script de verificação dos valores ✅ 24/24 checks
- `docs/generate-pitch.js` — Script de geração/atualização do pitch deck ✅
- `docs/check.cjs` — Verificação rápida de valores-chave
- `vercel.json` — Deploy: outputDirectory = "docs"

### 📋 Tarefas:
- [x] **1. Atualizar `pitch-deck-locadora-ev.html`** — Valores CAPEX corrigidos
  - BYD Dolphin Mini: R$ 95.000/un ✅
  - Cenário A: R$ 625.000 ✅
  - Cenário B: R$ 1.200.000 ✅
  - Cover: R$ 625K – R$ 1,20M ✅
- [x] **2. Criar `docs/verify-pitch.js`** — 24/24 checks passando ✅
- [x] **3. Criar `docs/generate-pitch.js`** — Bugs de regex corrigidos ✅
  - Bug crítico: Index 4 capturava Cenário A em vez de Cenário B → corrigido
  - Bug: Index 3 e 6 falhavam por `[^<]*` não passar por `<span>` → corrigido
- [x] **4. Git commit + push + deploy Vercel** — HTTP 200 confirmado ✅
  - URL: https://lux-driver-assistent-18y8.vercel.app/pitch-deck-locadora-ev.html
  - Fix final: `buildCommand: "mkdir -p dist && cp -r docs/. dist/"` + `outputDirectory: "dist"`
  - Deploy via `npx vercel --prod` (commit be8fcf9)

### ⚠️ Nota sobre warnings no VSCode (340 avisos):
- São avisos do **Microsoft Edge Tools** sobre CSS inline no HTML
- **Não são erros reais** — o HTML funciona corretamente no browser
- São apenas sugestões de mover estilos inline para CSS externo
