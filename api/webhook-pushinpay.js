// Vercel Serverless Function — Recebe confirmação de pagamento PushinPay
// Gera código LUX e envia via WhatsApp (Evolution API)

// ── Gerador de código (mesmo algoritmo do app) ────────────────────────────────
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateLuxCode(seed) {
  const SECRET = process.env.LUX_SECRET || 'LUX_SAULO_2025_DRIVER';
  const CHARS  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let h = djb2Hash(SECRET + seed);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += CHARS[h % CHARS.length];
    h = Math.floor(h / CHARS.length);
    if (h < CHARS.length) h = djb2Hash(SECRET + seed + i);
  }
  return `LUX-${code.slice(0, 4)}-${code.slice(4, 8)}`;
}

// ── Envia mensagem via Evolution API ─────────────────────────────────────────
async function sendWhatsApp(phone, message) {
  const apiUrl      = process.env.EVOLUTION_API_URL;   // ex: https://roaringtigershark-evolution.cloudfy.live
  const apiKey      = process.env.EVOLUTION_API_KEY;   // API Key global do Evolution
  const instance    = process.env.EVOLUTION_INSTANCE;  // Nome da instância (ver Painel)

  if (!apiUrl || !apiKey || !instance) {
    console.error('Evolution API não configurada — verifique as env vars');
    return false;
  }

  // Formata número: remove não-dígitos, garante DDI 55
  let number = phone.replace(/\D/g, '');
  if (!number.startsWith('55')) number = '55' + number;

  const url = `${apiUrl}/message/sendText/${instance}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number, text: message }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Evolution API error:', err);
      return false;
    }
    return true;
  } catch (err) {
    console.error('sendWhatsApp error:', err);
    return false;
  }
}

// ── Monta mensagem de ativação ────────────────────────────────────────────────
function buildMessage(code, plan) {
  const planInfo = {
    mensal:     { label: 'Mensal',     duration: '30 dias'  },
    trimestral: { label: 'Trimestral', duration: '90 dias'  },
    anual:      { label: 'Anual',      duration: '365 dias' },
  };
  const info = planInfo[plan] || { label: plan, duration: '' };

  return (
    `🚗 *LUX Driver — Ativação Premium* ✅\n\n` +
    `Pagamento confirmado! Obrigado pela confiança 🙏\n\n` +
    `📋 *Plano:* ${info.label}${info.duration ? ` (${info.duration})` : ''}\n` +
    `🔑 *Código de ativação:*\n\n` +
    `┌─────────────────┐\n` +
    `│   *${code}*   │\n` +
    `└─────────────────┘\n\n` +
    `*Como ativar:*\n` +
    `1️⃣ Abra o *LUX Driver*\n` +
    `2️⃣ Toque em ⚙️ Configurações\n` +
    `3️⃣ Toque em *"Ativar Premium"*\n` +
    `4️⃣ Digite o código acima\n` +
    `5️⃣ Pronto! Aproveite 🚀\n\n` +
    `Dúvidas? Responda esta mensagem 😊`
  );
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // PushinPay envia POST; aceita também GET para teste
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook endpoint ativo' });
  }
  if (req.method !== 'POST') return res.status(405).end();

  const payload = req.body || {};
  console.log('PushinPay webhook recebido:', JSON.stringify(payload));

  // ── Verifica se o pagamento foi aprovado ──────────────────────────────────
  // PushinPay pode enviar status como: "paid", "PAID", "approved", "APPROVED"
  const status = (
    payload.status ||
    payload.payment?.status ||
    payload.data?.status ||
    ''
  ).toLowerCase();

  if (!['paid', 'approved', 'completed'].includes(status)) {
    console.log('Webhook ignorado — status:', status);
    return res.status(200).json({ received: true, ignored: true, status });
  }

  // ── Extrai external_reference: "phone|plan|timestamp" ────────────────────
  const externalRef = (
    payload.external_reference ||
    payload.payment?.external_reference ||
    payload.data?.external_reference ||
    ''
  );

  const parts = externalRef.split('|');
  const phone = parts[0];
  const plan  = parts[1];
  const ts    = parts[2] || Date.now().toString();

  if (!phone || !plan) {
    console.error('external_reference inválido:', externalRef);
    return res.status(200).json({ received: true, error: 'invalid_ref' });
  }

  // ── Gera código único baseado no txid + telefone ──────────────────────────
  const txid = payload.id || payload.txid || payload.payment?.id || ts;
  const code = generateLuxCode(`${txid}${phone}`);

  console.log(`✅ Pagamento confirmado — phone: ${phone}, plan: ${plan}, code: ${code}`);

  // ── Envia WhatsApp ────────────────────────────────────────────────────────
  const message = buildMessage(code, plan);
  const sent = await sendWhatsApp(phone, message);

  console.log(`WhatsApp enviado: ${sent}`);

  return res.status(200).json({
    received: true,
    phone,
    plan,
    code,
    whatsapp_sent: sent,
  });
}
