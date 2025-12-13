import React, { useMemo } from 'react';
import { PlayerProfile, Promotion, Reward, ActiveTab } from '../types';
import PromotionsCarousel from './PromotionsCarousel';
import LevelRewards from './LevelRewards';
import XPBar from './XPBar';
import { XP_PER_LEVEL } from '../constants';

interface DashboardProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    error: string | null;
}

// Dummy data for promotions and rewards
const promotions: Promotion[] = [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1599493356238-2a7b94875d1f?q=80&w=400&auto=format&fit=crop', title: 'Café gratis en tu próxima carga' },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1617523232112-398b67b1efb2?q=80&w=400&auto=format&fit=crop', title: 'Doble XP los Martes' },
    { id: 3, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop', title: '10% de descuento en la tienda' },
];

const rewards: Reward[] = [
    { level: 2, name: 'Bebida Gratis', description: 'Canjea por un refresco o agua.' },
    { level: 5, name: 'Descuento en Gasolina', description: '$20 de descuento en tu carga.' },
    { level: 10, name: 'Lavado de Auto Express', description: 'Tu auto quedará reluciente.' },
    { level: 15, name: 'Producto Oficial Carreto', description: 'Una gorra o playera exclusiva.' },
    { level: 20, name: 'Leyenda Carreto', description: 'Acceso a eventos exclusivos.' },
]

const motivationalPhrases = [
    "Cada kilómetro cuenta para ser una leyenda.",
    "Tu motor ruge por más XP. ¡A rodar!",
    "La próxima carga podría ser la ganadora.",
    "Sigue sumando puntos, estás a nada del siguiente nivel.",
    "El asfalto te llama, ¡ve por tus puntos!",
    "Más que gasolina, cargas gloria.",
    "Demuestra quién es el rey del camino.",
];


const Dashboard: React.FC<DashboardProps> = ({ player, setActiveTab, error }) => {
    const randomPhrase = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        return motivationalPhrases[randomIndex];
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* XP & Level Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">Mis Puntos (Nivel {player.level})</p>
                <p className="text-4xl font-black text-[#136A40] tracking-tight">{player.xp.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Puntos de experiencia en este nivel</p>
            </div>
            
            {/* Level Progress Bar */}
            <div className="w-full space-y-2">
                <XPBar currentXp={player.xp} maxXp={XP_PER_LEVEL} />
                <p className="text-sm text-gray-500 text-center">
                    Faltan <span className="font-bold text-gray-700">{XP_PER_LEVEL - player.xp}</span> puntos para el Nivel {player.level + 1}
                </p>
            </div>

            {/* Check-in Button */}
            <div className="space-y-2">
                <button
                    onClick={() => setActiveTab('qr')}
                    className="w-full bg-[#e35212] text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
                >
                    Hacer Check-in
                </button>
                 {error && <p className="text-red-600 text-center text-sm">{error}</p>}
            </div>

            {/* Motivational Phrase */}
            <p className="text-center text-sm text-gray-500 italic pt-2">
                "{randomPhrase}"
            </p>

            {/* Promotions */}
            <div className="pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Promociones</h3>
                <PromotionsCarousel promotions={promotions} />
            </div>

            {/* Level Rewards */}
            <div>
                 <h3 className="text-lg font-bold text-gray-900 mb-3">Premios por Nivel</h3>
                 <LevelRewards rewards={rewards} currentLevel={player.level} />
            </div>

        </div>
    );
};

export default Dashboard;