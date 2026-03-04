import React, { useMemo, useState, useEffect } from 'react';
import { PlayerProfile, Promotion, Reward, ActiveTab } from '../types';
import PromotionsCarousel from './PromotionsCarousel';
import LevelRewards from './LevelRewards';
import XPBar from './XPBar';
import { XP_PER_LEVEL } from '../constants';

// Importamos las frases motivacionales
import { motivationalPhrases } from './FrasesM'; // Ajustado según tu última ruta

// Importaciones de Firebase para traer los datos reales
import { db } from '../components/firebaseTemp'; // Ajusta esta ruta según tu estructura
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

interface DashboardProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ player, setActiveTab, error }) => {
    // Estado para las promociones
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(true);

    // Estado para los premios por nivel
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loadingRewards, setLoadingRewards] = useState(true);

    const randomPhrase = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        return motivationalPhrases[randomIndex];
    }, []);

    // Efecto para cargar los datos desde Firebase al abrir la app
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

        const fetchRewards = async () => {
            try {
                // Traemos los niveles ordenados de menor a mayor
                const q = query(collection(db, "levels"), orderBy("level", "asc"));
                const snapshot = await getDocs(q);
                
                const rewardsData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        level: data.level || 0,
                        name: data.name || '',
                        description: data.description || ''
                    } as Reward;
                });
                
                setRewards(rewardsData);
            } catch (error) {
                console.error("Error al cargar premios por nivel:", error);
            } finally {
                setLoadingRewards(false);
            }
        };

        fetchPromotions();
        fetchRewards();
    }, []);

    // --- LÓGICA DE DIFICULTAD PROGRESIVA ---
    // Multiplicamos la base por el nivel actual para que cada nivel cueste más
    const requiredXp = XP_PER_LEVEL * player.level;
    const hasEnoughXP = player.xp >= requiredXp;
    const missingXp = Math.max(0, requiredXp - player.xp);

    return (
        // CONTENEDOR MAESTRO: overflow-x-hidden evita que la pantalla se desborde horizontalmente
        <div className="w-full max-w-md mx-auto pb-24 overflow-x-hidden bg-[#FAFAFA] min-h-screen">
            
            {/* Sección Superior: Puntos y Progreso */}
            <div className="px-5 sm:px-6 pt-6 space-y-7">
                
                {/* Tarjeta Premium de Nivel y Puntos */}
                <div className="bg-white border border-gray-100/80 rounded-[2rem] p-7 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden z-0">
                    {/* Destellos decorativos de fondo */}
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-50 rounded-full opacity-80 blur-2xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-orange-50 rounded-full opacity-60 blur-xl -z-10"></div>
                    
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-2 relative">
                        Mis Puntos (Nivel {player.level})
                    </p>
                    <p className="text-6xl font-black text-[#136A40] tracking-tighter mb-1 relative drop-shadow-sm">
                        {player.xp.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 relative mt-2">
                        Puntos de experiencia acumulados
                    </p>
                </div>
                
                {/* Barra de Progreso con Límite Dinámico */}
                <div className="w-full space-y-3 px-1">
                    {/* Le pasamos la meta calculada: requiredXp */}
                    <XPBar currentXp={player.xp} maxXp={requiredXp} />
                    
                    <p className="text-sm text-gray-500 text-center font-medium">
                        {hasEnoughXP ? (
                            <span className="text-emerald-600 font-bold">¡Tienes puntos para subir al Nivel {player.level + 1}!</span>
                        ) : (
                            <>Faltan <span className="font-bold text-gray-800">{missingXp.toLocaleString()}</span> puntos para el Nivel {player.level + 1}</>
                        )}
                    </p>
                </div>

                {/* Botón de Acción Principal */}
                <div className="pt-2">
                    <button
                        onClick={() => setActiveTab(hasEnoughXP ? 'levels' : 'qr')} // Si tiene puntos lo manda a niveles, si no, a su QR
                        className={`w-full flex items-center justify-center gap-3 text-white font-black py-4 px-6 rounded-2xl text-lg transition-transform duration-200 active:scale-[0.97] shadow-xl ${
                            hasEnoughXP 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 animate-pulse' 
                            : 'bg-gradient-to-r from-[#e35212] to-[#ff7438] shadow-orange-500/25 border border-orange-400/50'
                        }`}
                    >
                        {hasEnoughXP ? (
                            <>
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25C3.504 21 3 20.496 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 9.75 19.875V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                                ¡Subir de Nivel Ahora!
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                Mi pase digital
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-center text-sm font-medium mt-3">{error}</p>}
                </div>

                {/* Frase Motivacional */}
                <p className="text-center text-sm text-gray-400 font-medium italic">
                    "{randomPhrase}"
                </p>
            </div>

            {/* Sección de Promociones */}
            <div className="pt-8">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-5 px-5 sm:px-6">Promociones</h3>
                
                {loadingPromos ? (
                    <div className="h-48 flex items-center justify-center bg-white rounded-2xl mx-5 sm:mx-6 border border-gray-100 shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e35212]"></div>
                    </div>
                ) : promotions.length > 0 ? (
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
                 <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[150px] relative">
                    {loadingRewards ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#136A40]"></div>
                        </div>
                    ) : rewards.length > 0 ? (
                        <LevelRewards rewards={rewards} currentLevel={player.level} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-sm font-medium">Aún no hay premios configurados.</p>
                        </div>
                    )}
                 </div>
            </div>

        </div>
    );
};

export default Dashboard;