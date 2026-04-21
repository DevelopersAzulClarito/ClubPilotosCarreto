import React, { useState, useEffect } from 'react';
import { PlayerProfile, type Level } from '../../types';
import { db } from '../firebaseTemp';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getRequiredXpForLevel } from '../../constants'; // Usamos la nueva función de XP
import XPBar from '../XPBar';
import WinnerScreen from '../WinnerScreen'; // Importamos la animación de celebración

// --- Iconos Inline para asegurar compatibilidad ---
const CheckIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const LockIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);
const ArrowUpIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
    </svg>
);
const GiftIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

interface LevelsScreenProps {
    player: PlayerProfile;
    // Función callback opcional para recargar el jugador desde la BD en el componente padre
    onPlayerUpdate?: () => void; 
}

const LevelsScreen: React.FC<LevelsScreenProps> = ({ player, onPlayerUpdate }) => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLevelingUp, setIsLevelingUp] = useState(false);
    
    // --- ESTADOS CONECTADOS DIRECTAMENTE A LA BASE DE DATOS ---
    const [dbXp, setDbXp] = useState<number>(0);
    const [dbPoints, setDbPoints] = useState<number>(0);
    const [dbLevel, setDbLevel] = useState<number>(player?.level || 0);

    // NUEVO: Estado para los premios cobrados
    const [claimedPrizes, setClaimedPrizes] = useState<string[]>([]);

    // Estados para controlar cuándo mostrar la animación y con qué nivel
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);

    // 1. Efecto para obtener la lista de recompensas (AHORA INCLUYE EL ID)
    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const q = query(collection(db, "levels"), orderBy("level", "asc"), limit(50));
                const snapshot = await getDocs(q);
                const levelsData = snapshot.docs.map(doc => ({
                    id: doc.id, // Guardamos el ID para poder filtrarlo
                    level: doc.data().level || 0,
                    name: doc.data().name || '',
                    description: doc.data().description || ''
                }));
                setLevels(levelsData);
            } catch (error) {
                console.error("Error cargando niveles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLevels();
    }, []);

    // 2. Efecto para ESCUCHAR EN TIEMPO REAL el documento del usuario en la BD
    useEffect(() => {
        if (!player?.id && !player?.customerId) return;
        
        const userId = player.id || player.customerId;
        const userRef = doc(db, 'customers', userId);
        
        // onSnapshot "jala" los datos exactos del documento al instante
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDbXp(data.xp || 0);
                setDbPoints(data.points || 0);
                setDbLevel(data.level || 0);
                setClaimedPrizes(data.claimedPrizes || []);
            }
        });

        return () => unsubscribe();
    }, [player]);

    // --- PROTECCIÓN CONTRA ERRORES ---
    if (!player) {
        return (
            <div className="flex flex-col h-full bg-[#FAFAFA] items-center justify-center pb-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
                <p className="text-gray-500 font-bold tracking-wide">Cargando perfil...</p>
            </div>
        );
    }

    // --- LÓGICA DE NIVELES INFINITOS BASADO DIRECTAMENTE EN LA BD ---
    const requiredXp = getRequiredXpForLevel(dbLevel);
    const canLevelUp = dbXp >= requiredXp;
    
    // Cálculo de porcentaje para la barra visual
    const percentage = requiredXp > 0 ? Math.min(100, Math.round((dbXp / requiredXp) * 100)) : 100;

    const handleLevelUp = async () => {
        if (!canLevelUp) return;
        
        setIsLevelingUp(true);
        try {
            const userRef = doc(db, 'customers', player.id || player.customerId); 
            const newLevel = dbLevel + 1;
            
            await updateDoc(userRef, {
                level: newLevel
            });

            // Guardamos el nivel alcanzado y mostramos la animación
            setCelebrationLevel(newLevel);
            setShowCelebration(true);
            
            // Ocultar la animación automáticamente después de 5 segundos
            setTimeout(() => {
                setShowCelebration(false);
            }, 5000);

            // Actualizar datos locales
            if (onPlayerUpdate) onPlayerUpdate();
            
        } catch (error) {
            console.error("Error al subir de nivel:", error);
            alert("Hubo un error al intentar subir de nivel. Intenta de nuevo.");
        } finally {
            setIsLevelingUp(false);
        }
    };

    // NUEVO: Filtramos los niveles para que DESAPAREZCAN los que ya fueron cobrados
    const visibleLevels = levels.filter(lvl => !claimedPrizes.includes(lvl.id));

    // NUEVO: Detectar si hay algún premio desbloqueado pero no cobrado
    const hasUnclaimedPrizes = visibleLevels.some(lvl => dbLevel >= lvl.level);

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] pb-24 overflow-y-auto relative">
            
            {/* Componente de celebración superpuesto */}
            {showCelebration && celebrationLevel !== null && (
                <WinnerScreen 
                    level={celebrationLevel} 
                    onClose={() => setShowCelebration(false)} 
                />
            )}

            {/* --- HEADER --- */}
            <header className="px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
                <h2 className="text-xl font-black text-gray-900 tracking-tight text-center">Niveles y Beneficios</h2>
            </header>

            <div className="px-5 pt-6 space-y-8">
                
                {/* --- TARJETA HERO: PUNTOS, NIVEL Y XP --- */}
                <div className="bg-gradient-to-br from-[#136A40] to-emerald-700 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        
                        {/* --- NUEVO LAYOUT: PUNTOS Y XP DIVIDIDOS Y ESTRICTOS --- */}
                        <div className="flex justify-between items-end mb-6 w-full px-2">
                            <div className="text-left">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-1 block">
                                    Mis Puntos
                                </span>
                                <span className="text-4xl font-black drop-shadow-md leading-none">
                                    {dbPoints.toLocaleString()}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-1 block">
                                    Nivel {dbLevel}
                                </span>
                                <span className="text-4xl font-black drop-shadow-md leading-none">
                                    {dbXp.toLocaleString()} <span className="text-xl font-bold text-emerald-200">XP</span>
                                </span>
                            </div>
                        </div>

                        <div className="w-full bg-black/20 p-5 rounded-2xl border border-white/10 mb-5 shadow-inner">
                            <div className="flex justify-between items-end mb-3 text-sm font-bold">
                                <span>Progreso al Nivel {dbLevel + 1}</span>
                                <span className="text-emerald-300">{percentage}%</span>
                            </div>
                            <div className="opacity-100 mb-3">
                                <XPBar currentXp={dbXp} maxXp={requiredXp} />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-emerald-200/80 uppercase tracking-widest">
                                <span>{dbXp.toLocaleString()} XP</span>
                                <span>Meta: {requiredXp.toLocaleString()} XP</span>
                            </div>
                        </div>

                        {/* --- BOTÓN DE SUBIR DE NIVEL --- */}
                        <button
                            onClick={handleLevelUp}
                            disabled={!canLevelUp || isLevelingUp}
                            className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                                canLevelUp 
                                ? 'bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white shadow-lg shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]' 
                                : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5'
                            }`}
                        >
                            {isLevelingUp ? (
                                <span className="animate-pulse">Procesando...</span>
                            ) : canLevelUp ? (
                                <>
                                    <ArrowUpIcon className="w-6 h-6 animate-bounce" />
                                    ¡Subir a Nivel {dbLevel + 1}!
                                </>
                            ) : (
                                `Faltan ${(requiredXp - dbXp).toLocaleString()} XP`
                            )}
                        </button>
                    </div>
                </div>

                {/* --- LISTA DE BENEFICIOS Y NIVELES --- */}
                <div>
                    <div className="flex items-center gap-2 mb-6 px-1">
                        <GiftIcon className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Camino de Recompensas</h3>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : levels.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                            <GiftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No hay niveles configurados aún.</p>
                        </div>
                    ) : visibleLevels.length === 0 ? (
                        // NUEVO: Estado de "Todo Cobrado"
                        <div className="bg-white rounded-2xl p-8 text-center border border-emerald-100 shadow-sm">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">¡Todo Cobrado!</h3>
                            <p className="text-gray-500 text-sm font-medium">Has canjeado todos tus premios disponibles. ¡Sigue subiendo de nivel para desbloquear más recompensas!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* --- BANNER DE PREMIOS POR COBRAR --- */}
                            {hasUnclaimedPrizes && (
                                <div className="bg-gradient-to-br from-amber-100 to-orange-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-center shadow-sm relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 text-amber-500/10 pointer-events-none">
                                        <GiftIcon className="w-32 h-32" />
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-3 rounded-xl shrink-0 shadow-md z-10">
                                        <GiftIcon className="w-6 h-6" />
                                    </div>
                                    <div className="z-10 pr-2">
                                        <h4 className="text-amber-900 font-black text-sm tracking-tight mb-0.5">¡Tienes premios listos!</h4>
                                        <p className="text-amber-800/90 text-xs font-medium leading-snug">
                                            Visita tu estación Carreto Gas más cercana y escanea tu pase para reclamarlos en caja.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-5 relative">
                                {/* Línea conectora visual */}
                                <div className="absolute left-[2.5rem] top-8 bottom-8 w-0.5 bg-gray-200 rounded-full -z-0"></div>

                                {visibleLevels.map((lvl) => {
                                    const isUnlocked = dbLevel >= lvl.level;
                                    const isNext = dbLevel + 1 === lvl.level;

                                    return (
                                        <div 
                                            key={lvl.id} 
                                            className={`relative z-10 flex p-5 rounded-[1.5rem] transition-all duration-300 overflow-hidden ${
                                                isUnlocked 
                                                    ? 'bg-white border border-emerald-100 shadow-[0_4px_20px_rgb(16,185,129,0.08)] hover:shadow-[0_8px_25px_rgb(16,185,129,0.12)] hover:-translate-y-1' 
                                                    : isNext
                                                        ? 'bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-md shadow-orange-100 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5'
                                                        : 'bg-gray-50 border border-gray-100 opacity-80 grayscale-[0.3]'
                                            }`}
                                        >
                                            {/* Decoración de fondo para el siguiente nivel */}
                                            {isNext && (
                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50"></div>
                                            )}
                                            {isUnlocked && (
                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-60"></div>
                                            )}

                                            {/* Icono de Estado / Avatar del Nivel */}
                                            <div className="relative mr-5 flex-shrink-0">
                                                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-sm border-2 z-10 relative ${
                                                    isUnlocked 
                                                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-200 text-white' 
                                                        : isNext
                                                            ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-200 text-white'
                                                            : 'bg-gray-100 border-gray-200 text-gray-400'
                                                }`}>
                                                    {isUnlocked ? (
                                                        <CheckIcon className="w-8 h-8" />
                                                    ) : isNext ? (
                                                        <span className="font-black text-2xl drop-shadow-sm">{lvl.level}</span>
                                                    ) : (
                                                        <LockIcon className="w-7 h-7" />
                                                    )}
                                                </div>
                                                
                                                {/* Etiqueta flotante del número de nivel */}
                                                {isUnlocked && (
                                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm z-20">
                                                        LVL {lvl.level}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Info del Nivel */}
                                            <div className="flex-grow flex flex-col justify-center py-1">
                                                <div className="flex justify-between items-start mb-1.5 gap-2">
                                                    <p className={`font-black text-[1.1rem] leading-tight tracking-tight ${
                                                        isUnlocked ? 'text-gray-900' : isNext ? 'text-[#e35212]' : 'text-gray-600'
                                                    }`}>
                                                        {lvl.name}
                                                    </p>
                                                    
                                                    {/* Badge para el próximo nivel */}
                                                    {isNext && (
                                                        <span className="shrink-0 whitespace-nowrap bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-orange-200">
                                                            Próximo
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className={`text-[0.85rem] leading-snug font-medium ${
                                                    isUnlocked ? 'text-emerald-700/90' : isNext ? 'text-gray-600' : 'text-gray-500'
                                                }`}>
                                                    {isUnlocked ? '🎁 Listo para cobrar en estación. ' + lvl.description : lvl.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LevelsScreen;