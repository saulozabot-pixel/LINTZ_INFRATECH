# 🚀 Guia de Publicação — Lux Driver Assistant

## ✅ Estado Atual do App (Salvo)

### Funcionalidades implementadas:
- [x] Overlay visual (fundo branco, borda colorida, valores 24sp)
- [x] Sistema de cores: 🟡 amarelo / 🔴 vermelho / 🟢 verde
- [x] Semáforo de corridas com slider duplo ajustável
- [x] Leitura apenas do card de corrida (não lê mapa)
- [x] Passo 3: Desativar otimização de bateria
- [x] Cálculo: Lucro líquido / tempo = R$/min

---

## 📋 Checklist para Publicar na Play Store

### ETAPA 1 — Conta de Desenvolvedor
- [ ] Criar conta em: https://play.google.com/console
- [ ] Pagar taxa única de **US$ 25** (cartão de crédito)
- [ ] Verificar identidade (pode levar 1-2 dias)

---

### ETAPA 2 — Preparar o App

#### 2.1 — Ícone do App
- [ ] Criar ícone 512×512px (PNG, sem transparência)
- [ ] Criar ícone adaptativo Android (foreground + background)
- Ferramenta gratuita: https://icon.kitchen

#### 2.2 — Screenshots
- [ ] Mínimo 2 screenshots do app (recomendado 4-8)
- [ ] Tamanho: 1080×1920px ou similar
- [ ] Mostrar: tela inicial, overlay em ação, configurações

#### 2.3 — Política de Privacidade (OBRIGATÓRIO para Acessibilidade)
- [ ] Criar uma página com a política de privacidade
- [ ] Pode usar: https://privacypolicygenerator.info
- [ ] Hospedar em: GitHub Pages (gratuito) ou Google Sites
- [ ] **Conteúdo obrigatório**: o app usa serviço de acessibilidade para ler
  informações de outros apps (Uber, 99) e NÃO coleta/transmite dados pessoais

#### 2.4 — Gerar Keystore (Assinatura do App)
```bash
# No terminal do Android Studio (ou cmd):
keytool -genkey -v -keystore lux-release.keystore -alias lux -keyalg RSA -keysize 2048 -validity 10000
```
- [ ] **GUARDAR O KEYSTORE E SENHA EM LOCAL SEGURO** — sem ele não pode atualizar o app
- [ ] Adicionar ao `build.gradle` do app

#### 2.5 — Gerar AAB (Android App Bundle)
No Android Studio:
- [ ] Build → Generate Signed Bundle/APK
- [ ] Selecionar "Android App Bundle (.aab)"
- [ ] Usar o keystore criado acima
- [ ] Build type: **release**

---

### ETAPA 3 — Declaração de Serviço de Acessibilidade (CRÍTICO)

Apps com `AccessibilityService` precisam de aprovação especial do Google:

- [ ] Na Play Console: Política → Declarações de app
- [ ] Declarar uso de acessibilidade com justificativa clara:
  > "O serviço de acessibilidade é usado exclusivamente para ler informações
  > de corridas exibidas em apps de transporte (Uber, 99) e calcular a
  > rentabilidade em tempo real para o motorista. Nenhum dado é coletado
  > ou transmitido."
- [ ] **Atenção**: Google pode rejeitar apps que usam acessibilidade para fins
  não relacionados a ajudar pessoas com deficiência. Prepare uma justificativa sólida.

---

### ETAPA 4 — Configurar Monetização

#### Opção A — Assinatura Mensal (Recomendado)
- [ ] Na Play Console: Monetização → Produtos → Assinaturas
- [ ] Criar plano: ex. "Lux Premium" — R$ 9,90/mês
- [ ] Integrar Google Play Billing no app (biblioteca `com.android.billingclient`)
- [ ] Lógica: app gratuito com 7 dias de trial, depois exige assinatura

#### Opção B — Compra Única
- [ ] Na Play Console: Monetização → Produtos → Produtos no app
- [ ] Criar produto: ex. "Lux Vitalício" — R$ 29,90
- [ ] Integrar Google Play Billing

#### Opção C — Freemium (mais fácil para começar)
- [ ] App gratuito com limite (ex: 10 corridas/dia)
- [ ] Versão paga remove o limite
- [ ] Não precisa de billing integrado inicialmente

---

### ETAPA 5 — Publicar

- [ ] Play Console → Criar app → Preencher informações
- [ ] Categoria: **Ferramentas** ou **Produtividade**
- [ ] Classificação etária: preencher questionário (provavelmente "Livre")
- [ ] Upload do .aab na faixa de produção (ou teste interno primeiro)
- [ ] Aguardar revisão: **3-7 dias** (pode ser mais para apps com acessibilidade)

---

## ⚠️ Riscos e Atenções

| Risco | Mitigação |
|-------|-----------|
| Google rejeitar por uso de acessibilidade | Justificativa clara + política de privacidade |
| App removido por violar ToS do Uber | App não interfere no Uber, apenas lê dados exibidos |
| Keystore perdida | Guardar em 2+ locais seguros (nuvem + HD externo) |
| Concorrência | Diferencial: cálculo de lucro REAL (descontando custos) |

---

## 💰 Projeção de Receita

| Assinantes | Preço/mês | Receita Bruta | Após taxa Google (30%) |
|-----------|-----------|---------------|------------------------|
| 100 | R$ 9,90 | R$ 990 | R$ 693 |
| 500 | R$ 9,90 | R$ 4.950 | R$ 3.465 |
| 1.000 | R$ 9,90 | R$ 9.900 | R$ 6.930 |

> Google cobra 30% nos primeiros 12 meses, depois 15% para assinaturas.

---

## 🔧 Próximos Passos Técnicos Antes de Publicar

1. **Tela de onboarding** — explicar o que o app faz antes de pedir permissões
2. **Tela de paywall** — mostrar benefícios e planos de assinatura
3. **Integração Google Play Billing** — para cobrar dentro do app
4. **Analytics** — Firebase Analytics para entender uso
5. **Crash reporting** — Firebase Crashlytics
6. **Suporte a mais apps** — InDriver, Cabify, etc.

---

## 📁 Arquivos Importantes do Projeto

```
android/app/src/main/java/com/lux/motorista/
├── RideService.kt          ← Serviço de acessibilidade (leitura de tela)
├── OverlayManager.kt       ← Card flutuante (UI do overlay)
├── LuxDriverPlugin.java    ← Bridge Capacitor ↔ Android
└── MainActivity.java       ← Activity principal

src/
├── App.tsx                 ← Tela inicial + permissões
├── components/
│   ├── SettingsScreen.tsx  ← Configurações + semáforo
│   └── DashboardScreen.tsx ← Dashboard principal
├── context/VehicleContext.tsx ← Estado global + cálculos
└── plugins/LuxDriver.ts    ← Interface TypeScript do plugin
