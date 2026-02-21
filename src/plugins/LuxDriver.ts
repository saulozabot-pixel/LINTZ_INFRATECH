import { registerPlugin } from '@capacitor/core';

export interface VehicleConfigPayload {
    fuelPrice: number;
    consumptionPerKm: number;
    consumptionPerHour: number;
    maintenanceCostPerKm: number;
    primaryMetric: string;
    overlayDuration: number; // em segundos
    visibleMetrics: string[]; // métricas selecionadas pelo usuário
    thresholdYellow: number;  // R$/min — limite vermelho→amarelo
    thresholdGreen: number;   // R$/min — limite amarelo→verde
}

export interface LuxDriverPlugin {
    checkAccessibilityPermission(): Promise<{ value: boolean }>;
    openAccessibilitySettings(): Promise<void>;
    checkOverlayPermission(): Promise<{ value: boolean }>;
    openOverlaySettings(): Promise<void>;
    checkBatteryOptimization(): Promise<{ value: boolean }>;
    openBatteryOptimizationSettings(): Promise<void>;
    saveVehicleConfig(config: VehicleConfigPayload): Promise<void>;
}

const LuxDriver = registerPlugin<LuxDriverPlugin>('LuxDriver', {
    web: () => ({
        checkAccessibilityPermission: async () => ({ value: false }),
        openAccessibilitySettings: async () => {},
        checkOverlayPermission: async () => ({ value: false }),
        openOverlaySettings: async () => {},
        checkBatteryOptimization: async () => ({ value: false }),
        openBatteryOptimizationSettings: async () => {},
        saveVehicleConfig: async () => {},
    }),
});

export default LuxDriver;
