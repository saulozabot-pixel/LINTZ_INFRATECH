import LuxLogo from './LuxLogo';

const DashboardScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 h-full">
            <div className="flex flex-col items-center space-y-4">
                <LuxLogo size={180} />
                <p className="text-gray-400 text-sm italic tracking-[0.3em] mt-8 text-center px-10 leading-relaxed">
                    DRIVEN BY LIGHT
                </p>
            </div>

            <div className="text-center space-y-2 opacity-50">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Monitoramento Inteligente</p>
                <div className="flex gap-1 justify-center">
                    <div className="w-1 h-1 rounded-full bg-primary animate-ping"></div>
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
