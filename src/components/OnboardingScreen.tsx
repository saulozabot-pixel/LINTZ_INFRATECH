import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    emoji: '🚗',
    title: 'Bem-vindo ao LUX',
    subtitle: 'Driver Assistant',
    description: 'O assistente inteligente para motoristas de app que querem saber exatamente quanto estão ganhando.',
    color: '#FFD700',
  },
  {
    emoji: '💰',
    title: 'Calcule seu lucro real',
    subtitle: 'Não o bruto — o líquido',
    description: 'Descontamos combustível, manutenção e depreciação automaticamente. Veja o que sobra de verdade no seu bolso.',
    color: '#4CAF50',
  },
  {
    emoji: '🚦',
    title: 'Semáforo de corridas',
    subtitle: 'Aceite só o que vale',
    description: 'Verde = boa corrida. Amarelo = neutra. Vermelho = prejuízo. O card aparece em cima do Uber e 99 em tempo real.',
    color: '#F44336',
  },
  {
    emoji: '⚡',
    title: 'Configure em 3 passos',
    subtitle: 'Rápido e simples',
    description: 'Ative as permissões necessárias e o LUX começa a monitorar automaticamente todas as suas corridas.',
    color: '#2196F3',
  },
];

const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const next = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-dark-bg relative overflow-hidden select-none">

      {/* Background glow */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${slide.color}18 0%, transparent 70%)` }}
      />

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onFinish}
          className="absolute top-5 right-5 z-10 text-gray-500 text-sm font-medium px-3 py-1 rounded-full border border-dark-border"
        >
          Pular
        </button>
      )}

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon */}
        <div
          className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-2xl transition-all duration-500"
          style={{
            backgroundColor: slide.color + '18',
            border: `2px solid ${slide.color}40`,
            boxShadow: `0 0 40px ${slide.color}20`,
          }}
        >
          {slide.emoji}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white mb-1 transition-all duration-300">
          {slide.title}
        </h1>
        <p
          className="text-xs font-black uppercase tracking-[0.2em] mb-6 transition-all duration-300"
          style={{ color: slide.color }}
        >
          {slide.subtitle}
        </p>

        {/* Description */}
        <p className="text-gray-400 text-base leading-relaxed max-w-xs">
          {slide.description}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12 space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                backgroundColor: i === current ? slide.color : '#333',
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={prev}
              className="flex-1 py-4 rounded-2xl font-bold text-base border border-dark-border text-gray-400 active:scale-95 transition-all"
            >
              Voltar
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-black"
            style={{ backgroundColor: slide.color }}
          >
            {isLast ? 'Começar agora' : 'Próximo'}
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
