#!/usr/bin/env node
/**
 * verify-pitch.js
 * Verifica todos os valores-chave do pitch deck LuxDrive EV
 * Uso: node docs/verify-pitch.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PITCH_FILE = path.join(__dirname, 'pitch-deck-locadora-ev.html');

// ─── Checks ───────────────────────────────────────────────────────────────────
const checks = [
  // Veículos
  { label: 'Modelo BYD Dolphin Mini',        value: 'Dolphin Mini' },
  { label: 'Modelo BYD Dolphin GS',          value: 'Dolphin GS' },

  // CAPEX — Cenário A
  { label: 'CAPEX Cenário A (R$ 625.000)',   value: '625.000' },
  { label: 'Preço unit. Mini (R$ 95.000)',   value: 'R$ 95.000' },
  { label: 'Subtotal 5 Mini (R$ 475.000)',   value: 'R$ 475.000' },

  // CAPEX — Cenário B
  { label: 'CAPEX Cenário B (R$ 1.200.000)', value: '1.200.000' },
  { label: 'Subtotal 10 Mini (R$ 950.000)',  value: 'R$ 950.000' },

  // Cover
  { label: 'Captação cover (625K–1,20M)',    value: 'R$ 625K – R$ 1,20M' },

  // KPIs financeiros
  { label: 'ROI 31,5%',                      value: '31,5%' },
  { label: 'Payback 2,3 anos',               value: '2,3 anos' },
  { label: 'Seguro frota R$ 3.250',          value: '3.250' },
  { label: 'EBITDA R$ 10.500',               value: '10.500' },

  // Mercado
  { label: 'Mercado SC R$ 2,1B',             value: 'R$ 2,1B' },
  { label: 'Crescimento EVs +340%',          value: '+340%' },
  { label: 'Motoristas BC ~4.200',           value: '4.200' },

  // Operacional
  { label: 'Receita/carro R$ 6.000/mês',    value: 'R$ 6.000/mês/carro' },
  { label: 'Aluguel semanal R$ 1.700',       value: 'R$ 1.700/semana' },
  { label: 'EBITDA 10 carros R$ 27.000',     value: 'R$ 27.000 (45%)' },

  // Slides presentes
  { label: 'Slide Executive Summary (S2)',   value: 'Executive Summary' },
  { label: 'Slide CAPEX (S5)',               value: 'Investimento Inicial Detalhado' },
  { label: 'Slide Rent-to-Own (S9)',         value: 'Rent-to-Own' },
  { label: 'Slide ESG (S13)',                value: 'Sustentabilidade que Gera Valor' },
  { label: 'Slide Roadmap (S16)',            value: '5 Anos de Execução' },
  { label: 'Call to Action (S17)',           value: 'Próximo Passo' },
];

// ─── Runner ───────────────────────────────────────────────────────────────────
function run() {
  if (!fs.existsSync(PITCH_FILE)) {
    console.error(`\n❌ Arquivo não encontrado: ${PITCH_FILE}\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(PITCH_FILE, 'utf8');
  const fileSize = (fs.statSync(PITCH_FILE).size / 1024).toFixed(1);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║       LuxDrive EV — Verificação do Pitch Deck           ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📄 Arquivo : ${PITCH_FILE}`);
  console.log(`📦 Tamanho : ${fileSize} KB`);
  console.log(`🔍 Checks  : ${checks.length} verificações\n`);
  console.log('─'.repeat(60));

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const check of checks) {
    const ok = content.includes(check.value);
    if (ok) {
      passed++;
      console.log(`  ✅  ${check.label}`);
    } else {
      failed++;
      failures.push(check);
      console.log(`  ❌  ${check.label}  →  "${check.value}" NÃO encontrado`);
    }
  }

  console.log('─'.repeat(60));
  console.log(`\n📊 Resultado: ${passed}/${checks.length} checks passaram`);

  if (failed === 0) {
    console.log('🎉 TUDO OK — Pitch deck pronto para publicação!\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${failed} check(s) falharam:\n`);
    failures.forEach(f => console.log(`   • ${f.label} → "${f.value}"`));
    console.log('\n💡 Execute: node docs/generate-pitch.js para corrigir automaticamente\n');
    process.exit(1);
  }
}

run();
