import React from 'react';
import { CheckinResult } from '../types';
import { StarIcon } from './icons/StarIcon';

interface StandardScreenProps {
    result: CheckinResult;
    onDone: () => void;
}

const StandardScreen: React.FC<StandardScreenProps> = ({ result, onDone }) => {
    return (
        <div className="flex flex-col items-center p-6 text-center space-y-6 min-h-[400px] max-w-full overflow-hidden bg-white">
            
            <div className="p-4 bg-gray-100 rounded-full flex-shrink-0">
                <StarIcon className="w-16 h-16 text-[#136A40]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 w-full break-words">
                ¡Gracias por tu visita!
            </h2>
            
            {/* Cambiado de XP a Puntos */}
            <p className="text-green-600 text-xl font-semibold w-full break-words">
                + {result.xpGained} Puntos
            </p>
            
            <p className="text-gray-700 w-full px-2 break-words">
                {result.message}
            </p>

            <p className="text-sm text-gray-500 w-full px-4 break-words leading-relaxed">
                ¡Estás más cerca del siguiente nivel y de más oportunidades de ganar!
            </p>

            <div className="w-full pt-4">
                <button
                    onClick={onDone}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default StandardScreen;