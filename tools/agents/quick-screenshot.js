/**
 * LUX Driver — Quick Screenshot
 * Uso: node tools/agents/quick-screenshot.js [url]
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'https://lux-driver-assistent-18y8.vercel.app';
const dir = path.join(__dirname, '../../.agent-output/screenshots');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const filename = `lux-${Date.now()}.png`;
const outputPath = path.join(dir, filename);

console.log(`\n  📸 Tirando screenshot de: ${url}`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

try {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`  ✅ Screenshot salvo: ${outputPath}\n`);
} catch (err) {
  console.error(`  ❌ Erro: ${err.message}\n`);
} finally {
  await browser.close();
}
