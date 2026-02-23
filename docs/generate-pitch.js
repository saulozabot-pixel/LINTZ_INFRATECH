#!/usr/bin/env node
/**
 * generate-pitch.js
 * Atualiza os valores financeiros do pitch deck LuxDrive EV a partir de parâmetros.
 * Uso: node docs/generate-pitch.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PITCH_FILE = path.join(__dirname, 'pitch-deck-locadora-ev.html');
const DRY_RUN    = process.argv.includes('--dry-run');

// ─── Parâmetros financeiros ────────────────────────────────────────────────────
const params = {
  // Veículos
  dolphinMiniUnit : 95_000,   // R$ por unidade
  dolphinGSUnit   : 150_000,

  // Cenário A — 5 carros
  cenarioA: {
    carros       : 5,
    eletropostos : 24_000,   // 2 × R$ 12.000
    instalacao   : 30_000,
    base         : 40_000,
    sistema      : 15_000,
    capitalGiro  : 41_000,
  },

  // Cenário B — 10 carros
  cenarioB: {
    carros       : 10,
    eletropostos : 48_000,   // 4 × R$ 12.000
    instalacao   : 45_000,
    base         : 60_000,
    sistema      : 22_000,
    capitalGiro  : 75_000,
  },

  // Operacional
  aluguelSemanal    : 1_700,
  ocupacaoPlena     : 0.88,
  seguro5carros     : 3_250,
  ebitda5carros     : 10_500,
};

// ─── Cálculos derivados ────────────────────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('pt-BR');
}

const miniUnit = params.dolphinMiniUnit;
const gsUnit   = params.dolphinGSUnit;

const totalA = params.cenarioA.carros * miniUnit
             + params.cenarioA.eletropostos
             + params.cenarioA.instalacao
             + params.cenarioA.base
             + params.cenarioA.sistema
             + params.cenarioA.capitalGiro;

const totalB = params.cenarioB.carros * miniUnit
             + params.cenarioB.eletropostos
             + params.cenarioB.instalacao
             + params.cenarioB.base
             + params.cenarioB.sistema
             + params.cenarioB.capitalGiro;

const subtotalA = params.cenarioA.carros * miniUnit;
const subtotalB = params.cenarioB.carros * miniUnit;

const residualMini = Math.round(miniUnit * 0.55 / 1000) * 1000; // 55%, arredondado p/ mil

// CAPEX GS (preço GS, mesma infra)
const totalAgs = params.cenarioA.carros * gsUnit
               + params.cenarioA.eletropostos
               + params.cenarioA.instalacao
               + params.cenarioA.base
               + params.cenarioA.sistema
               + params.cenarioA.capitalGiro;

const totalBgs = params.cenarioB.carros * gsUnit
               + params.cenarioB.eletropostos
               + params.cenarioB.instalacao
               + params.cenarioB.base
               + params.cenarioB.sistema
               + params.cenarioB.capitalGiro;

// ─── Mapa de substituições ─────────────────────────────────────────────────────
// Cada entrada: [padrão regex, substituição]
const replacements = [
  // Cover — captação
  [
    /(<strong[^>]*>💰 Captação<\/strong>)R\$\s*[\d.,]+K\s*–\s*R\$\s*[\d.,]+M/,
    `$1R$ ${Math.round(totalA/1000)}K – R$ ${(totalB/1_000_000).toFixed(2).replace('.',',')}M`
  ],

  // S5 — Cenário A header
  [
    /Captação: R\$\s*[\d.]+(?=\s*<\/div>\s*<table[\s\S]*?BYD Dolphin Mini.*?<td>5<\/td>)/,
    `Captação: R$ ${fmt(totalA)}`
  ],

  // S5 — Cenário A: linha BYD Mini (unit + total)
  [
    /(<td>BYD Dolphin Mini \(base\)<\/td><td>5<\/td><td class="tm">)R\$\s*[\d.]+(<\/td><td class="tg">)R\$\s*[\d.]+(<\/td><\/tr>)/,
    `$1R$ ${fmt(miniUnit)}$2R$ ${fmt(subtotalA)}$3`
  ],

  // S5 — Cenário A: TOTAL row
  // Fix: usa [\s\S]*? para passar pelo <span> tag dentro do <div> após a tabela
  [
    /(<tr style="background:rgba\(0,230,118,\.08\);"><td><strong>TOTAL<\/strong><\/td><td><\/td><td><\/td><td><strong class="tg">)R\$\s*[\d.]+(<\/strong><\/td><\/tr>\s*<\/table>\s*<div[^>]*>[\s\S]*?900K)/,
    `$1R$ ${fmt(totalA)}$2`
  ],

  // S5 — Cenário B header
  // Fix: usa padrão direto "Cenário B[^<]*Captação" para evitar lookahead que
  //      atravessava a seção do Cenário A e capturava o header errado (bug crítico)
  [
    /(Cenário B[^<]*Captação: R\$\s*)[\d.]+/,
    `$1${fmt(totalB)}`
  ],

  // S5 — Cenário B: linha BYD Mini (unit + total)
  [
    /(<td>BYD Dolphin Mini \(base\)<\/td><td>10<\/td><td class="tm">)R\$\s*[\d.]+(<\/td><td class="tg">)R\$\s*[\d.]+(<\/td><\/tr>)/,
    `$1R$ ${fmt(miniUnit)}$2R$ ${fmt(subtotalB)}$3`
  ],

  // S5 — Cenário B: TOTAL row
  // Fix: ancora no "Cenário B" para não atravessar a seção do Cenário A
  //      (mesmo padrão de correção aplicado ao header do Cenário B)
  [
    /(Cenário B[\s\S]*?<tr style="background:rgba\(0,230,118,\.08\);"><td><strong>TOTAL<\/strong><\/td><td><\/td><td><\/td><td><strong class="tg">)R\$\s*[\d.]+(<\/strong><\/td><\/tr>)/,
    `$1R$ ${fmt(totalB)}$2`
  ],

  // S5 — KPI: preço Mini
  [
    /(<div class="kv">)R\$\s*\d+K(<\/div><div class="kl">Dolphin Mini)/,
    `$1R$ ${Math.round(miniUnit/1000)}K$2`
  ],

  // S5 — KPI: valor residual Mini
  [
    /(<div class="kv"[^>]*>)R\$\s*\d+K(<\/div><div class="kl">Valor residual Mini)/,
    `$1R$ ${Math.round(residualMini/1000)}K$2`
  ],
];

// ─── Main ──────────────────────────────────────────────────────────────────────
function run() {
  if (!fs.existsSync(PITCH_FILE)) {
    console.error(`\n❌ Arquivo não encontrado: ${PITCH_FILE}\n`);
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║       LuxDrive EV — Gerador do Pitch Deck               ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('📐 Parâmetros calculados:');
  console.log(`   Dolphin Mini  : R$ ${fmt(miniUnit)}/un`);
  console.log(`   Dolphin GS    : R$ ${fmt(gsUnit)}/un`);
  console.log(`   Cenário A (${params.cenarioA.carros} carros) : R$ ${fmt(totalA)}`);
  console.log(`   Cenário B (${params.cenarioB.carros} carros): R$ ${fmt(totalB)}`);
  console.log(`   Residual Mini : R$ ${fmt(residualMini)} (55%)`);
  console.log(`   CAPEX GS A    : R$ ${fmt(totalAgs)}`);
  console.log(`   CAPEX GS B    : R$ ${fmt(totalBgs)}`);
  console.log('');

  if (DRY_RUN) {
    console.log('🔍 Modo DRY-RUN — nenhum arquivo será alterado\n');
  }

  let content = fs.readFileSync(PITCH_FILE, 'utf8');
  let applied = 0;

  for (const [pattern, replacement] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      applied++;
      console.log(`  ✅ Substituição aplicada: ${pattern.source.slice(0, 60)}…`);
    } else {
      console.log(`  ⚠️  Sem match (já atualizado?): ${pattern.source.slice(0, 60)}…`);
    }
  }

  console.log(`\n📊 ${applied}/${replacements.length} substituições aplicadas`);

  if (!DRY_RUN) {
    fs.writeFileSync(PITCH_FILE, content, 'utf8');
    console.log(`\n💾 Arquivo salvo: ${PITCH_FILE}`);
    console.log('\n✅ Pitch deck atualizado! Execute verify-pitch.js para confirmar.\n');
  } else {
    console.log('\n(dry-run: arquivo NÃO foi salvo)\n');
  }
}

run();
