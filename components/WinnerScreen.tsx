
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
        <div className="flex flex-col items-center p-6 text-center space-y-4 min-h-[400px] bg-gradient-to-br from-orange-500/10 to-white rounded-2xl relative overflow-hidden">
            {/* Confetti-like stars */}
            {[...Array(10)].map((_, i) => (
                <StarIcon key={i} className="absolute text-orange-400 animate-pulse" style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 15 + 5}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.5 + 0.3
                }}/>
            ))}

            <div className="animate-bounce-slow z-10">
                <GiftIcon className="w-24 h-24 text-orange-400" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 drop-shadow-lg z-10">¡GANASTE!</h2>
            
            <div className="bg-white/70 p-4 rounded-lg z-10 border border-green-400">
                <p className="text-lg font-bold text-[#136A40]">{result.prize}</p>
                <p className="text-sm text-gray-600">Muestra este mensaje al despachador.</p>
            </div>

            <p className="text-green-600 font-semibold z-10">+ {result.xpGained} XP</p>
            
            <p className="text-gray-600 text-sm z-10">{result.message}</p>

            <button
                onClick={onDone}
                className="w-full bg-[#e35212] text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 z-10 mt-4"
            >
                Entendido
            </button>
        </div>
    );
};

export default WinnerScreen;