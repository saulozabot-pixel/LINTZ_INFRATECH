const LuxLogo = ({ size = 120 }: { size?: number }) => {
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full animate-pulse"></div>

            {/* The Golden Star/Sun SVG */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#FFFACD" />
                        <stop offset="100%" stopColor="#DAA520" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer Rays (The Star Points) */}
                <g className="origin-center animate-[spin_20s_linear_infinite]">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <path
                            key={angle}
                            d="M 50 10 L 53 40 L 47 40 Z"
                            fill="url(#gold-grad)"
                            transform={`rotate(${angle} 50 50)`}
                            filter="url(#glow)"
                        />
                    ))}
                </g>

                {/* Inner Sun/Halo */}
                <circle
                    cx="50" cy="50" r="18"
                    fill="url(#gold-grad)"
                    className="drop-shadow-lg"
                    filter="url(#glow)"
                />
                <circle
                    cx="50" cy="50" r="15"
                    stroke="#000" strokeWidth="0.5" fill="none" opacity="0.2"
                />

                {/* Lux Text inside? Or maybe below? Let's keep it abstract as requested */}
            </svg>

            <div className="absolute bottom-0 text-primary font-bold tracking-[0.2em] text-xl mt-4 select-none">
                LUX
            </div>
        </div>
    );
};

export default LuxLogo;
