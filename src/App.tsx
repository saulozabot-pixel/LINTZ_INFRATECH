import { useState, useEffect, useCallback } from 'react';
import { VehicleProvider } from './context/VehicleContext';
import DashboardScreen from './components/DashboardScreen';
import SettingsScreen from './components/SettingsScreen';
import OnboardingScreen from './components/OnboardingScreen';
import PaywallScreen from './components/PaywallScreen';
import LuxDriver from './plugins/LuxDriver';
import { Settings, ShieldCheck, ShieldAlert, Cpu, LayoutDashboard, RefreshCw, Crown } from 'lucide-react';

// ── Constantes de trial ───────────────────────────────────────────────────────
const TRIAL_DAYS = 7;

function getTrialDaysLeft(): number {
  const isPremium = localStorage.getItem('lux_premium') === 'true';
  if (isPremium) return 999; // premium ativo

  const firstLaunch = localStorage.getItem('lux_first_launch');
  if (!firstLaunch) return TRIAL_DAYS; // ainda não iniciou

  const elapsed = Date.now() - parseInt(firstLaunch, 10);
  const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - daysElapsed);
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [permissions, setPermissions] = useState({ accessibility: false, overlay: false, battery: false });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // ── Onboarding + Paywall ──────────────────────────────────────────────────
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('lux_onboarding_done') !== 'true';
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('lux_premium') === 'true';
  });
  const [trialDaysLeft, setTrialDaysLeft] = useState(() => getTrialDaysLeft());

  // Inicia o trial na primeira abertura
  useEffect(() => {
    if (!localStorage.getItem('lux_first_launch')) {
      localStorage.setItem('lux_first_launch', Date.now().toString());
    }
    setTrialDaysLeft(getTrialDaysLeft());
  }, []);

  // Mostra paywall quando trial expira
  useEffect(() => {
    if (!isPremium && trialDaysLeft === 0 && !showOnboarding) {
      setShowPaywall(true);
    }
  }, [isPremium, trialDaysLeft, showOnboarding]);

  const handleOnboardingFinish = () => {
    localStorage.setItem('lux_onboarding_done', 'true');
    setShowOnboarding(false);
    // Mostra paywall logo após onboarding se trial já expirou
    if (getTrialDaysLeft() === 0) setShowPaywall(true);
  };

  const handlePremiumActivate = () => {
    setIsPremium(true);
    setShowPaywall(false);
    setTrialDaysLeft(999);
  };

  const handlePaywallSkip = () => {
    if (trialDaysLeft > 0) setShowPaywall(false);
  };

  const checkPermissions = useCallback(async () => {
    setIsChecking(true);
    try {
      console.log('Checking permissions...');
      const [acc, ovr, bat] = await Promise.all([
        LuxDriver.checkAccessibilityPermission(),
        LuxDriver.checkOverlayPermission(),
        LuxDriver.checkBatteryOptimization()
      ]);
      console.log('Results - Accessibility:', acc.value, 'Overlay:', ovr.value, 'Battery:', bat.value);
      setPermissions({ accessibility: acc.value, overlay: ovr.value, battery: bat.value });
    } catch (e) {
      console.error('Permission check failed:', e);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkPermissions();
    
    // Then check every 3 seconds
    const interval = setInterval(checkPermissions, 3000);
    return () => clearInterval(interval);
  }, [checkPermissions]);

  const allSet = permissions.accessibility && permissions.overlay && permissions.battery;
  const accessibilityReady = permissions.accessibility;

  const handleAccessibilityClick = async () => {
    console.log('Accessibility click');
    setErrorMessage(null);
    try {
      await LuxDriver.openAccessibilitySettings();
    } catch (e: any) {
      console.error('Error:', e);
      setErrorMessage('Erro: ' + (e.message || 'Tente manualmente'));
    }
  };

  const handleOverlayClick = async () => {
    console.log('Overlay click');
    setErrorMessage(null);
    try {
      await LuxDriver.openOverlaySettings();
    } catch (e: any) {
      console.error('Error:', e);
      setErrorMessage('Erro: ' + (e.message || 'Tente manualmente'));
    }
  };

  const handleBatteryClick = async () => {
    console.log('Battery click');
    setErrorMessage(null);
    try {
      await LuxDriver.openBatteryOptimizationSettings();
    } catch (e: any) {
      console.error('Error:', e);
      setErrorMessage('Erro: ' + (e.message || 'Tente manualmente'));
    }
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  // ── Paywall ───────────────────────────────────────────────────────────────
  if (showPaywall) {
    return (
      <PaywallScreen
        onActivate={handlePremiumActivate}
        trialDaysLeft={trialDaysLeft}
        onSkip={trialDaysLeft > 0 ? handlePaywallSkip : undefined}
      />
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col w-full max-w-md mx-auto bg-dark-bg border-x border-dark-border shadow-2xl relative overflow-hidden">

      {errorMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center">
          <span className="text-sm">{errorMessage}</span>
          <button onClick={dismissError} className="text-white font-bold ml-2">✕</button>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      <header className="px-4 pt-4 pb-3 z-20 flex justify-between items-center bg-dark-bg/80 backdrop-blur-md sticky top-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">LUX</h1>
          <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Driver Assistant</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Badge premium/trial */}
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Crown size={13} className="text-yellow-400" />
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">Premium</span>
            </div>
          ) : trialDaysLeft > 0 ? (
            <button
              onClick={() => setShowPaywall(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 active:scale-95 transition-all"
            >
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">{trialDaysLeft}d grátis</span>
            </button>
          ) : null}

          {/* Status de monitoramento */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg transition-all duration-700 ${accessibilityReady ? 'bg-success/10 border-success text-success' : 'bg-danger/10 border-danger text-danger'}`}>
            {accessibilityReady ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span className="text-[10px] font-black uppercase tracking-wider">
              {allSet ? 'Ativo' : 'Ação Necessária'}
            </span>
          </div>
        </div>
      </header>

      {currentTab === 'dashboard' && (
        <div className="mx-4 mt-2 p-4 bg-dark-card border border-primary/20 rounded-2xl z-20 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 rounded-xl transition-colors ${allSet ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
              <Cpu size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-sm">Configuração de Monitoramento</h2>
              <p className="text-gray-400 text-[11px] mt-0.5">Ative as permissões abaixo para iniciar:</p>
            </div>
            <button
              onClick={checkPermissions}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              disabled={isChecking}
            >
              <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAccessibilityClick}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all active:scale-95 ${permissions.accessibility ? 'bg-success/5 border-success/30 text-success' : 'bg-dark-bg border-dark-border text-gray-300'}`}
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-widest opacity-60">Passo 1</span>
                <span className="text-sm font-medium">Acessibilidade (Ativar Lux)</span>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-lg ${permissions.accessibility ? 'bg-success/20' : 'text-primary'}`}>
                {permissions.accessibility ? 'ATIVO' : 'CONFIGURAR'}
              </span>
            </button>

            <button
              onClick={handleOverlayClick}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all active:scale-95 ${permissions.overlay ? 'bg-success/5 border-success/30 text-success' : 'bg-dark-bg border-dark-border text-gray-300'}`}
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-widest opacity-60">Passo 2</span>
                <span className="text-sm font-medium">Sobrepor a outros apps</span>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-lg ${permissions.overlay ? 'bg-success/20' : 'text-primary'}`}>
                {permissions.overlay ? 'ATIVO' : 'CONFIGURAR'}
              </span>
            </button>

            <button
              onClick={handleBatteryClick}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all active:scale-95 ${permissions.battery ? 'bg-success/5 border-success/30 text-success' : 'bg-dark-bg border-dark-border text-gray-300'}`}
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-widest opacity-60">Passo 3</span>
                <span className="text-sm font-medium">Desativar Otimização de Bateria</span>
                {!permissions.battery && (
                  <span className="text-[10px] text-gray-500 mt-0.5">Evita que o app seja encerrado em segundo plano</span>
                )}
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-lg ${permissions.battery ? 'bg-success/20' : 'text-primary'}`}>
                {permissions.battery ? 'ATIVO' : 'CONFIGURAR'}
              </span>
            </button>
          </div>

          {permissions.accessibility && permissions.overlay && !permissions.battery && (
            <p className="text-[9px] text-warning mt-3 text-center leading-relaxed">
              ⚠️ Quase lá! Desative a otimização de bateria para o serviço não ser encerrado.
            </p>
          )}
          {permissions.accessibility && !permissions.overlay && (
            <p className="text-[9px] text-warning mt-3 text-center leading-relaxed">
              ⚠️ Quase lá! Ative a sobreposição para o card flutuante aparecer.
            </p>
          )}
        </div>
      )}

      <main className="flex-1 overflow-y-auto z-10 px-4 pb-20">
        {currentTab === 'dashboard' ? (
          <DashboardScreen />
        ) : (
          <SettingsScreen
            onSave={() => setCurrentTab('dashboard')}
            onShowOnboarding={() => {
              localStorage.removeItem('lux_onboarding_done');
              setShowOnboarding(true);
            }}
            onShowPaywall={() => setShowPaywall(true)}
          />
        )}
      </main>

      <nav className="h-16 bg-dark-card/90 backdrop-blur-xl border-t border-dark-border flex items-center justify-around z-30 shrink-0 px-10 pb-1">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentTab === 'dashboard' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold mt-1">Início</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentTab === 'settings' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold mt-1">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}

function App() {
  return (
    <VehicleProvider>
      <AppContent />
    </VehicleProvider>
  );
}

export default App;
