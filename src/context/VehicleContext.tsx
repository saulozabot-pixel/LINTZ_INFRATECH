import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { VehicleConfig } from '../utils/calculator';
import LuxDriver from '../plugins/LuxDriver';

interface NotificationPreferences {
    visibleMetrics: string[]; // e.g. ['profitPerHour', 'netProfit']
    primaryMetric: string; // e.g. 'profitPerHour'
    overlayDuration: number; // in seconds
    thresholdYellow: number; // R$/min — limite vermelho→amarelo
    thresholdGreen: number;  // R$/min — limite amarelo→verde
}

interface VehicleContextType {
    vehicleConfig: VehicleConfig;
    setVehicleConfig: (config: VehicleConfig) => void;
    preferences: NotificationPreferences;
    setPreferences: (prefs: NotificationPreferences) => void;
    saveSettings: (config?: VehicleConfig, prefs?: NotificationPreferences) => void;
}

const defaultVehicleConfig: VehicleConfig = {
    fuelPrice: 5.89,
    consumptionPerKm: 10.0,
    consumptionPerHour: 1.5,
    maintenanceCostPerKm: 0.20,
};

const defaultPreferences: NotificationPreferences = {
    visibleMetrics: ['profitPerHour', 'netProfit', 'totalCost'],
    primaryMetric: 'profitPerHour',
    overlayDuration: 10,
    thresholdYellow: 0.20, // R$ 0,20/min = ~R$ 12/h
    thresholdGreen: 0.50,  // R$ 0,50/min = ~R$ 30/h
};

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
    const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig>(defaultVehicleConfig);
    const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

    // Load from LocalStorage on mount e sincroniza com Android
    useEffect(() => {
        const savedConfig = localStorage.getItem('vehicleConfig');
        const savedPrefs = localStorage.getItem('notificationPreferences');

        const config = savedConfig ? JSON.parse(savedConfig) : defaultVehicleConfig;
        const prefs = savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;

        if (savedConfig) setVehicleConfig(config);
        if (savedPrefs) setPreferences(prefs);

        // Sincroniza com Android na inicialização
        syncToAndroid(config, prefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sincroniza configurações com o Android (SharedPreferences do RideService)
    const syncToAndroid = (config: VehicleConfig, prefs: NotificationPreferences) => {
        LuxDriver.saveVehicleConfig({
            fuelPrice: config.fuelPrice,
            consumptionPerKm: config.consumptionPerKm,
            consumptionPerHour: config.consumptionPerHour,
            maintenanceCostPerKm: config.maintenanceCostPerKm,
            primaryMetric: prefs.primaryMetric,
            overlayDuration: prefs.overlayDuration,
            visibleMetrics: prefs.visibleMetrics,
            thresholdYellow: prefs.thresholdYellow ?? 0.20,
            thresholdGreen: prefs.thresholdGreen ?? 0.50,
        }).catch(e => console.warn('Sync Android failed:', e));
    };

    // Aceita parâmetros opcionais para evitar usar estado React desatualizado
    // (setState é assíncrono — se chamar saveSettings() logo após setVehicleConfig(),
    //  o estado ainda tem os valores antigos. Passar os novos valores diretamente resolve isso.)
    const saveSettings = (config?: VehicleConfig, prefs?: NotificationPreferences) => {
        const configToSave = config ?? vehicleConfig;
        const prefsToSave  = prefs  ?? preferences;
        localStorage.setItem('vehicleConfig', JSON.stringify(configToSave));
        localStorage.setItem('notificationPreferences', JSON.stringify(prefsToSave));
        // Sincroniza com o serviço Android usando os valores corretos
        syncToAndroid(configToSave, prefsToSave);
    };

    return (
        <VehicleContext.Provider value={{
            vehicleConfig,
            setVehicleConfig,
            preferences,
            setPreferences,
            saveSettings
        }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error('useVehicle must be used within a VehicleProvider');
    }
    return context;
};
