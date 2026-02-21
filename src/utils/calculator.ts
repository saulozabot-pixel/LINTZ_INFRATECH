export interface RideInputs {
    fare: number;
    distance: number; // km
    time: number; // minutes
}

export interface VehicleConfig {
    fuelPrice: number;
    consumptionPerKm: number; // km/l
    consumptionPerHour: number; // liters/h
    maintenanceCostPerKm: number; // R$/km
}

export interface RideResult {
    fuelCostDistance: number;
    fuelCostTime: number;
    maintenanceCost: number;
    totalCost: number;
    netProfit: number;
    profitPerHour: number;
    profitPerKm: number;
    farePerHour: number;
    farePerKm: number;
}

export const calculateRide = (
    inputs: RideInputs,
    config: VehicleConfig
): RideResult => {
    const { fare, distance, time } = inputs;
    const { fuelPrice, consumptionPerKm, consumptionPerHour, maintenanceCostPerKm } = config;

    // 1. Custo Combustível Deslocamento
    // Se consumptionPerKm for 0 ou infinito, evitar divisão por zero
    const fuelCostDistance = consumptionPerKm > 0
        ? (distance / consumptionPerKm) * fuelPrice
        : 0;

    // 2. Custo Combustível Tempo (Marcha Lenta / Ar Condicionado)
    // Time em minutos -> horas
    const timeHours = time / 60;
    const fuelCostTime = (timeHours * consumptionPerHour) * fuelPrice;

    // 3. Custo Manutenção
    const maintenanceCost = distance * maintenanceCostPerKm;

    // 4. Totais
    const totalCost = fuelCostDistance + fuelCostTime + maintenanceCost;
    const netProfit = fare - totalCost;

    // Métricas Derivadas
    const profitPerHour = timeHours > 0 ? netProfit / timeHours : 0;
    const profitPerKm = distance > 0 ? netProfit / distance : 0;

    // Métricas Convencionais (Bruto)
    const farePerHour = timeHours > 0 ? fare / timeHours : 0;
    const farePerKm = distance > 0 ? fare / distance : 0;

    return {
        fuelCostDistance,
        fuelCostTime,
        maintenanceCost,
        totalCost,
        netProfit,
        profitPerHour,
        profitPerKm,
        farePerHour,
        farePerKm
    };
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
