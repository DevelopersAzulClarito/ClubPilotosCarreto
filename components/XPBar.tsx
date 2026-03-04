import React from 'react';

interface XPBarProps {
    currentXp: number;
    maxXp: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXp, maxXp }) => {
    // Evitamos que la barra visualmente pase del 100% y se desborde
    const percentage = maxXp > 0 ? Math.min((currentXp / maxXp) * 100, 100) : 0;
    
    // Verificamos si la barra está llena para aplicar estilos de éxito
    const isFull = percentage >= 100;

    return (
        <div className="w-full bg-gray-200/60 rounded-full h-4 overflow-hidden border border-gray-300/60 shadow-inner relative backdrop-blur-sm">
            <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                    isFull 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                    : 'bg-gradient-to-r from-[#e35212] to-[#ff7438]'
                }`}
                style={{ width: `${percentage}%` }}
            >
                {/* Brillo dinámico (reflejo) en la punta de la barra para darle volumen */}
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/40 to-transparent rounded-full"></div>
                
                {/* Animación de pulso adicional si la barra está completamente llena */}
                {isFull && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                )}
            </div>
        </div>
    );
};

export default XPBar;