import { useState, useEffect, useRef, useCallback } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { Save, Settings, Bell, Gauge } from 'lucide-react';

// ── Constantes do slider duplo ────────────────────────────────────────────────
const SLIDER_MIN  = 0.10;  // R$/min mínimo
const SLIDER_MAX  = 1.50;  // R$/min máximo
const SLIDER_STEP = 0.05;
const toPct = (val: number) =>
    Math.min(100, Math.max(0, ((val - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100));

const SettingsScreen = ({
    onSave,
    onShowOnboarding,
    onShowPaywall,
}: {
    onSave: () => void;
    onShowOnboarding?: () => void;
    onShowPaywall?: () => void;
}) => {
    const { vehicleConfig, setVehicleConfig, preferences, setPreferences, saveSettings } = useVehicle();

    // Local state to avoid saving on every keystroke
    const [localConfig, setLocalConfig] = useState(vehicleConfig);
    const [localPrefs, setLocalPrefs] = useState(preferences);

    // Sincroniza com o contexto quando os valores são carregados do localStorage
    // (VehicleProvider carrega via useEffect, então na primeira renderização pode
    // ainda ter os valores default — este efeito garante que a tela mostra os valores reais)
    useEffect(() => {
        setLocalConfig(vehicleConfig);
    }, [vehicleConfig]);

    useEffect(() => {
        setLocalPrefs(preferences);
    }, [preferences]);

    const handleSave = () => {
        setVehicleConfig(localConfig);
        setPreferences(localPrefs);
        // Passa os valores locais diretamente para evitar o bug de estado React assíncrono:
        // setVehicleConfig/setPreferences são async, então saveSettings() sem parâmetros
        // usaria os valores ANTIGOS do contexto. Passando localConfig/localPrefs garantimos
        // que os valores corretos são salvos no localStorage e sincronizados com o Android.
        saveSettings(localConfig, localPrefs);
        onSave();
    };

    const toggleMetric = (metric: string) => {
        const current = localPrefs.visibleMetrics;
        if (current.includes(metric)) {
            setLocalPrefs({ ...localPrefs, visibleMetrics: current.filter(m => m !== metric) });
        } else {
            setLocalPrefs({ ...localPrefs, visibleMetrics: [...current, metric] });
        }
    };

    // Garante que thresholds existam mesmo em prefs antigas sem esses campos
    const thresholdYellow = localPrefs.thresholdYellow ?? 0.20;
    const thresholdGreen  = localPrefs.thresholdGreen  ?? 0.50;
    const yellowPct = toPct(thresholdYellow);
    const greenPct  = toPct(thresholdGreen);
    const trackGradient = `linear-gradient(to right,
        #F44336 0%, #F44336 ${yellowPct}%,
        #FFC107 ${yellowPct}%, #FFC107 ${greenPct}%,
        #4CAF50 ${greenPct}%, #4CAF50 100%)`;

    // ── Drag handlers para o slider duplo ────────────────────────────────────
    const sliderRef = useRef<HTMLDivElement>(null);

    const getValueFromX = useCallback((clientX: number): number => {
        if (!sliderRef.current) return SLIDER_MIN;
        const rect = sliderRef.current.getBoundingClientRect();
        const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw  = SLIDER_MIN + pct * (SLIDER_MAX - SLIDER_MIN);
        return Math.round(raw / SLIDER_STEP) * SLIDER_STEP;
    }, []);

    const startDrag = useCallback((
        e: React.TouchEvent | React.MouseEvent,
        onMove: (val: number) => void
    ) => {
        e.preventDefault();
        e.stopPropagation();
        const handleMove = (ev: TouchEvent | MouseEvent) => {
            const clientX = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
            onMove(getValueFromX(clientX));
        };
        const handleUp = () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleUp);
            document.removeEventListener('touchend', handleUp);
        };
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('touchend', handleUp);
    }, [getValueFromX]);

    return (
        <div className="p-4 pb-24 space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Settings size={20} />
                    Perfil do Veículo
                </h2>

                <div className="card space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Preço do Combustível (R$/L)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={localConfig.fuelPrice}
                            onChange={e => setLocalConfig({ ...localConfig, fuelPrice: parseFloat(e.target.value) || 0 })}
                            className="input-field"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Consumo Cidade (Km/L)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={localConfig.consumptionPerKm}
                                onChange={e => setLocalConfig({ ...localConfig, consumptionPerKm: parseFloat(e.target.value) || 0 })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Consumo Hora (L/h)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={localConfig.consumptionPerHour}
                                onChange={e => setLocalConfig({ ...localConfig, consumptionPerHour: parseFloat(e.target.value) || 0 })}
                                className="input-field"
                            />
                            <p className="text-xs text-gray-500 mt-1">Carro parado / Ar condicionado</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Custo Manutenção (R$/Km)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={localConfig.maintenanceCostPerKm}
                            onChange={e => setLocalConfig({ ...localConfig, maintenanceCostPerKm: parseFloat(e.target.value) || 0 })}
                            className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">Óleo, pneus, depreciação...</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Bell size={20} />
                    Notificações
                </h2>

                <div className="card space-y-3">
                    <p className="text-sm text-gray-300">Selecione quais métricas deseja ver no resumo rápido:</p>

                    {[
                        { id: 'netProfit', label: 'Lucro Real (R$)' },
                        { id: 'profitPerHour', label: 'Ganho Líquido / Hora (R$/h)' },
                        { id: 'profitPerKm', label: 'Ganho Líquido / KM (R$/km)' },
                        { id: 'farePerHour', label: 'Valor Bruto / Hora (Convencional)' },
                        { id: 'farePerKm', label: 'Valor Bruto / KM (Convencional)' },
                        { id: 'totalCost', label: 'Custo Total' },
                        { id: 'time', label: 'Tempo Gasto' }
                    ].map((metric) => (
                        <label key={metric.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg cursor-pointer">
                            <span>{metric.label}</span>
                            <input
                                type="checkbox"
                                checked={localPrefs.visibleMetrics.includes(metric.id)}
                                onChange={() => toggleMetric(metric.id)}
                                className="w-5 h-5 accent-primary"
                            />
                        </label>
                    ))}

                    <div className="pt-2 border-t border-dark-border">
                        <label className="block text-sm text-gray-400 mb-1">Métrica Principal (Analisa Viabilidade)</label>
                        <select
                            value={localPrefs.primaryMetric}
                            onChange={e => setLocalPrefs({ ...localPrefs, primaryMetric: e.target.value })}
                            className="input-field"
                        >
                            <option value="profitPerHour">Líquido por Hora</option>
                            <option value="profitPerKm">Líquido por KM</option>
                            <option value="farePerHour">Bruto por Hora</option>
                            <option value="farePerKm">Bruto por KM</option>
                            <option value="netProfit">Lucro Líquido</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Essa métrica definirá a cor do alerta (Verde/Amarelo/Vermelho).</p>
                    </div>

                    <div className="pt-4 border-t border-dark-border">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-400">Tempo de Exibição do Alerta</label>
                            <span className="text-primary font-bold">{localPrefs.overlayDuration}s</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="35"
                            step="1"
                            value={localPrefs.overlayDuration}
                            onChange={e => setLocalPrefs({ ...localPrefs, overlayDuration: parseInt(e.target.value) })}
                            className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>5s</span>
                            <span>20s</span>
                            <span>35s</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Semáforo de Corridas ─────────────────────────────────────── */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Gauge size={20} />
                    🚦 Semáforo de Corridas
                </h2>

                <div className="card space-y-4">
                    <p className="text-sm text-gray-300">
                        Defina seus limites de <strong className="text-white">lucro líquido por minuto</strong> para classificar corridas por cor.
                    </p>

                    {/* Fórmula */}
                    <div className="bg-dark-bg rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400">Fórmula usada pelo semáforo</p>
                        <p className="text-sm font-bold text-primary mt-1">Lucro Líquido ÷ Tempo (min) = R$/min</p>
                    </div>

                    {/* Slider duplo */}
                    <div className="space-y-1 pt-2">
                        {/* Labels de valor acima dos thumbs */}
                        <div className="relative h-7">
                            <div
                                className="absolute -translate-x-1/2"
                                style={{ left: `${yellowPct}%` }}
                            >
                                <span className="text-[11px] font-bold text-red-400 bg-dark-bg px-1 rounded whitespace-nowrap">
                                    R$ {thresholdYellow.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            <div
                                className="absolute -translate-x-1/2"
                                style={{ left: `${greenPct}%` }}
                            >
                                <span className="text-[11px] font-bold text-green-400 bg-dark-bg px-1 rounded whitespace-nowrap">
                                    R$ {thresholdGreen.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </div>

                        {/* Track + thumbs */}
                        <div ref={sliderRef} className="relative" style={{ height: '44px' }}>
                            {/* Track colorido */}
                            <div
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    top: '50%', left: 0, right: 0,
                                    height: '10px',
                                    transform: 'translateY(-50%)',
                                    background: trackGradient,
                                }}
                            />

                            {/* Thumb arrastável — 🔴 limite vermelho/amarelo */}
                            <div
                                className="absolute rounded-full border-2 border-white shadow-lg select-none"
                                style={{
                                    top: '50%', left: `${yellowPct}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '26px', height: '26px',
                                    backgroundColor: '#F44336', zIndex: 7,
                                    cursor: 'grab', touchAction: 'none',
                                }}
                                onMouseDown={e => startDrag(e, val => {
                                    if (val < thresholdGreen)
                                        setLocalPrefs(p => ({ ...p, thresholdYellow: val }));
                                })}
                                onTouchStart={e => startDrag(e, val => {
                                    if (val < thresholdGreen)
                                        setLocalPrefs(p => ({ ...p, thresholdYellow: val }));
                                })}
                            />

                            {/* Thumb arrastável — 🟢 limite amarelo/verde */}
                            <div
                                className="absolute rounded-full border-2 border-white shadow-lg select-none"
                                style={{
                                    top: '50%', left: `${greenPct}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '26px', height: '26px',
                                    backgroundColor: '#4CAF50', zIndex: 7,
                                    cursor: 'grab', touchAction: 'none',
                                }}
                                onMouseDown={e => startDrag(e, val => {
                                    if (val > thresholdYellow)
                                        setLocalPrefs(p => ({ ...p, thresholdGreen: val }));
                                })}
                                onTouchStart={e => startDrag(e, val => {
                                    if (val > thresholdYellow)
                                        setLocalPrefs(p => ({ ...p, thresholdGreen: val }));
                                })}
                            />
                        </div>

                        {/* Labels Ruim / Bom */}
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>🔴 Ruim</span>
                            <span>🟢 Bom</span>
                        </div>
                    </div>

                    {/* Legenda */}
                    <div className="space-y-2 pt-3 border-t border-dark-border">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                            <span className="text-xs text-gray-300">
                                <strong className="text-red-400">Vermelho</strong> — abaixo de R$ {thresholdYellow.toFixed(2).replace('.', ',')}/min
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                            <span className="text-xs text-gray-300">
                                <strong className="text-yellow-400">Amarelo</strong> — entre R$ {thresholdYellow.toFixed(2).replace('.', ',')} e R$ {thresholdGreen.toFixed(2).replace('.', ',')}/min
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-300">
                                <strong className="text-green-400">Verde</strong> — acima de R$ {thresholdGreen.toFixed(2).replace('.', ',')}/min
                            </span>
                        </div>
                    </div>

                    {/* Equivalente por hora */}
                    <div className="bg-dark-bg rounded-lg p-3 text-xs text-gray-400 space-y-1">
                        <p className="font-medium text-gray-300">💡 Equivalente por hora:</p>
                        <p>🟡 Amarelo a partir de <strong className="text-yellow-400">R$ {(thresholdYellow * 60).toFixed(0)}/h</strong></p>
                        <p>🟢 Verde a partir de <strong className="text-green-400">R$ {(thresholdGreen * 60).toFixed(0)}/h</strong></p>
                    </div>
                </div>
            </div>

            <button onClick={handleSave} className="btn-primary">
                <Save size={20} />
                Salvar Configurações
            </button>

            {/* ── Seção Sobre / Conta ──────────────────────────────────────── */}
            <div className="space-y-2 pt-2">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Conta & App</h2>
                <div className="card space-y-2">
                    {onShowPaywall && (
                        <button
                            onClick={onShowPaywall}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">👑</span>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-yellow-400">LUX Premium</p>
                                    <p className="text-xs text-gray-500">Ver planos e assinar</p>
                                </div>
                            </div>
                            <span className="text-yellow-500 text-lg">›</span>
                        </button>
                    )}

                    {onShowOnboarding && (
                        <button
                            onClick={onShowOnboarding}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🎯</span>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">Ver Introdução</p>
                                    <p className="text-xs text-gray-500">Rever o tutorial inicial do app</p>
                                </div>
                            </div>
                            <span className="text-gray-500 text-lg">›</span>
                        </button>
                    )}

                    <div className="px-3 py-2 text-center">
                        <p className="text-[10px] text-gray-600">LUX Driver Assistant • v1.0.0</p>
                        <p className="text-[10px] text-gray-700">WhatsApp: (47) 98818-2649</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
