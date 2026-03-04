import React from 'react';
import { GasPumpIcon } from './icons/GasPumpIcon';

const CheckinScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] bg-white rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
            
            {/* Destellos de fondo animados */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full opacity-50 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full opacity-50 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative flex items-center justify-center mb-8">
                {/* Anillos de expansión para dar efecto de "Buscando/Conectando" */}
                <div className="absolute w-32 h-32 bg-orange-100 rounded-full animate-ping opacity-60"></div>
                <div className="absolute w-24 h-24 bg-orange-200 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.3s' }}></div>
                
                {/* Contenedor central con gradiente */}
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#e35212] to-[#ff7438] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <GasPumpIcon className="w-10 h-10 text-white animate-bounce" />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight animate-pulse mb-2 z-10 text-center">
                Verificando tu Check-in...
            </h2>
            <p className="text-gray-500 font-medium text-center z-10">
                ¡Cruzando los dedos por un premio!
            </p>
        </div>
    );
};

export default CheckinScreen;