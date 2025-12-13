
import React from 'react';
import { GasPumpIcon } from './icons/GasPumpIcon';

const CheckinScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 space-y-6 min-h-[400px]">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 bg-orange-500 rounded-full animate-ping opacity-50"></div>
                <GasPumpIcon className="w-20 h-20 text-[#e35212] animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 animate-pulse">Verificando tu Check-in...</h2>
            <p className="text-gray-500 text-center">¡Cruzando los dedos por un premio!</p>
        </div>
    );
};

export default CheckinScreen;