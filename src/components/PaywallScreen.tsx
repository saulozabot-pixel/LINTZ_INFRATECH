import { useState } from 'react';
import { Check, MessageCircle, Key, ChevronDown, ChevronUp, Crown } from 'lucide-react';

// ── Configuração ──────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '47988182649';

// ── Sistema de códigos únicos ─────────────────────────────────────────────────
// IMPORTANTE: mantenha SECRET em segredo — é a chave que gera todos os códigos
const SECRET = 'LUX_SAULO_2025_DRIVER';
const MAX_CODES = 500; // total de códigos válidos (índices 1–500)

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // 32-bit
  }
  return Math.abs(hash);
}

// Gera o código para um índice específico (mesmo algoritmo do gerador externo)
export function generateCode(index: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0/O/1/I (confusos)
  let n1 = djb2Hash(SECRET + index + 'A');
  let n2 = djb2Hash(SECRET + index + 'B');
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars[n1 % chars.length]; n1 = Math.floor(n1 / chars.length);
    part2 += chars[n2 % chars.length]; n2 = Math.floor(n2 / chars.length);
  }
  return `LUX-${part1}-${part2}`;
}

// Valida se o código é legítimo e ainda não foi usado neste dispositivo
function validateCode(code: string): { valid: boolean; index: number } {
  const normalized = code.trim().toUpperCase();
  for (let i = 1; i <= MAX_CODES; i++) {
    if (generateCode(i) === normalized) {
      const used: string[] = JSON.parse(localStorage.getItem('lux_used_codes') || '[]');
      if (used.includes(normalized)) return { valid: false, index: i }; // já usado
      return { valid: true, index: i };
    }
  }
  return { valid: false, index: -1 };
}

function markCodeUsed(code: string) {
  const used: string[] = JSON.parse(localStorage.getItem('lux_used_codes') || '[]');
  used.push(code.trim().toUpperCase());
  localStorage.setItem('lux_used_codes', JSON.stringify(used));
}

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensal',
    price: 'R$ 9,90',
    period: '/mês',
    perMonth: 'R$ 9,90/mês',
    badge: null,
    highlight: false,
  },
  {
    id: 'quarterly',
    label: 'Trimestral',
    price: 'R$ 24,90',
    period: '/3 meses',
    perMonth: 'R$ 8,30/mês',
    badge: 'Economize 16%',
    highlight: false,
  },
  {
    id: 'annual',
    label: 'Anual',
    price: 'R$ 79,90',
    period: '/ano',
    perMonth: 'R$ 6,66/mês',
    badge: 'Melhor valor 🔥',
    highlight: true,
  },
] as const;

type PlanId = typeof PLANS[number]['id'];

const FEATURES = [
  'Card flutuante em tempo real',
  'Cálculo de lucro líquido real',
  'Semáforo de corridas personalizável',
  'Suporte a Uber e 99',
  'Sem anúncios',
  'Atualizações gratuitas',
];

// ── Componente ────────────────────────────────────────────────────────────────
const PaywallScreen = ({
  onActivate,
  trialDaysLeft,
  onSkip,
}: {
  onActivate: () => void;
  trialDaysLeft: number;
  onSkip?: () => void;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  const isTrial = trialDaysLeft > 0;
  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handleWhatsApp = () => {
    const planLabel = PLANS.find(p => p.id === selectedPlan)!;
    const message = encodeURIComponent(
      `Olá! Quero assinar o *Lux Driver Premium*.\n\n` +
      `Plano: ${planLabel.label} (${planLabel.price}${planLabel.period})\n\n` +
      `Pode me enviar as instruções de pagamento via PIX?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleCodeSubmit = () => {
    const result = validateCode(code);
    if (result.valid) {
      const normalized = code.trim().toUpperCase();
      setCodeSuccess(true);
      setCodeError('');
      setTimeout(() => {
        markCodeUsed(normalized);
        localStorage.setItem('lux_premium', 'true');
        localStorage.setItem('lux_premium_code', normalized);
        localStorage.setItem('lux_premium_plan', 'code');
        onActivate();
      }, 1200);
    } else if (result.index > 0) {
      setCodeError('Este código já foi utilizado neste dispositivo.');
    } else {
      setCodeError('Código inválido. Verifique e tente novamente.');
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-dark-bg overflow-y-auto">

      {/* Header */}
      <div className="relative px-6 pt-10 pb-4 text-center">
        {isTrial && onSkip && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-500 text-xs px-3 py-1 rounded-full border border-dark-border"
          >
            {trialDaysLeft}d restantes
          </button>
        )}

        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Crown size={32} className="text-yellow-400" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white">LUX Premium</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isTrial
            ? `Seu trial gratuito termina em ${trialDaysLeft} dia${trialDaysLeft !== 1 ? 's' : ''}`
            : 'Assine para continuar usando o LUX'}
        </p>
      </div>

      {/* Features */}
      <div className="px-6 mb-4">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-2">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-green-400" />
              </div>
              <span className="text-gray-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 mb-4 space-y-2">
        {PLANS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlan(p.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${
              selectedPlan === p.id
                ? p.highlight
                  ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/10'
                  : 'bg-primary/10 border-primary'
                : 'bg-dark-card border-dark-border'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Radio */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPlan === p.id
                    ? p.highlight ? 'border-yellow-500' : 'border-primary'
                    : 'border-gray-600'
                }`}
              >
                {selectedPlan === p.id && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.highlight ? '#EAB308' : '#FFD700' }}
                  />
                )}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{p.label}</span>
                  {p.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        p.highlight ? 'bg-yellow-500 text-black' : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">{p.perMonth}</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`font-black text-lg ${selectedPlan === p.id ? (p.highlight ? 'text-yellow-400' : 'text-primary') : 'text-white'}`}>
                {p.price}
              </span>
              <span className="text-gray-500 text-xs block">{p.period}</span>
            </div>
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <div className="px-6 mb-3">
        <button
          onClick={handleWhatsApp}
          className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-green-600 text-white active:scale-95 transition-all shadow-lg shadow-green-900/30"
        >
          <MessageCircle size={20} />
          Assinar via WhatsApp — {plan.price}{plan.period}
        </button>
        <p className="text-center text-gray-600 text-[10px] mt-2">
          Pagamento via PIX • Ativação em minutos
        </p>
      </div>

      {/* Activation code */}
      <div className="px-6 pb-8">
        <button
          onClick={() => setShowCodeInput(v => !v)}
          className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm py-2"
        >
          <Key size={14} />
          Tenho um código de ativação
          {showCodeInput ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showCodeInput && (
          <div className="mt-3 space-y-2">
            {codeSuccess ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-bold text-sm">✅ Código válido! Ativando premium...</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                    placeholder="Ex: LUX2025"
                    className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-mono uppercase tracking-widest outline-none focus:border-primary"
                    onKeyDown={e => e.key === 'Enter' && handleCodeSubmit()}
                  />
                  <button
                    onClick={handleCodeSubmit}
                    className="px-4 py-3 bg-primary/20 text-primary rounded-xl font-bold text-sm active:scale-95 transition-all border border-primary/30"
                  >
                    OK
                  </button>
                </div>
                {codeError && (
                  <p className="text-red-400 text-xs text-center">{codeError}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaywallScreen;
