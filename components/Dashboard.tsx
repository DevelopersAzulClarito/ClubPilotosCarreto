import React, { useMemo, useState, useEffect } from 'react';
import { PlayerProfile, Promotion, Reward, ActiveTab } from '../types';
import PromotionsCarousel from './PromotionsCarousel';
import LevelRewards from './LevelRewards';
import XPBar from './XPBar';
import { XP_PER_LEVEL } from '../constants';

// 1. Importamos las frases desde tu nuevo archivo FrasesM
import { motivationalPhrases } from '../components/FrasesM';

// Importaciones de Firebase para traer los datos reales
import { db } from '../components/firebaseTemp'; // Ajusta esta ruta según tu estructura
import { collection, getDocs, query, where } from 'firebase/firestore';

interface DashboardProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    error: string | null;
}

// Mantenemos los premios fijos por ahora (o hasta que también los conectes a la BD)
const rewards: Reward[] = [
    { level: 2, name: 'Bebida Gratis', description: 'Canjea por un refresco o agua.' },
    { level: 5, name: 'Descuento en Gasolina', description: '$20 de descuento en tu carga.' },
    { level: 10, name: 'Lavado de Auto Express', description: 'Tu auto quedará reluciente.' },
    { level: 15, name: 'Producto Oficial Carreto', description: 'Una gorra o playera exclusiva.' },
    { level: 20, name: 'Leyenda Carreto', description: 'Acceso a eventos exclusivos.' },
]

const Dashboard: React.FC<DashboardProps> = ({ player, setActiveTab, error }) => {
    // Nuevo estado para almacenar las promociones reales
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(true);

    const randomPhrase = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        return motivationalPhrases[randomIndex];
    }, []);

    // Efecto para cargar las promociones desde Firebase al abrir la app
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                // Solo traemos las promociones que el Admin tenga marcadas como activas
                const q = query(collection(db, "promotions"), where("activo", "==", true));
                const snapshot = await getDocs(q);
                
                const promosData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.titulo || '', 
                        description: data.descripcion || '', 
                        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1617523232112-398b67b1efb2?q=80&w=400&auto=format&fit=crop',
                        isActive: data.activo || false,
                        validUntil: data.fechaFin || null
                    } as Promotion; 
                });
                
                setPromotions(promosData);
            } catch (error) {
                console.error("Error al cargar promociones en la app:", error);
            } finally {
                setLoadingPromos(false);
            }
        };

        fetchPromotions();
    }, []);

    return (
        // CONTENEDOR MAESTRO: overflow-x-hidden evita que la pantalla se desborde horizontalmente
        <div className="w-full max-w-md mx-auto pb-24 overflow-x-hidden bg-[#FAFAFA] min-h-screen">
            
            {/* Sección Superior: Puntos y Progreso (Con padding estricto) */}
            <div className="px-5 sm:px-6 pt-6 space-y-7">
                
                {/* Tarjeta Premium de Nivel y Puntos (Ajustado el z-index para evitar desbordamiento en scroll) */}
                <div className="bg-white border border-gray-100/80 rounded-[2rem] p-7 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden z-0">
                    {/* Destellos decorativos de fondo para un look moderno (Enviados al fondo con -z-10) */}
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-50 rounded-full opacity-80 blur-2xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-orange-50 rounded-full opacity-60 blur-xl -z-10"></div>
                    
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-2 relative">
                        Mis Puntos (Nivel {player.level})
                    </p>
                    <p className="text-6xl font-black text-[#136A40] tracking-tighter mb-1 relative drop-shadow-sm">
                        {player.xp.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 relative mt-2">
                        Puntos de experiencia en este nivel
                    </p>
                </div>
                
                {/* Barra de Progreso */}
                <div className="w-full space-y-3 px-1">
                    <XPBar currentXp={player.xp} maxXp={XP_PER_LEVEL} />
                    <p className="text-sm text-gray-500 text-center font-medium">
                        Faltan <span className="font-bold text-gray-800">{XP_PER_LEVEL - player.xp}</span> puntos para el Nivel {player.level + 1}
                    </p>
                </div>

                {/* Botón de Check-in Mejorado (Diseño Táctil Móvil) */}
                <div className="pt-2">
                    <button
                        onClick={() => setActiveTab('qr')}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white font-black py-4 px-6 rounded-2xl text-lg transition-transform duration-200 active:scale-[0.97] shadow-xl shadow-orange-500/25 border border-orange-400/50"
                    >
                        <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        Hacer Check-in
                    </button>
                    {error && <p className="text-red-500 text-center text-sm font-medium mt-3">{error}</p>}
                </div>

                {/* Frase Motivacional (Importada) */}
                <p className="text-center text-sm text-gray-400 font-medium italic">
                    "{randomPhrase}"
                </p>
            </div>

            {/* Sección de Promociones (Full-Bleed para el carrusel) */}
            <div className="pt-8">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-5 px-5 sm:px-6">Promociones</h3>
                
                {loadingPromos ? (
                    <div className="h-48 flex items-center justify-center bg-white rounded-2xl mx-5 sm:mx-6 border border-gray-100 shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e35212]"></div>
                    </div>
                ) : promotions.length > 0 ? (
                    // El componente carrusel maneja sus propios márgenes internos
                    <div className="w-full">
                        <PromotionsCarousel promotions={promotions} />
                    </div>
                ) : (
                    <div className="mx-5 sm:mx-6 bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">No hay promociones activas por ahora. ¡Mantente atento a las novedades!</p>
                    </div>
                )}
            </div>

            {/* Sección de Premios por Nivel */}
            <div className="pt-10 px-5 sm:px-6">
                 <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-4">Premios por Nivel</h3>
                 <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <LevelRewards rewards={rewards} currentLevel={player.level} />
                 </div>
            </div>

        </div>
    );
};

export default Dashboard;