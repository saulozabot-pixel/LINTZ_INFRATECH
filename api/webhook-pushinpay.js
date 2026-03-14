// Vercel Serverless Function — Recebe confirmação de pagamento PushinPay
// Gera código LUX aleatório, salva no banco, envia via WhatsApp (Evolution API)
import { randomBytes } from 'crypto';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── Gerador de código aleatório ───────────────────────────────────────────────
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0/O/1/I

function generateRandomCode() {
  const bytes = randomBytes(8);
  let part1 = '', part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += CHARS[bytes[i] % CHARS.length];
    part2 += CHARS[bytes[i + 4] % CHARS.length];
  }
  return `LUX-${part1}-${part2}`;
}

function planMonths(plan) {
  if (plan === 'mensal') return 1;
  if (plan === 'trimestral') return 3;
  if (plan === 'anual') return 12;
  return 1;
}

// ── Salva assinante no banco ──────────────────────────────────────────────────
async function saveSubscriber(phone, plan, code, txid) {
  const expires_at = new Date();
  expires_at.setMonth(expires_at.getMonth() + planMonths(plan));

  await pool.query(
    `INSERT INTO lux_subscribers (phone, plan, code, txid, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (code) DO NOTHING`,
    [phone.replace(/\D/g, ''), plan, code, txid, expires_at.toISOString()]
  );
}

// ── Envia mensagem via Evolution API ─────────────────────────────────────────
async function sendWhatsApp(phone, message) {
  const apiUrl   = (process.env.EVOLUTION_API_URL  || '').trim();
  const apiKey   = (process.env.EVOLUTION_API_KEY  || '').trim();
  const instance = (process.env.EVOLUTION_INSTANCE || '').trim();

  if (!apiUrl || !apiKey || !instance) {
    console.error('Evolution API não configurada — verifique as env vars');
    return { ok: false, error: 'env_vars_missing' };
  }

  let number = phone.replace(/\D/g, '');
  if (!number.startsWith('55')) number = '55' + number;

  try {
    const res = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: { 'apikey': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, text: message }),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error('Evolution API error:', res.status, body);
      return { ok: false, status: res.status, error: body };
    }
    return { ok: true };
  } catch (err) {
    console.error('sendWhatsApp error:', err);
    return { ok: false, error: err.message };
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
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook endpoint ativo' });
  }
  if (req.method !== 'POST') return res.status(405).end();

  const payload = req.body || {};
  console.log('PushinPay webhook recebido:', JSON.stringify(payload));

  // Verifica se o pagamento foi aprovado
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

  // Extrai external_reference: "phone|plan|timestamp"
  const externalRef = (
    payload.external_reference ||
    payload.payment?.external_reference ||
    payload.data?.external_reference ||
    ''
  );

  const parts = externalRef.split('|');
  const phone = parts[0];
  const plan  = parts[1];

  if (!phone || !plan) {
    console.error('external_reference inválido:', externalRef);
    return res.status(200).json({ received: true, error: 'invalid_ref' });
  }

  const txid = payload.id || payload.txid || payload.payment?.id || Date.now().toString();

  // Gera código aleatório e salva no banco
  const code = generateRandomCode();
  await saveSubscriber(phone, plan, code, txid);

  console.log(`✅ Pagamento confirmado — phone: ${phone}, plan: ${plan}, code: ${code}`);

  // Envia WhatsApp
  const message = buildMessage(code, plan);
  const sent = await sendWhatsApp(phone, message);

  console.log('WhatsApp resultado:', sent);

  return res.status(200).json({
    received: true,
    phone,
    plan,
    code,
    whatsapp_sent: sent?.ok === true,
  });
}
