# Firebase Analytics Integration - TODO

## Steps

- [x] 1. Edit android/app/build.gradle - Add Firebase Analytics dependency
- [x] 2. Create src/utils/analytics.ts - Analytics via Measurement Protocol (sem npm)
- [x] 3. Edit src/App.tsx - Add analytics tracking calls
- [ ] 4. USER: Criar projeto no Firebase Console e obter credenciais
- [ ] 5. USER: Preencher FIREBASE_MEASUREMENT_ID e FIREBASE_API_SECRET em src/utils/analytics.ts
- [ ] 6. USER: Baixar google-services.json e colocar em android/app/
- [ ] 7. Build e testar

## Eventos rastreados no app:
- app_open — toda abertura do app
- trial_started — primeiro uso
- onboarding_complete — onboarding concluído
- paywall_shown — paywall exibido
- premium_activated — premium ativado
- tab_changed — navegação entre abas
