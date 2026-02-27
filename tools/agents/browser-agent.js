#!/usr/bin/env node
/**
 * LUX Driver — Browser Agent (Puppeteer)
 * Agente interativo para automação de browser
 * Uso: node tools/agents/browser-agent.js
 */

import puppeteer from 'puppeteer';
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '../../.agent-output/screenshots');
const PDFS_DIR = path.join(__dirname, '../../.agent-output/pdfs');

// Garantir que as pastas de output existam
[SCREENSHOTS_DIR, PDFS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

// ─────────────────────────────────────────────
// MENU PRINCIPAL
// ─────────────────────────────────────────────
async function main() {
  console.log('\n  ╔══════════════════════════════════════════╗');
  console.log('  ║   🤖 LUX Browser Agent (Puppeteer)      ║');
  console.log('  ╚══════════════════════════════════════════╝\n');

  console.log('  Escolha uma ação:\n');
  console.log('  [1] 📸 Screenshot de URL');
  console.log('  [2] 📄 Gerar PDF de página web');
  console.log('  [3] 🔍 Testar deploy Vercel (LUX)');
  console.log('  [4] 🌐 Abrir URL no browser visível');
  console.log('  [5] 🔗 Verificar todos os links de uma página');
  console.log('  [6] ⚡ Medir performance de carregamento');
  console.log('  [7] 🖥️  Modo interativo (controle manual)');
  console.log('  [8] ❌ Sair\n');

  const opcao = await ask('  Digite a opção (1-8): ');

  switch (opcao.trim()) {
    case '1': await takeScreenshot(); break;
    case '2': await generatePDF(); break;
    case '3': await testVercelDeploy(); break;
    case '4': await openBrowser(); break;
    case '5': await checkLinks(); break;
    case '6': await measurePerformance(); break;
    case '7': await interactiveMode(); break;
    case '8': console.log('\n  👋 Até logo!\n'); rl.close(); return;
    default:
      console.log('\n  ❌ Opção inválida.\n');
      await main();
  }

  rl.close();
}

// ─────────────────────────────────────────────
// 1. SCREENSHOT
// ─────────────────────────────────────────────
async function takeScreenshot() {
  const url = await ask('\n  URL para screenshot (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';
  const filename = `screenshot-${Date.now()}.png`;
  const outputPath = path.join(SCREENSHOTS_DIR, filename);

  console.log(`\n  📸 Abrindo: ${targetUrl}`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`  ✅ Screenshot salvo: ${outputPath}`);
  } catch (err) {
    console.log(`  ❌ Erro: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────
// 2. GERAR PDF
// ─────────────────────────────────────────────
async function generatePDF() {
  const url = await ask('\n  URL para gerar PDF (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';
  const filename = `page-${Date.now()}.pdf`;
  const outputPath = path.join(PDFS_DIR, filename);

  console.log(`\n  📄 Gerando PDF de: ${targetUrl}`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    console.log(`  ✅ PDF salvo: ${outputPath}`);
  } catch (err) {
    console.log(`  ❌ Erro: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────
// 3. TESTAR DEPLOY VERCEL
// ─────────────────────────────────────────────
async function testVercelDeploy() {
  const BASE_URL = 'https://lux-driver-assistent-18y8.vercel.app';
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/pitch-deck-locadora-ev.html', name: 'Pitch Deck EV' },
    { path: '/arquitetura-solucao/', name: 'Arquitetura de Solução' },
    { path: '/checkout.html', name: 'Checkout' },
  ];

  console.log(`\n  🔍 Testando deploy: ${BASE_URL}\n`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let passed = 0, failed = 0;

  for (const route of routes) {
    const url = BASE_URL + route.path;
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response.status();
      const ok = status >= 200 && status < 400;
      console.log(`  ${ok ? '✅' : '❌'} [${status}] ${route.name} — ${url}`);
      ok ? passed++ : failed++;
    } catch (err) {
      console.log(`  ❌ [ERR] ${route.name} — ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n  📊 Resultado: ${passed} OK, ${failed} falhas`);
  if (failed === 0) console.log('  🎉 Deploy 100% funcional!\n');
  else console.log('  ⚠️  Verifique as rotas com falha.\n');
}

// ─────────────────────────────────────────────
// 4. ABRIR BROWSER VISÍVEL
// ─────────────────────────────────────────────
async function openBrowser() {
  const url = await ask('\n  URL para abrir (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';

  console.log(`\n  🌐 Abrindo browser em: ${targetUrl}`);
  console.log('  (Pressione Ctrl+C para fechar)\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  // Manter aberto até o usuário fechar
  await new Promise(resolve => {
    browser.on('disconnected', resolve);
  });
}

// ─────────────────────────────────────────────
// 5. VERIFICAR LINKS
// ─────────────────────────────────────────────
async function checkLinks() {
  const url = await ask('\n  URL para verificar links (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';

  console.log(`\n  🔗 Verificando links em: ${targetUrl}\n`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const links = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')]
        .map(a => a.href)
        .filter(href => href.startsWith('http'))
        .filter((v, i, arr) => arr.indexOf(v) === i) // unique
    );

    console.log(`  Encontrados ${links.length} links únicos\n`);
    let ok = 0, broken = 0;

    for (const link of links.slice(0, 20)) { // limitar a 20 para não demorar
      try {
        const res = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const status = res.status();
        const isOk = status >= 200 && status < 400;
        console.log(`  ${isOk ? '✅' : '❌'} [${status}] ${link}`);
        isOk ? ok++ : broken++;
      } catch {
        console.log(`  ❌ [ERR] ${link}`);
        broken++;
      }
    }

    console.log(`\n  📊 ${ok} OK, ${broken} quebrados`);
  } catch (err) {
    console.log(`  ❌ Erro: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────
// 6. MEDIR PERFORMANCE
// ─────────────────────────────────────────────
async function measurePerformance() {
  const url = await ask('\n  URL para medir (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';

  console.log(`\n  ⚡ Medindo performance: ${targetUrl}\n`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const start = Date.now();
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    const loadTime = Date.now() - start;

    const metrics = await page.metrics();
    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcp: Math.round(nav.connectEnd - nav.connectStart),
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domLoad: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        fullLoad: Math.round(nav.loadEventEnd - nav.startTime),
      };
    });

    console.log(`  📊 Resultados de Performance:`);
    console.log(`  ─────────────────────────────`);
    console.log(`  DNS Lookup:     ${perf.dns}ms`);
    console.log(`  TCP Connect:    ${perf.tcp}ms`);
    console.log(`  TTFB:           ${perf.ttfb}ms`);
    console.log(`  DOM Loaded:     ${perf.domLoad}ms`);
    console.log(`  Full Load:      ${perf.fullLoad}ms`);
    console.log(`  Total (real):   ${loadTime}ms`);
    console.log(`  JS Heap:        ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);

    const rating = loadTime < 2000 ? '🟢 Rápido' : loadTime < 4000 ? '🟡 Médio' : '🔴 Lento';
    console.log(`\n  Avaliação: ${rating}\n`);
  } catch (err) {
    console.log(`  ❌ Erro: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────
// 7. MODO INTERATIVO
// ─────────────────────────────────────────────
async function interactiveMode() {
  const url = await ask('\n  URL inicial (Enter = site LUX): ');
  const targetUrl = url.trim() || 'https://lux-driver-assistent-18y8.vercel.app';

  console.log('\n  🖥️  Modo interativo — browser aberto');
  console.log('  Comandos: screenshot | pdf | goto <url> | title | sair\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  while (true) {
    const cmd = await ask('  > ');
    const [action, ...args] = cmd.trim().split(' ');

    if (action === 'sair' || action === 'exit') break;
    if (action === 'screenshot') {
      const f = path.join(SCREENSHOTS_DIR, `interactive-${Date.now()}.png`);
      await page.screenshot({ path: f, fullPage: true });
      console.log(`  ✅ Screenshot: ${f}`);
    } else if (action === 'pdf') {
      const f = path.join(PDFS_DIR, `interactive-${Date.now()}.pdf`);
      await page.pdf({ path: f, format: 'A4', printBackground: true });
      console.log(`  ✅ PDF: ${f}`);
    } else if (action === 'goto') {
      await page.goto(args.join(' '), { waitUntil: 'networkidle2' });
      console.log(`  ✅ Navegou para: ${args.join(' ')}`);
    } else if (action === 'title') {
      console.log(`  📄 Título: ${await page.title()}`);
    } else {
      console.log('  ❓ Comandos: screenshot | pdf | goto <url> | title | sair');
    }
  }

  await browser.close();
  console.log('  ✅ Browser fechado.\n');
}

main().catch(err => {
  console.error('\n  ❌ Erro fatal:', err.message);
  process.exit(1);
});
