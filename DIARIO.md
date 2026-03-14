# 📓 Diário de Desenvolvimento — LUX Driver

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

## 📅 2026-03-13 (Sexta-feira)

### ✅ O que foi feito
- **Segurança crítica:** removido algoritmo DJB2 + SECRET do frontend (PaywallScreen.tsx)
  - Antes: geração de códigos acontecia no browser (SECRET exposta no bundle)
  - Agora: validação 100% server-side via `/api/validate-code`
- **Banco de dados:** criada tabela `lux_subscribers` no Supabase (compartilhado com Capitólio Premium)
  - Campos: `id`, `phone`, `plan`, `code` (UNIQUE), `txid`, `status`, `expires_at`, `created_at`
  - Índices em `code` e `phone` para performance
- **Nova API:** `api/validate-code.js` — valida código no banco, checa status e expiração
- **Nova API:** `api/subscribers.js` — painel admin (listar, criar, cancelar assinantes)
  - Autenticação via header `x-admin-key`
- **Webhook atualizado:** `api/webhook-pushinpay.js` agora gera códigos aleatórios com `crypto.randomBytes` e salva no banco
- **Vercel:** adicionadas env vars `DATABASE_URL` e `LUX_ADMIN_KEY` + redeploy
- **Evolution API:** confirmada configuração existente desde 22/02 — WhatsApp já funciona
- **PaywallScreen:** botão OK mostra `...` durante loading, desabilitado com `opacity-50`

### 🔗 Variáveis de ambiente Vercel (produção)
- `DATABASE_URL` — Supabase connection string (pgbouncer)
- `LUX_ADMIN_KEY` — chave de admin para `/api/subscribers`
- `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` — já estavam configuradas
- `PUSHINPAY_TOKEN`, `LUX_SECRET`, `VITE_APP_URL` — já estavam configuradas

### 💡 Pendências / Próximos passos
- Testar fluxo completo: criar assinante via API → validar código no app
- Build AAB v1.2: rodar `tools\build-gradle-only.bat`
- Upload AAB para Play Console (Alpha)
- Configurar PUSHINPAY_TOKEN com token real
- Separar banco Supabase do Capitólio Premium (quando crescer)

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

## 📅 2026-03-02 (Segunda-feira) — Projeto: Capitólio Premium

### ✅ O que foi feito

#### 🏠 Capitólio Premium — Site de aluguel de luxo em Capitólio/MG
Projeto Next.js 16 (Turbopack) com deploy na Vercel. Sessão de correções e novas funcionalidades.

**Correções de build (Next.js 16):**
- Removido `middleware.ts` conflitante com `proxy.ts` (Next.js 16 não aceita os dois simultaneamente)
- Corrigido `eslint.config.mjs` com extensões `.js` nos imports
- Corrigido `app/globals.css` para sintaxe Tailwind v4 (`@import "tailwindcss"`)
- Removido BOM (Byte Order Mark) de `app/admin/page.tsx`, `app/reservar/page.tsx`, `lib/properties-data.ts`

**Novas funcionalidades implementadas:**
- `components/HeroSlideshow.tsx` — Slideshow client-side com 4 imagens Unsplash, crossfade 5s, dots de navegação
- `app/page.tsx` — Reescrito com HeroSlideshow, fotos Unsplash nas propriedades, seção galeria, stats bar
- `proxy.ts` — Proteção de rotas `/admin/*` via Next.js 16 (substitui `middleware.ts`)
- `app/api/admin/login/route.ts` — POST login, valida senha, seta cookie `admin_session` (httpOnly, 7 dias)
- `app/api/admin/logout/route.ts` — POST logout, limpa cookie
- `app/admin/login/page.tsx` — Página de login com background Unsplash
- `components/AdminNav.tsx` — Header+nav admin reutilizável com botão logout
- `app/admin/page.tsx` — Dashboard reescrito com AdminNav
- `app/admin/reservas/page.tsx` — Tabela de reservas com AdminNav
- `app/admin/propriedades/page.tsx` — Cards de propriedades com imagens Unsplash
- `app/admin/servicos/page.tsx` — Gestão de serviços com AdminNav

**Páginas criadas:**
- `app/propriedades/[slug]/page.tsx` — Detalhes da propriedade com booking card
- `app/admin/reservas/page.tsx` — Lista de reservas admin
- `app/admin/propriedades/page.tsx` — Gestão de propriedades admin
- `app/admin/servicos/page.tsx` — Gestão de serviços admin

**Deploy:**
- Build local: ✅ Next.js 16.1.6 Turbopack
- Commit: `feat: hero slideshow, fotos, autenticacao admin, proxy.ts (Next.js 16)` (14 arquivos, 835 inserções)
- Deploy Vercel: ✅ LIVE

### 🧪 Testes realizados (9/9 ✅)

| Teste | Resultado |
|-------|-----------|
| POST `/api/admin/login` senha correta | ✅ 200 + cookie setado |
| POST `/api/admin/login` senha errada | ✅ 401 `{"error":"Senha incorreta"}` |
| GET `/admin` sem auth | ✅ 307 → `/admin/login?from=%2Fadmin` |
| GET `/admin/reservas` sem auth | ✅ 307 redirect |
| GET `/admin/propriedades` sem auth | ✅ 307 redirect |
| GET `/admin/servicos` sem auth | ✅ 307 redirect |
| GET `/propriedades/rancho-beira-represa` | ✅ 200 |
| GET `/propriedades/casa-premium-capitolio` | ✅ 200 |
| GET `/reservar` | ✅ 200 |

### 🐛 Problemas encontrados e soluções

| Problema | Solução |
|---|---|
| Build falhou: conflito `middleware.ts` + `proxy.ts` | Deletado `middleware.ts` via PowerShell `Remove-Item` |
| curl no Windows retornava 500 (escaping de JSON) | Usado script PowerShell com `Invoke-WebRequest` |
| Next.js 16 não suporta `eslint` config em `next.config.ts` | Removido `eslint.ignoreDuringBuilds` |

### 🔗 Links do projeto

| Link | Descrição |
|------|-----------|
| https://capitolio-premium.vercel.app | 🌐 Site principal |
| https://capitolio-premium.vercel.app/admin/login | 🔐 Painel admin (senha: `capitolio2026`) |
| https://github.com/saulozabot-pixel/Capit-lioPremium | 💻 GitHub (branch: main) |
| C:\Users\SAULO\capitolio-premium | 📁 Projeto local |

### 💡 Pendências / Próximos passos
- [ ] Adicionar fotos reais do Google Drive (substituir Unsplash)
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Configurar WhatsApp com Evolution API + n8n
- [ ] Configurar env var `ADMIN_PASSWORD` na Vercel (atualmente usa fallback `capitolio2026`)

---

## 📅 2026-03-02 — Sessão 2 — Projeto: XporY Pitch Deck

### ✅ O que foi feito

#### 📊 XporY.com — Pitch Deck Institucional para Investidores
Criação de pitch deck completo para apresentação a bancos de investimento e fundos de investimento, baseado na apresentação institucional existente (PDF em Downloads).

**Arquivo criado:**
- `docs/pitch-xpory-investidores.html` — Pitch deck completo (HTML single-file, 567 linhas)
- `C:\Users\SAULO\xpory-pitch\index.html` — Cópia para deploy dedicado
- `C:\Users\SAULO\xpory-pitch\vercel.json` — Config Vercel do projeto XporY

**Conteúdo do pitch deck (12 slides):**

| Slide | Título | Conteúdo |
|-------|--------|----------|
| 01 | Cover | Logo, tagline, 3 badges (Sebrae, Lei GO, Senado), 4 stats |
| 02 | O Problema | 22M+ MEIs, R$400B ociosos, 5 dores do mercado |
| 03 | A Solução | 6 pilares: Web+App, X$, Rede Multilateral, Loja Física, Adiantamento, Resolução de Dívidas |
| 04 | Como Funciona | Fluxo Ana→Pedro→Luísa→Ricardo + benefícios vendedor/comprador |
| 05 | A Moeda X$ | Paridade X$1=R$1, 4 operações, diferencial competitivo |
| 06 | Mercado | TAM R$2,5T / SAM R$400B / SOM R$4B + 4 métricas |
| 07 | Modelo de Negócio | 10% taxa, 4 fontes de receita, gráfico projeção R$40M+ Ano 5 |
| 08 | Tração | 900+ depoimentos, Sebrae Nacional, Feira do Empreendedor |
| 09 | Reconhecimento | Lei GO, Senado Federal, Governador GO, Mídia + 4 aplicações |
| 10 | Vantagens Competitivas | 6 diferenciais: Pioneirismo, Validação Gov., Moeda Proprietária, Sebrae, Efeito Rede, Tecnologia |
| 11 | Roadmap | 4 fases: Concluído → 2026 → 2027 → 2028+ Internacional |
| 12 | Captação | Série A, uso dos recursos (40/35/25%), valuation, retorno 10x-20x |
| + | Contato | Links, redes sociais, botão Cadastre-se funcional |

**Funcionalidades:**
- Design dark com identidade visual XporY (teal `#00c4b4` + laranja `#f5a623`)
- Responsivo (mobile-friendly)
- Navegação fixa com âncoras para cada seção
- Badge "CONFIDENCIAL" no header
- Botão **🚀 Cadastre-se Agora** funcional → `https://xpory.com/indicar/qhsYkx65erb7` (abre em nova aba)

**Deploy:**
- Projeto Vercel dedicado criado: `saulozabot-pixels-projects/xpory`
- URL de produção: **https://xpory.vercel.app**
- Deploy via Vercel CLI: `vercel --yes` (sem passar pelo projeto Lux)
- Commit no repo Lux: `feat: pitch deck institucional XporY.com para investidores`

### 🐛 Problemas encontrados e soluções

| Problema | Solução |
|---|---|
| `create_file` truncava o conteúdo (arquivo muito grande) | Usado `edit_file` para completar os slides restantes |
| `start ""` não funciona no PowerShell | Usado `Invoke-Item` para abrir o HTML no browser |
| GitHub CLI precisava de auth para criar repo | Deploy direto via Vercel CLI (sem precisar do GitHub) |
| URL do Vercel mostrava "lux" no nome | Criado projeto Vercel separado com nome "xpory" → URL `xpory.vercel.app` |

### 🔗 Links do projeto

| Link | Descrição |
|------|-----------|
| https://xpory.vercel.app | 🌐 Pitch deck online (URL limpa, sem "lux") |
| https://vercel.com/saulozabot-pixels-projects/xpory | ⚙️ Painel Vercel do projeto XporY |
| C:\Users\SAULO\xpory-pitch\ | 📁 Projeto local dedicado |
| https://xpory.com/indicar/qhsYkx65erb7 | 🔗 Link de indicação XporY (botão Cadastre-se) |

### 💰 Créditos BLACKBOX AI utilizados hoje (estimativa)

> ⚠️ Nota: O BLACKBOX AI não expõe contagem exata de créditos por sessão. Estimativa baseada em volume de tokens processados.

| Projeto | Atividade | Créditos estimados |
|---------|-----------|-------------------|
| Capitólio Premium | Retomada de contexto + leitura de arquivos | ~15 créditos |
| XporY Pitch Deck | Leitura do PDF + criação do HTML (12 slides) + iterações de edição | ~60 créditos |
| XporY Deploy | Deploy Vercel CLI + commits + ajustes | ~10 créditos |
| **Total estimado** | | **~85 créditos** |

### 💡 Pendências / Próximos passos
- [ ] Adicionar dados reais de faturamento/usuários quando disponíveis
- [ ] Personalizar valuation e valor da rodada Série A
- [ ] Adicionar fotos reais da plataforma XporY nos slides
- [ ] Continuar correções do Capitólio Premium (fotos reais, pagamento, WhatsApp)

---

## 📅 2026-03-02 — Sessão 3 — Ferramenta: Gerenciador de Créditos AI

### ✅ O que foi feito

#### 💳 `tools/credit-manager.html` — Dashboard de ROI e Créditos BLACKBOX AI
Criação de ferramenta standalone (HTML puro + localStorage) para controle financeiro das sessões de desenvolvimento com IA.

**Funcionalidades implementadas:**

| Feature | Descrição |
|---------|-----------|
| 📊 5 cards de stats | Créditos totais, Custo R$, Tempo AI, Equiv. Dev (h), ROI |
| ⚙️ Config ajustável | Custo/crédito, multiplicador AI→Dev, hora dev sênior, câmbio USD/BRL |
| 📋 Histórico de sessões | Tabela com data, projeto, descrição, créditos, tempo, equiv. dev, custo |
| 📈 Gráfico de barras | Créditos por projeto (LUX, Capitólio, XporY, Outro) |
| 📊 Painel ROI | Custo AI vs custo dev humano, economia total, multiplicador, horas economizadas |
| ⏱️ Timer integrado | Cronômetro da sessão atual com pause/resume + equiv. dev em tempo real |
| 📥 Preload de dados | Botão carrega automaticamente as sessões de hoje (2026-03-02) |
| 📤 Export CSV | Download do histórico completo em CSV |
| 💾 Persistência | localStorage — dados sobrevivem ao fechar/reabrir o browser |

**Configurações padrão:**
- Custo por crédito: **R$ 0,30**
- Multiplicador AI→Dev: **8x** (1h AI = 8h dev humano = 1 dia útil)
- Hora dev sênior: **R$ 150**
- Câmbio: **R$ 5,80/USD**

**ROI calculado para hoje (85 créditos, 75 min AI):**
- Custo AI: **R$ 25,50**
- Equiv. dev: **10h** de trabalho humano
- Custo dev equivalente: **R$ 1.500**
- **Economia: R$ 1.474,50 → ROI 58x**

**Arquivo:** `tools/credit-manager.html` (standalone, sem dependências, sem servidor)

### 🔗 Como usar
```
Abrir: tools/credit-manager.html no browser
Clicar: "📥 Carregar dados de hoje" para pré-carregar sessões de 2026-03-02
Ajustar: configurações de custo/multiplicador conforme seu plano BLACKBOX
```

---

## 📅 2026-03-12 (Quinta-feira) — Versão 1.2 (versionCode 3)

### ✅ O que foi feito

#### 🐛 Bugs corrigidos

| Bug | Causa | Correção |
|-----|-------|---------|
| 99 não detectava corridas | Pacotes `com.taxis99` / `com.taxis99.driver` ausentes na whitelist | Adicionados + triggers "Aceitar corrida", "Ver oferta", "Pegar corrida" |
| Uber parava às vezes | WebView não acessível + throttle alto | `canRequestEnhancedWebAccessibility=true` + throttle 400ms→250ms |
| Corridas similares bloqueadas | Dedup lock de 8s muito longo | Reduzido para 5s |
| Versão errada no app | Settings mostrava v1.0.0 | Corrigido para v1.1 |

#### ☀️ Nova feature — Bolinha de status flutuante

- **Arquivo criado:** `android/app/src/main/java/com/lux/motorista/StatusBubbleManager.kt`
- Sol dourado desenhado programaticamente (Canvas — círculo + 8 raios + texto "LUX")
- Arrastável por toda a tela via `WindowManager.updateViewLayout()`
- Posição salva em SharedPreferences entre sessões
- Toque simples → abre o app (`MainActivity`)
- Aparece quando serviço conecta (`onServiceConnected`)
- Remove quando serviço destrói (`onDestroy`)
- Mesma técnica do concorrente GIGU (`TYPE_ACCESSIBILITY_OVERLAY`)

#### 📄 Documentação

- `CLAUDE.md` criado na raiz — contexto completo do projeto para sessões futuras com IA
- Migração do contexto do Antigravity/Gemini para Claude Code

### 🔗 Arquivos alterados

- `RideService.kt` — packages 99/InDriver, triggers, throttle, dedup lock, StatusBubble
- `accessibility_service_config.xml` — `canRequestEnhancedWebAccessibility`
- `SettingsScreen.tsx` — versão v1.0.0→v1.1
- `build.gradle` — versionCode 2→3, versionName 1.1→1.2
- `StatusBubbleManager.kt` — **NOVO**
- `CLAUDE.md` — **NOVO**

### 🐛 Problemas encontrados

Nenhum na sessão de hoje — build pendente para amanhã.

### 🔗 Links úteis

- Firebase: https://console.firebase.google.com/project/lux-driver-assistant
- Play Console: https://play.google.com/console → Lux → Teste → Teste fechado Alpha
- Site: https://lux-driver-assistent-18y8.vercel.app

### 💡 Pendências / Próximos passos

- [ ] **AMANHÃ:** Rodar `tools\build-gradle-only.bat` para gerar AAB v1.2
- [ ] Instalar APK no celular e testar bolinha + detecção 99
- [ ] Enviar AAB para Play Console (Alpha)
- [ ] Enviar link de teste para testadores via WhatsApp
- [ ] Implementar botão "Encerrar Jornada" (pausa/retoma o serviço pelo app)

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
