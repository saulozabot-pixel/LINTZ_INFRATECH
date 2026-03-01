# 📓 Diárokio de Desenvolvimento — LUX Driver

> Registro diário das atividades, decisões e progresso do projeto.

---

## 🔗 Links do Projeto

| Link | Descrição |
|------|-----------|
| [lux-driver-assistent-18y8.vercel.app](https://lux-driver-assistent-18y8.vercel.app) | 🌐 Site principal / Landing page do LUX Driver |
| [/admin.html](https://lux-driver-assistent-18y8.vercel.app/admin.html) | 🔐 Painel admin — gerenciar assinantes, códigos e receita |
| [/checkout.html](https://lux-driver-assistent-18y8.vercel.app/checkout.html) | 💳 Página de checkout — assinatura via PIX |
| [/lux-driver.apk](https://lux-driver-assistent-18y8.vercel.app/lux-driver.apk) | 📱 Download do APK do app Android |
| [Vercel Analytics](https://vercel.com/saulozabot-pixels-projects/lux-driver-assistent-18y8/analytics) | 📊 Métricas de visitas e tráfego do site |
| [Vercel Dashboard](https://vercel.com/saulozabot-pixels-projects/lux-driver-assistent-18y8) | ⚙️ Painel de deploy e configurações da Vercel |
| [GitHub — Repositório](https://github.com/saulozabot-pixel/LINTZ_INFRATECH) | 💻 Código-fonte do projeto no GitHub |
| [PushinPay](https://app.pushinpay.com.br) | 💰 Gateway de pagamento PIX (webhooks de cobrança) |
| [Evolution API](https://evolution-api.com) | 💬 API de WhatsApp para envio de códigos de ativação |

---

## 📅 2025-07-14 (Segunda-feira)

### ✅ O que foi feito
- **Vercel Analytics ativado** em todas as páginas do projeto:
  - `docs/index.html` — landing page principal
  - `docs/admin.html` — painel administrativo
  - `docs/checkout.html` — página de checkout/assinatura
  - `src/main.tsx` — app React (via componente `<Analytics />`)
- **Instalado** pacote `@vercel/analytics` no projeto
- **Deploy realizado** com sucesso na Vercel
- **Corrigido** atributo `rel="noopener noreferrer"` em link externo no checkout

### 🔗 Links úteis
- Site: https://lux-driver-assistent-18y8.vercel.app
- Admin: https://lux-driver-assistent-18y8.vercel.app/admin.html
- Analytics: https://vercel.com/saulozabot-pixels-projects/lux-driver-assistent-18y8/analytics

### 💡 Pendências / Próximos passos
- [ ] Implementar rastreamento de downloads do APK (contador via API)
- [ ] Verificar dados do Analytics após primeiras visitas

---

## 📅 2025-07-28 (Segunda-feira)

### ✅ O que foi feito

#### 🔥 Firebase Analytics integrado ao app Lux
- Criado `src/utils/analytics.ts` — implementação via **Firebase Measurement Protocol** (HTTP/fetch), sem dependências npm
- Eventos rastreados configurados:
  - `app_open` — ao abrir o app
  - `trial_started` — ao iniciar período de teste
  - `onboarding_complete` — ao concluir onboarding
  - `paywall_shown` — ao exibir tela de assinatura
  - `premium_activated` — ao ativar plano premium
  - `tab_changed` — ao trocar de aba
  - `permission_configured` — ao configurar permissões
- Firebase project: `lux-driver-assistant` (project_number: 661886047356)
- Firebase App ID: `1:661886047356:android:3bef6f234f2bde3c18e5f9`
- `android/app/google-services.json` adicionado (não commitado — chave privada)
- `src/App.tsx` atualizado com chamadas de analytics em todos os pontos-chave

#### 🏗️ Build Android — AAB versão 2 (1.1)
- Corrigido problema de JAVA_HOME no Gradle:
  - Adicionado `org.gradle.java.home=C:\\Program Files\\Android\\Android Studio\\jbr` em `android/gradle.properties`
  - Criado `tools/build-gradle-only.bat` que limpa JAVA_HOME e adiciona Java ao PATH
- Build bem-sucedido: `android/app/build/outputs/bundle/release/app-release.aab` (3 MB)
- `versionCode` atualizado para **2**, `versionName` para **"1.1"**

#### 🚀 Google Play Console — Teste Alpha
- AAB versão 2 (1.1) enviado para faixa **Teste fechado - Alpha**
- Testadores configurados (8 pessoas): AntonyPE, Emanoel PE, Everton Soares, Jobson Souza, kleyton Queiroz + lista "Motoristas SP" (3) + "Saulo Zabot" (3)
- País adicionado: **Brasil**
- Declaração de **ID de publicidade**: respondido **Não** (app não usa anúncios)
- Declaração de **Serviço de acessibilidade**: declarado como funcionalidade do app
- **13 mudanças enviadas para revisão** no Play Console
- Status: ⏳ aguardando aprovação do Google (horas/dias)

#### 📤 Deploy Vercel atualizado
- Commitado e enviado para GitHub: `feat: integra Firebase Analytics via Measurement Protocol`
- Vercel fez deploy automático — site atualizado com Firebase Analytics

### 🐛 Problemas encontrados e soluções

| Problema | Solução |
|---|---|
| JAVA_HOME inválido no Gradle | Adicionado `org.gradle.java.home` no `gradle.properties` + limpar JAVA_HOME no bat |
| Compartilhamento interno exige app publicado | Usar link de teste do Alpha após aprovação |
| Link enviado aos testadores era o de upload (admin) | Explicado: link correto é gerado após upload, formato `play.google.com/apps/test/...` |
| `google-services.json` não pode ir para o git | Mantido fora do commit (arquivo com chave privada) |

### 🔗 Links úteis
- Firebase Console: https://console.firebase.google.com/project/lux-driver-assistant
- Play Console Alpha: https://play.google.com/console → Lux → Teste → Teste fechado
- Site (Vercel): https://lux-driver-assistent-18y8.vercel.app

### 💡 Pendências / Próximos passos
- [ ] Aguardar email do Google aprovando o Alpha
- [ ] Após aprovação: copiar link de teste do Alpha e enviar para testadores via WhatsApp
- [ ] Verificar eventos no Firebase Analytics → DebugView quando testadores usarem o app
- [ ] Verificar se o Play Console exige vídeo de demonstração para o serviço de acessibilidade

---

## 📅 [TEMPLATE PARA PRÓXIMOS DIAS]

<!--
## 📅 YYYY-MM-DD (Dia da semana)

### ✅ O que foi feito
- Item 1
- Item 2

### 🐛 Problemas encontrados
- Problema e solução

### 🔗 Links / Referências
- Link relevante

### 💡 Pendências / Próximos passos
- [ ] Tarefa pendente
-->

---

*Atualizado manualmente ao final de cada sessão de trabalho.*
