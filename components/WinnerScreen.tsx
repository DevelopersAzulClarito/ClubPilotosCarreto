import React from 'react';
import { CheckinResult } from '../types';
import { GiftIcon } from './icons/GiftIcon';
import { StarIcon } from './icons/StarIcon';

interface WinnerScreenProps {
    result: CheckinResult;
    onDone: () => void;
}

const WinnerScreen: React.FC<WinnerScreenProps> = ({ result, onDone }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[420px] bg-gradient-to-b from-orange-50 via-white to-white rounded-[2rem] relative overflow-hidden shadow-2xl border border-orange-100">
            
            {/* Destellos de fondo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl -z-0"></div>

            {/* Estrellas animadas (Confetti) */}
            {[...Array(8)].map((_, i) => (
                <StarIcon key={i} className="absolute text-orange-400 animate-pulse z-0" style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    width: `${Math.random() * 14 + 8}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.6 + 0.3
                }}/>
            ))}

            <div className="animate-bounce z-10 mb-2">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200/50 rounded-full flex items-center justify-center shadow-inner border border-orange-200">
                    <GiftIcon className="w-12 h-12 text-[#e35212]" />
                </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 drop-shadow-sm z-10 tracking-tight mb-4">¡GANASTE!</h2>
            
            {/* Tarjeta de Premio Glassmorphism */}
            <div className="w-full bg-white/80 backdrop-blur-md p-5 rounded-2xl z-10 border border-emerald-100 shadow-[0_4px_20px_rgb(0,0,0,0.06)] mb-6">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">Tu Premio</p>
                <p className="text-xl font-black text-[#136A40] leading-tight mb-3">{result.prize}</p>
                <div className="bg-gray-50/80 py-2.5 rounded-lg border border-gray-100 border-dashed">
                    <p className="text-xs text-gray-500 font-semibold">Muestra esta pantalla al despachador.</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3 z-10 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                <StarIcon className="w-4 h-4 text-orange-500" />
                <p className="text-orange-600 font-extrabold text-sm">+ {result.xpGained} XP</p>
            </div>
            
            <p className="text-gray-500 text-sm font-medium z-10 mb-8 px-2 leading-relaxed">{result.message}</p>

            <button
                onClick={onDone}
                className="w-full bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white font-black py-4 px-6 rounded-2xl text-lg transition-transform duration-200 active:scale-[0.97] shadow-xl shadow-orange-500/25 z-10 focus:outline-none"
            >
                ¡Increíble!
            </button>
        </div>
    );
};

export default WinnerScreen;