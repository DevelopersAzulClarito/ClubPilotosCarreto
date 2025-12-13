
import React from 'react';
import { CheckinResult } from '../types';
import { StarIcon } from './icons/StarIcon';

interface StandardScreenProps {
    result: CheckinResult;
    onDone: () => void;
}

const StandardScreen: React.FC<StandardScreenProps> = ({ result, onDone }) => {
    return (
        <div className="flex flex-col items-center p-6 text-center space-y-6 min-h-[400px]">
            <div className="p-4 bg-gray-100 rounded-full">
                <StarIcon className="w-16 h-16 text-[#136A40]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">¡Gracias por tu visita!</h2>
            
            <p className="text-green-600 text-xl font-semibold">+ {result.xpGained} XP</p>
            
            <p className="text-gray-700">{result.message}</p>

            <p className="text-sm text-gray-500">
                ¡Estás más cerca del siguiente nivel y de más oportunidades de ganar!
            </p>

            <button
                onClick={onDone}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-300 transition-all duration-300"
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default StandardScreen;