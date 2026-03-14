// Vercel Serverless Function — Gerencia assinantes (admin)
import { randomBytes } from 'crypto';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Autenticação simples via header
  const adminKey = (req.headers['x-admin-key'] || '').trim();
  const expectedKey = (process.env.LUX_ADMIN_KEY || 'S@021ulo').trim();
  if (adminKey !== expectedKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // GET — lista assinantes
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, phone, plan, code, status, expires_at, created_at
           FROM lux_subscribers
          ORDER BY created_at DESC
          LIMIT 500`
      );
      return res.status(200).json({ subscribers: result.rows });
    }

    // POST — cria assinante manualmente (admin gera código para quem pagou fora)
    if (req.method === 'POST') {
      const { phone, plan } = req.body || {};
      if (!phone || !plan) {
        return res.status(400).json({ error: 'phone e plan obrigatórios' });
      }
      const code = generateRandomCode();
      const expires_at = new Date();
      expires_at.setMonth(expires_at.getMonth() + planMonths(plan));

      const result = await pool.query(
        `INSERT INTO lux_subscribers (phone, plan, code, expires_at)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [phone.replace(/\D/g, ''), plan, code, expires_at.toISOString()]
      );
      return res.status(201).json({ subscriber: result.rows[0] });
    }

    // PATCH — atualiza status (cancelar, reativar)
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: 'id e status obrigatórios' });
      await pool.query(
        `UPDATE lux_subscribers SET status = $1 WHERE id = $2`,
        [status, id]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();

  } catch (err) {
    console.error('subscribers error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
}
