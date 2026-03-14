// Vercel Serverless Function — Valida código de ativação LUX contra o banco
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'code_required' });
  }

  const normalized = code.trim().toUpperCase();

  try {
    const result = await pool.query(
      `SELECT id, plan, status, expires_at
         FROM lux_subscribers
        WHERE code = $1
        LIMIT 1`,
      [normalized]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ valid: false, error: 'not_found' });
    }

    const sub = result.rows[0];

    if (sub.status === 'cancelled') {
      return res.status(200).json({ valid: false, error: 'cancelled' });
    }

    if (new Date(sub.expires_at) < new Date()) {
      return res.status(200).json({ valid: false, error: 'expired' });
    }

    return res.status(200).json({
      valid: true,
      plan: sub.plan,
      expires_at: sub.expires_at,
    });

  } catch (err) {
    console.error('validate-code error:', err);
    return res.status(500).json({ valid: false, error: 'server_error' });
  }
}
