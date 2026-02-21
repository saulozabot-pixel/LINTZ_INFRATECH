import { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { calculateRide } from '../utils/calculator';
import type { RideResult } from '../utils/calculator';
import ResultNotification from './ResultNotification';

import OCRUploader from './OCRUploader';

import LuxLogo from './LuxLogo';

const CalculatorScreen = () => {
    const { vehicleConfig } = useVehicle();

    const [fare, setFare] = useState('');
    const [distance, setDistance] = useState('');
    const [time, setTime] = useState('');

    const [result, setResult] = useState<RideResult | null>(null);

    const handleCalculate = () => {
        if (!fare || !distance || !time) return;

        const res = calculateRide({
            fare: parseFloat(fare),
            distance: parseFloat(distance),
            time: parseFloat(time)
        }, vehicleConfig);

        setResult(res);
    };

    const handleOCRData = (data: { fare: number; distance: number; time: number }) => {
        if (data.fare) setFare(data.fare.toFixed(2));
        if (data.distance) setDistance(data.distance.toFixed(1));
        if (data.time) setTime(data.time.toFixed(0));
    };

    return (
        <div className="p-4 space-y-6 relative h-full">
            <ResultNotification
                result={result}
                timeInput={parseFloat(time) || 0}
                onClose={() => setResult(null)}
            />

            <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <LuxLogo size={100} />
                <p className="text-gray-400 text-sm italic tracking-widest mt-6">DRIVEN BY LIGHT</p>
            </div>

            <div className="card space-y-5">

                <OCRUploader onDataFound={handleOCRData} />

                <div className="relative">
                    <label className="block text-lg font-medium mb-2 w-full text-center">Valor da Corrida (R$)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        className="input-field text-3xl font-bold text-center py-4"
                        autoFocus
                        value={fare}
                        onChange={e => setFare(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Distância (Km)</label>
                        <input
                            type="number"
                            placeholder="0.0"
                            className="input-field text-xl text-center"
                            value={distance}
                            onChange={e => setDistance(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Tempo (min)</label>
                        <input
                            type="number"
                            placeholder="0"
                            className="input-field text-xl text-center"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="btn-primary mt-4"
                >
                    Calcular Viabilidade
                </button>
            </div>

            <div className="text-center text-xs text-gray-600 mt-8">
                <p>Baseado nos custos do seu veículo configurado.</p>
            </div>
        </div>
    );
};

export default CalculatorScreen;
