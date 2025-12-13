
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
        <div className="p-6 flex flex-col items-center text-center space-y-6 flex-grow">
            <header className="w-full flex items-center justify-between">
                <div className="w-8"></div> {/* Spacer */}
                <h2 className="text-lg font-bold text-gray-900">Check-in</h2>
                <button onClick={() => setActiveTab('home')} className="text-gray-500 hover:text-gray-900">
                    <CloseIcon className="w-7 h-7" />
                </button>
            </header>

            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">¡Hola, {player.name.split(' ')[0]}!</h1>
                    <p className="text-gray-600 mt-1">Muestra este QR en la estación para hacer check-in</p>
                </div>
                
                <div className="bg-white p-2 rounded-lg shadow-md">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CARRETO-PILOT-${player.customerId}`} alt="QR Code" />
                </div>

                <div className="flex justify-around w-full max-w-xs pt-2">
                    <div>
                        <p className="text-sm text-gray-500">Nivel</p>
                        <p className="text-xl font-bold text-[#136A40]">{player.level}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Puntos</p>
                        <p className="text-xl font-bold text-[#136A40]">{player.xp}</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-xs bg-[#e35212] text-white rounded-2xl p-5 shadow-lg shadow-orange-500/30 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <WifiIcon className="w-6 h-6 transform -rotate-90" />
                    <CarretoLogoIcon className="w-20 h-auto" />
                </div>
                <div className="flex justify-between items-end pt-4">
                    <div>
                        <p className="text-xs opacity-80">Número de tarjeta</p>
                        <p className="text-lg font-semibold tracking-wider">{player.customerId}</p>
                    </div>
                     <div>
                        <p className="text-xs opacity-80 text-right">Teléfono</p>
                        <p className="font-semibold">{player.phone}</p>
                    </div>
                </div>
            </div>

             <div className="w-full max-w-xs pt-4">
                <button
                    onClick={onCheckin}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-300 transition-all duration-300"
                >
                    Simular Check-in
                </button>
            </div>
        </div>
    );
};

export default QRScreen;