import { useState } from 'react';
import { Check, MessageCircle, Key, ChevronDown, ChevronUp, Crown } from 'lucide-react';

// ── Configuração ──────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '47988182649';
const API_BASE = (import.meta.env.VITE_APP_URL as string) || 'https://lux-driver-assistent-18y8.vercel.app';

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
  const [codeLoading, setCodeLoading] = useState(false);

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

  const handleCodeSubmit = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    setCodeLoading(true);
    setCodeError('');

    try {
      const res = await fetch(`${API_BASE}/api/validate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      });
      const data = await res.json();

      if (data.valid) {
        setCodeSuccess(true);
        setTimeout(() => {
          localStorage.setItem('lux_premium', 'true');
          localStorage.setItem('lux_premium_code', normalized);
          localStorage.setItem('lux_premium_plan', data.plan || 'code');
          if (data.expires_at) {
            localStorage.setItem('lux_premium_expires', data.expires_at);
          }
          onActivate();
        }, 1200);
      } else {
        const msgs: Record<string, string> = {
          not_found: 'Código inválido. Verifique e tente novamente.',
          expired:   'Este código expirou. Entre em contato para renovar.',
          cancelled: 'Este código foi cancelado. Entre em contato para suporte.',
          server_error: 'Erro ao validar. Tente novamente em instantes.',
        };
        setCodeError(msgs[data.error] || 'Código inválido. Verifique e tente novamente.');
      }
    } catch {
      setCodeError('Sem conexão. Verifique sua internet e tente novamente.');
    } finally {
      setCodeLoading(false);
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
                    disabled={codeLoading}
                    className="px-4 py-3 bg-primary/20 text-primary rounded-xl font-bold text-sm active:scale-95 transition-all border border-primary/30 disabled:opacity-50"
                  >
                    {codeLoading ? '...' : 'OK'}
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
