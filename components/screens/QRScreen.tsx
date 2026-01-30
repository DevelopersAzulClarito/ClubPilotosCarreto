import React from 'react';
import { PlayerProfile, ActiveTab } from '../../types';
import { CloseIcon } from '../icons/CloseIcon';
import { WifiIcon } from '../icons/WifiIcon';
import { CarretoLogoIcon } from '../icons/CarretoLogoIcon';

interface QRScreenProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    onCheckin: () => void;
}

const QRScreen: React.FC<QRScreenProps> = ({ player, setActiveTab, onCheckin }) => {
    
    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* --- HEADER --- */}
            <header className="px-6 py-4 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="w-8"></div> {/* Spacer para centrar */}
                <h2 className="text-lg font-bold text-gray-900">Pase Digital</h2>
                <button 
                    onClick={() => setActiveTab('home')} 
                    className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-grow flex flex-col items-center pt-6 px-6 space-y-6 overflow-y-auto">
                
                {/* --- SALUDO --- */}
                <div className="text-center">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        ¡Hola, {player.name.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Muestra este código en la bomba
                    </p>
                </div>
                
                {/* --- CONTENEDOR QR --- */}
                <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 relative transform transition-transform hover:scale-105 duration-300">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-20">
                        ESCANEAR AQUÍ
                    </div>
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CARRETO-${player.phone}`} 
                        alt="QR Code" 
                        className="w-48 h-48 mix-blend-multiply opacity-90"
                    />
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Nivel</span>
                        <span className="text-xl font-black text-[#136A40]">{player.level}</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Puntos</span>
                        <span className="text-xl font-black text-[#e35212]">{player.xp}</span>
                    </div>
                </div>

                {/* --- TARJETA DIGITAL ESTILIZADA --- */}
                <div className="w-full max-w-xs relative rounded-2xl overflow-hidden shadow-lg transform transition hover:translate-y-1 duration-300">
                    {/* Fondo con Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e35212] via-[#ff6b2b] to-[#c13e00]"></div>
                    {/* Decoración de fondo */}
                    <div className="absolute top-[-50%] right-[-20%] w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 rounded-full bg-black/10 blur-xl"></div>

                    <div className="relative z-10 p-5 flex flex-col space-y-4 text-white">
                        <div className="flex justify-between items-start">
                            <WifiIcon className="w-6 h-6 transform rotate-90 opacity-80" />
                            {/* Logo en blanco usando filtro */}
                            <div className="brightness-0 invert opacity-90">
                                <CarretoLogoIcon className="w-16 h-auto" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[10px] uppercase opacity-75 tracking-widest mb-1">Número de Cliente</p>
                            {/* Fuente Mono para efecto tarjeta, pero el número va directo (pegado) */}
                            <p className="font-mono text-xl font-bold tracking-widest drop-shadow-sm">
                                {player.phone}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTÓN DE ACCIÓN --- */}
            <div className="p-6 bg-white border-t border-gray-100 mt-auto">
                <button
                    onClick={onCheckin}
                    className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-black transition-all duration-300 shadow-lg active:scale-[0.98]"
                >
                    Simular Check-in
                </button>
            </div>
        </div>
    );
};

export default QRScreen;