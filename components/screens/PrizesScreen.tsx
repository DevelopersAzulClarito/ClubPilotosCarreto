import React from 'react';
import { GiftIcon } from '../icons/GiftIcon';

const PrizesScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-500 space-y-4">
            <GiftIcon className="w-16 h-16" />
            <h2 className="text-xl font-bold text-gray-900">Mis Premios</h2>
            <p>Aquí verás todos los premios que has ganado en el Sorteo Relámpago.</p>
        </div>
    );
};

export default PrizesScreen;