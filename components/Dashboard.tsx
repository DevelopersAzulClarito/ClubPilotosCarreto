import React, { useMemo, useState, useEffect } from 'react';
import { PlayerProfile, Promotion, Reward, ActiveTab } from '../types';
import PromotionsCarousel from './PromotionsCarousel';
import LevelRewards from './LevelRewards';
import XPBar from './XPBar';

import { getRequiredXpForLevel } from '../constants'; // Usamos la función de XP

import { motivationalPhrases } from './FrasesM'; 
import { db } from '../components/firebaseTemp'; 
import { collection, getDocs, query, orderBy, limit, doc, onSnapshot } from 'firebase/firestore';

interface DashboardProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ player, setActiveTab, error }) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(true);

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loadingRewards, setLoadingRewards] = useState(true);

    // --- ESTADOS CONECTADOS DIRECTAMENTE A LA BASE DE DATOS ---
    const [dbXp, setDbXp] = useState<number>(0);
    const [dbPoints, setDbPoints] = useState<number>(0);
    const [dbLevel, setDbLevel] = useState<number>(player?.level || 0);

    const randomPhrase = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
        return motivationalPhrases[randomIndex];
    }, []);

    // 1. Efecto para escuchar en tiempo real el documento del usuario en la BD
    useEffect(() => {
        if (!player?.id && !player?.customerId) return;
        
        const userId = player.id || player.customerId;
        const userRef = doc(db, 'customers', userId);
        
        // onSnapshot "jala" los datos exactos del documento (xp, points, level) al instante
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Extraemos exactamente los campos de tu base de datos
                setDbXp(data.xp || 0);
                setDbPoints(data.points || 0);
                setDbLevel(data.level || 0);
            }
        });

        return () => unsubscribe();
    }, [player]);

    // 2. Efecto para cargar Promociones y Recompensas
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const q = query(collection(db, "promotions"), limit(10));
                const snapshot = await getDocs(q);
                
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                
                const promosData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.titulo || '', 
                        description: data.descripcion || '', 
                        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1617523232112-398b67b1efb2?q=80&w=400&auto=format&fit=crop',
                        isActive: true, 
                        validUntil: data.fechaFin || null
                    } as Promotion; 
                }).filter(promo => {
                    if (!promo.validUntil) return true;
                    return promo.validUntil >= todayStr;
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
                const q = query(collection(db, "levels"), orderBy("level", "asc"), limit(20));
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

    // --- LÓGICA DE PROGRESO DE NIVEL BASADA EN LA BD (XP) ---
    const requiredXp = getRequiredXpForLevel(dbLevel);
    const hasEnoughXp = dbXp >= requiredXp;
    const missingXp = Math.max(0, requiredXp - dbXp);

    return (
        <div className="w-full max-w-md mx-auto pb-24 overflow-x-hidden bg-[#F4F5F7] min-h-screen">
            
            {/* --- SECCIÓN SUPERIOR: PUNTOS Y XP --- */}
            <div className="px-5 sm:px-6 pt-6 space-y-7">
                
                {/* Tarjeta Premium de Nivel, Puntos y XP */}
                <div className="bg-white border border-gray-100 rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden z-0">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-50 rounded-full opacity-80 blur-2xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-orange-50 rounded-full opacity-60 blur-xl -z-10"></div>
                    
                    {/* --- LAYOUT DIVIDIDO: PUNTOS VS XP --- */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">
                                Mis Puntos
                            </p>
                            <p className="text-5xl font-black text-[#136A40] tracking-tighter drop-shadow-sm leading-none">
                                {/* Extraemos estrictamente los puntos de la BD */}
                                {dbPoints.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-extrabold text-[#e35212] uppercase tracking-[0.2em] mb-1">
                                Nivel {dbLevel}
                            </p>
                            <p className="text-2xl font-bold text-gray-800 tracking-tight leading-none">
                                {/* Extraemos estrictamente la XP de la BD */}
                                {dbXp.toLocaleString()} <span className="text-sm font-semibold text-gray-400">XP</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Barra de Progreso basada puramente en XP */}
                    <div className="w-full space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            <span>Progreso de Nivel</span>
                            <span>Meta: {requiredXp.toLocaleString()} XP</span>
                        </div>
                        
                        <XPBar currentXp={dbXp} maxXp={requiredXp} />
                        
                        <p className="text-sm text-gray-500 text-center font-medium mt-2">
                            {hasEnoughXp ? (
                                <span className="text-emerald-600 font-bold">¡Tienes la XP para subir al Nivel {dbLevel + 1}!</span>
                            ) : (
                                <>Faltan <span className="font-bold text-gray-900">{missingXp.toLocaleString()}</span> XP para subir</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Botón de Acción Principal */}
                <div className="pt-2">
                    <button
                        onClick={() => setActiveTab(hasEnoughXp ? 'prizes' : 'qr')}
                        className={`w-full flex items-center justify-center gap-3 text-white font-black py-4 px-6 rounded-[1.5rem] text-lg transition-transform duration-200 active:scale-[0.97] shadow-xl ${
                            hasEnoughXp 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 animate-pulse border border-emerald-400/50' 
                            : 'bg-gradient-to-r from-[#e35212] to-[#ff7438] shadow-orange-500/25 border border-orange-400/50'
                        }`}
                    >
                        {hasEnoughXp ? (
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
                                Mi Pase Digital
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-center text-sm font-medium mt-3">{error}</p>}
                </div>

                {/* Frase Motivacional */}
                <p className="text-center text-sm text-gray-500 font-medium italic px-4">
                    "{randomPhrase}"
                </p>
            </div>

            {/* --- SECCIÓN DE PROMOCIONES --- */}
            <div className="pt-10">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-5 px-5 sm:px-6">Para Ti</h3>
                
                {loadingPromos ? (
                    <div className="h-48 flex items-center justify-center bg-white rounded-2xl mx-5 sm:mx-6 border border-gray-100 shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e35212]"></div>
                    </div>
                ) : promotions.length > 0 ? (
                    <div className="w-full">
                        <PromotionsCarousel promotions={promotions} />
                    </div>
                ) : (
                    <div className="mx-5 sm:mx-6 bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">No hay promociones activas por ahora. ¡Mantente atento!</p>
                    </div>
                )}
            </div>

            {/* --- SECCIÓN DE PREMIOS POR NIVEL --- */}
            <div className="pt-10 px-5 sm:px-6">
                 <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-4">Premios por Nivel</h3>
                 <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] min-h-[150px] relative">
                    {loadingRewards ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#136A40]"></div>
                        </div>
                    ) : rewards.length > 0 ? (
                        <LevelRewards rewards={rewards} currentLevel={dbLevel} />
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