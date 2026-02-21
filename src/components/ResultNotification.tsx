import { useEffect } from 'react';
import { X, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import type { RideResult } from '../utils/calculator';
import { useVehicle } from '../context/VehicleContext';

interface ResultNotificationProps {
    result: RideResult | null;
    timeInput: number;
    onClose: () => void;
}

const ResultNotification = ({ result, timeInput, onClose }: ResultNotificationProps) => {
    const { preferences } = useVehicle();

    // Auto-close logic
    useEffect(() => {
        if (result && preferences.overlayDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, preferences.overlayDuration * 1000);
            return () => clearTimeout(timer);
        }
    }, [result, preferences.overlayDuration, onClose]);

    if (!result) return null;

    // Color Logic based on Primary Metric
    let color = 'text-white';
    let borderColor = 'border-gray-500';
    let glow = '';
    let bgColor = 'bg-dark-card';

    const primaryValue =
        preferences.primaryMetric === 'profitPerHour' ? result.profitPerHour :
            preferences.primaryMetric === 'profitPerKm' ? result.profitPerKm :
                preferences.primaryMetric === 'farePerHour' ? result.farePerHour :
                    preferences.primaryMetric === 'farePerKm' ? result.farePerKm :
                        result.netProfit;

    const isPerHour = preferences.primaryMetric === 'profitPerHour' || preferences.primaryMetric === 'farePerHour';
    const isPerKm = preferences.primaryMetric === 'profitPerKm' || preferences.primaryMetric === 'farePerKm';

    if (isPerHour) {
        const threshold = preferences.primaryMetric === 'farePerHour' ? 40 : 25;
        if (primaryValue < threshold) { color = 'text-danger'; borderColor = 'border-danger'; }
        else if (primaryValue < threshold + 15) { color = 'text-warning'; borderColor = 'border-warning'; }
        else { color = 'text-primary'; borderColor = 'border-primary'; glow = 'shadow-[0_0_25px_rgba(255,215,0,0.4)]'; }
    } else if (isPerKm) {
        const threshold = preferences.primaryMetric === 'farePerKm' ? 1.6 : 1.1;
        if (primaryValue < threshold) { color = 'text-danger'; borderColor = 'border-danger'; }
        else if (primaryValue < threshold + 0.5) { color = 'text-warning'; borderColor = 'border-warning'; }
        else { color = 'text-primary'; borderColor = 'border-primary'; glow = 'shadow-[0_0_25px_rgba(255,215,0,0.4)]'; }
    } else {
        if (primaryValue < 5) { color = 'text-danger'; borderColor = 'border-danger'; }
        else { color = 'text-primary'; borderColor = 'border-primary'; glow = 'shadow-[0_0_25px_rgba(255,215,0,0.4)]'; }
    }

    // Helper to render specific metrics
    const renderMetric = (key: string) => {
        switch (key) {
            case 'netProfit':
                return (
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400 text-sm">Lucro Líquido</span>
                        <span className={`text-2xl font-black ${color} drop-shadow-md`}>{formatCurrency(result.netProfit)}</span>
                    </div>
                );
            case 'profitPerHour':
                return (
                    <div className="flex justify-between items-center py-1.5 border-b border-dark-border/50">
                        <span className="text-gray-400 text-sm">Líquido/Hora</span>
                        <span className="text-lg font-bold text-white">{formatCurrency(result.profitPerHour)}<span className="text-xs text-gray-500 ml-1">/h</span></span>
                    </div>
                );
            case 'profitPerKm':
                return (
                    <div className="flex justify-between items-center py-1.5 border-b border-dark-border/50">
                        <span className="text-gray-400 text-sm">Líquido/Km</span>
                        <span className="text-lg font-bold text-white">{formatCurrency(result.profitPerKm)}<span className="text-xs text-gray-500 ml-1">/km</span></span>
                    </div>
                );
            case 'farePerHour':
                return (
                    <div className="flex justify-between items-center py-1.5 border-b border-dark-border/50">
                        <span className="text-gray-400 text-sm">Bruto/Hora</span>
                        <span className="text-lg font-bold text-gray-200">{formatCurrency(result.farePerHour)}<span className="text-xs text-gray-500 ml-1">/h</span></span>
                    </div>
                );
            case 'farePerKm':
                return (
                    <div className="flex justify-between items-center py-1.5 border-b border-dark-border/50">
                        <span className="text-gray-400 text-sm">Bruto/Km</span>
                        <span className="text-lg font-bold text-gray-200">{formatCurrency(result.farePerKm)}<span className="text-xs text-gray-500 ml-1">/km</span></span>
                    </div>
                );
            case 'totalCost':
                return (
                    <div className="flex justify-between items-center py-1.5 text-xs">
                        <span className="text-gray-500 italic">Custo Operacional Total</span>
                        <span className="text-danger font-medium">{formatCurrency(result.totalCost)}</span>
                    </div>
                );
            case 'time':
                return (
                    <div className="flex justify-between items-center py-1.5 text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> Duração</span>
                        <span className="text-gray-400">{timeInput} min</span>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed top-6 left-4 right-4 z-50 animate-slide-down max-w-sm mx-auto">
            <div
                className={`${bgColor} rounded-3xl p-6 border-2 ${borderColor} ${glow} flex flex-col gap-4 relative backdrop-blur-md bg-opacity-95 overflow-hidden shadow-2xl`}
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 bg-dark-bg/80 rounded-full text-gray-400 hover:text-white transition-colors border border-dark-border"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-xl bg-dark-bg border ${borderColor} flex items-center justify-center`}>
                        {color.includes('danger') ? <AlertTriangle className={color} size={24} /> : <TrendingUp className={color} size={24} />}
                    </div>
                    <div>
                        <h3 className={`font-black text-xs uppercase tracking-widest text-gray-500`}>
                            {preferences.primaryMetric.includes('fare') ? 'Análise Bruta' : 'Análise de Lucro'}
                        </h3>
                        <p className={`font-bold text-lg leading-tight ${color}`}>
                            {preferences.primaryMetric === 'profitPerHour' ? 'Viabilidade (Líq/h)' :
                                preferences.primaryMetric === 'farePerHour' ? 'Viabilidade (Bruto/h)' :
                                    preferences.primaryMetric === 'profitPerKm' ? 'Viabilidade (Líq/Km)' :
                                        preferences.primaryMetric === 'farePerKm' ? 'Viabilidade (Bruto/Km)' :
                                            'Resultado Final'}
                        </p>
                    </div>
                </div>

                <div className="space-y-0.5">
                    {preferences.visibleMetrics.map(m => (
                        <div key={m}>{renderMetric(m)}</div>
                    ))}
                </div>

                {/* Duration Progress Indicator (Optional but cool) */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary/30" style={{
                    width: '100%',
                    animation: `shrinkWidth ${preferences.overlayDuration}s linear forwards`
                }}></div>
            </div>

            <style>{`
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default ResultNotification;
