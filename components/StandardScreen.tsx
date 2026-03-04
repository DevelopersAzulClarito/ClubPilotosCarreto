import React from 'react';
import { CheckinResult } from '../types';
import { StarIcon } from './icons/StarIcon';

interface StandardScreenProps {
    result: CheckinResult;
    onDone: () => void;
}

const StandardScreen: React.FC<StandardScreenProps> = ({ result, onDone }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-white rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
            
            {/* Destello suave verde (Para dar sensación de éxito al sumar puntos) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-100 rounded-full opacity-40 blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-50 rounded-full opacity-60 blur-xl -z-10"></div>

            {/* Contenedor del ícono principal */}
            <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-full shadow-inner relative border border-emerald-50 group">
                <StarIcon className="w-14 h-14 text-[#136A40] transition-transform duration-500 group-hover:rotate-12" />
                
                {/* Estrellitas secundarias animadas para dar vida */}
                <StarIcon className="w-6 h-6 text-emerald-400 absolute -top-1 -right-2 animate-pulse" />
                <StarIcon className="w-4 h-4 text-emerald-300 absolute bottom-1 -left-2 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">
                ¡Gracias por tu visita!
            </h2>
            
            {/* Badge de Puntos Ganados */}
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-200/60 mb-5 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-emerald-700 font-black text-xl tracking-tight">
                    + {result.xpGained} XP
                </span>
            </div>
            
            {/* Mensaje Principal */}
            <p className="text-gray-600 font-medium mb-3 text-base px-2">
                {result.message}
            </p>

            {/* Mensaje Secundario Motivacional */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 border-dashed mb-8 w-full">
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Sigue acumulando puntos para estar más cerca de tu próximo nivel y desbloquear recompensas exclusivas.
                </p>
            </div>

            {/* Botón de Acción Táctil */}
            <button
                onClick={onDone}
                className="w-full bg-gray-900 text-white font-black py-4 px-6 rounded-2xl text-lg hover:bg-black transition-all duration-200 active:scale-[0.97] shadow-xl shadow-gray-900/10 focus:outline-none"
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default StandardScreen;