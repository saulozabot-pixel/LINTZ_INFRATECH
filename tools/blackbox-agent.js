/**
 * BLACKBOX AI — Multi-Agent Task Runner
 * Lux Driver Assistant
 *
 * Como usar:
 *   1. Salve sua API key: echo BLACKBOX_API_KEY=sk-... > .env.local
 *   2. node tools/blackbox-agent.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ler .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
let API_KEY = process.env.BLACKBOX_API_KEY;

if (!API_KEY) {
  try {
    const envFile = readFileSync(join(__dirname, '../.env.local'), 'utf8');
    const match = envFile.match(/BLACKBOX_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  } catch {}
}

if (!API_KEY) {
  console.error('❌ API Key não encontrada!');
  console.error('   Crie o arquivo .env.local com: BLACKBOX_API_KEY=sk-...');
  process.exit(1);
}

// ============================================================
// CONFIGURE SUA TAREFA AQUI
// ============================================================
const TASK = {
  prompt: `
    Add Google Play Billing integration to the Lux Driver Assistant Android app.
    
    Context:
    - App: com.lux.motorista (React + Capacitor + Android)
    - Current payment: PIX via PushinPay webhook (api/create-payment.js)
    - Need: In-app subscription via Google Play Billing
    - Plan: Monthly subscription R$9.90/month
    - Product ID to create: lux_monthly_subscription
    
    Tasks:
    1. Add Google Play Billing library to android/app/build.gradle
    2. Create BillingManager.kt in android/app/src/main/java/com/lux/motorista/
    3. Create Capacitor plugin bridge LuxBillingPlugin.java
    4. Update src/plugins/LuxDriver.ts to include billing methods
    5. Update src/components/PaywallScreen.tsx to use Play Billing
    
    Keep existing PIX payment as fallback option.
  `,
  repoUrl: 'https://github.com/saulozabot-pixel/LINTZ_INFRATECH',
  multiLaunch: false,
  selectedAgents: [
    { agent: 'blackbox', model: 'blackboxai/blackbox-pro' }
  ]
};
// ============================================================

async function runTask() {
  console.log('🚀 Enviando tarefa para BLACKBOX AI Multi-Agent...');
  console.log('📋 Tarefa:', TASK.prompt.trim().split('\n')[0]);
  console.log('🤖 Agentes:', TASK.selectedAgents.map(a => a.agent).join(' + '));
  console.log('');

  try {
    const response = await fetch('https://cloud.blackbox.ai/api/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TASK)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro na API:', response.status, data);
      return;
    }

    console.log('✅ Tarefa criada com sucesso!');
    console.log('');
    console.log('📊 Resultado:');
    console.log(JSON.stringify(data, null, 2));

    if (data.taskId) {
      console.log('');
      console.log('🔗 Acompanhe em: https://cloud.blackbox.ai/tasks/' + data.taskId);
    }

    if (data.prUrl) {
      console.log('🔀 Pull Request criado:', data.prUrl);
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

runTask();
