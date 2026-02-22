// Vercel Serverless Function — Cria pagamento PIX via PushinPay
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, plan } = req.body || {};

  if (!phone || !plan) {
    return res.status(400).json({ error: 'Telefone e plano são obrigatórios' });
  }

  const plans = {
    mensal:      { value: 990,  label: 'Mensal — R$ 9,90',    months: 1  },
    trimestral:  { value: 2490, label: 'Trimestral — R$ 24,90', months: 3 },
    anual:       { value: 7990, label: 'Anual — R$ 79,90',    months: 12 },
  };

  const selected = plans[plan];
  if (!selected) return res.status(400).json({ error: 'Plano inválido' });

  // external_reference carrega telefone + plano para o webhook recuperar
  const externalRef = `${phone.replace(/\D/g, '')}|${plan}|${Date.now()}`;

  // URL do webhook — usa VERCEL_PROJECT_PRODUCTION_URL ou WEBHOOK_BASE_URL
  const baseUrl = process.env.WEBHOOK_BASE_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` ||
    'https://lux-driver-assistent-18y8.vercel.app';

  try {
    const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PUSHINPAY_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        value: selected.value,
        webhook_url: `${baseUrl}/api/webhook-pushinpay`,
        external_reference: externalRef,
        description: `LUX Driver - ${selected.label}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PushinPay error:', data);
      return res.status(502).json({ error: 'Erro ao criar pagamento PIX', detail: data });
    }

    return res.status(200).json({
      qr_code:        data.qr_code        || data.pixCopiaECola || data.pix_code,
      qr_code_base64: data.qr_code_base64 || data.imagemQrcode  || null,
      txid:           data.id             || data.txid           || data.endToEndId,
      value:          selected.value,
      label:          selected.label,
    });

  } catch (err) {
    console.error('create-payment error:', err);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
}
