/**
 * analytics.ts
 * Firebase Analytics via Measurement Protocol (HTTP) — sem dependências externas.
 * Funciona em Android (Capacitor) e Web.
 *
 * CONFIGURAÇÃO:
 * 1. Acesse analytics.google.com
 * 2. Admin (⚙️) → Data Streams → Android stream (com.lux.motorista)
 * 3. Role até "Measurement Protocol API secrets" → Criar
 * 4. Cole o valor gerado em FIREBASE_API_SECRET abaixo
 */

// ── Configuração Firebase ─────────────────────────────────────────────────────
// firebase_app_id vem do google-services.json (já configurado ✅)
const FIREBASE_APP_ID = '1:661886047356:android:3bef6f234f2bde3c18e5f9';
const FIREBASE_API_SECRET = '48u6Mu45RRStGoDgk1Pwwg'; // ✅ API Secret configurado

const ANALYTICS_ENDPOINT = `https://www.google-analytics.com/mp/collect?firebase_app_id=${FIREBASE_APP_ID}&api_secret=${FIREBASE_API_SECRET}`;

// ── App Instance ID persistente (identifica o dispositivo) ───────────────────
function getAppInstanceId(): string {
  let instanceId = localStorage.getItem('lux_firebase_instance_id');
  if (!instanceId) {
    // Gera um ID aleatório de 32 caracteres hexadecimais (formato Firebase)
    instanceId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem('lux_firebase_instance_id', instanceId);
  }
  return instanceId;
}

// ── Session ID (identifica a sessão atual) ────────────────────────────────────
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('lux_analytics_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString();
    sessionStorage.setItem('lux_analytics_session_id', sessionId);
  }
  return sessionId;
}

// ── Envio de evento ───────────────────────────────────────────────────────────
export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  // Sempre loga no console para debug
  console.log(`[Analytics] 📊 ${name}`, params ?? '');

  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_instance_id: getAppInstanceId(),
        events: [
          {
            name,
            params: {
              ...params,
              session_id: getSessionId(),
              engagement_time_msec: 100,
            },
          },
        ],
      }),
    });
  } catch (e) {
    // Falha silenciosa — não afeta o app
    console.warn('[Analytics] Erro ao enviar evento:', e);
  }
}

// ── Eventos pré-definidos do app Lux ─────────────────────────────────────────
export const Analytics = {
  /** App aberto */
  appOpen: () => logEvent('app_open'),

  /** Primeiro uso — trial iniciado */
  trialStarted: () => logEvent('trial_started'),

  /** Onboarding concluído */
  onboardingComplete: () => logEvent('onboarding_complete'),

  /** Paywall exibido */
  paywallShown: (daysLeft: number) =>
    logEvent('paywall_shown', { trial_days_left: daysLeft }),

  /** Premium ativado */
  premiumActivated: () => logEvent('premium_activated'),

  /** Navegação entre abas */
  tabChanged: (tab: string) =>
    logEvent('tab_changed', { tab_name: tab }),

  /** Permissão configurada */
  permissionConfigured: (permission: 'accessibility' | 'overlay' | 'battery') =>
    logEvent('permission_configured', { permission_type: permission }),

  /** Todas as permissões ativas */
  allPermissionsActive: () => logEvent('all_permissions_active'),
};
