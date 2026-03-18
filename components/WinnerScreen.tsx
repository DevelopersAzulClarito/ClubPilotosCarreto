import React, { useEffect, useState } from 'react';

interface WinnerScreenProps {
    // Ahora es opcional pero con un valor por defecto seguro
    level?: number | string;
    onClose?: () => void;
}

const WinnerScreen: React.FC<WinnerScreenProps> = ({ level = "X", onClose }) => {
    const [mounted, setMounted] = useState(false);
    const [confetti, setConfetti] = useState<any[]>([]);

    useEffect(() => { 
        // Generar confeti dinámico
        const colors = ['#fbbf24', '#34d399', '#f87171', '#60a5fa', '#a78bfa', '#ffffff'];
        const newConfetti = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() > 0.5 ? '8px' : '12px',
            shape: Math.random() > 0.5 ? '50%' : '2px', // Círculos o rectángulos
            speed: `${Math.random() * 2 + 1.5}s`,
            delay: `${Math.random() * 0.5}s`,
            rot: `${Math.random() * 360}deg`
        }));
        setConfetti(newConfetti);
        setMounted(true); 
    }, []);

    // Manejador seguro por si onClose no se pasa
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden touch-none"
            onClick={handleClose}
        >
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes badgeFlip {
                    0% { transform: perspective(800px) rotateY(-180deg) scale(0.3); opacity: 0; }
                    50% { transform: perspective(800px) rotateY(15deg) scale(1.1); opacity: 1; }
                    100% { transform: perspective(800px) rotateY(0deg) scale(1); opacity: 1; }
                }
                @keyframes floatUpDown {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes shineEffect {
                    0% { left: -100%; }
                    20% { left: 100%; }
                    100% { left: 100%; }
                }
                @keyframes confettiFall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(var(--rot)); opacity: 0; }
                }
                @keyframes textReveal {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .anim-badge-flip { animation: badgeFlip 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .anim-float { animation: floatUpDown 3s ease-in-out infinite; }
                .anim-shine::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent);
                    transform: skewX(-25deg);
                    animation: shineEffect 3s infinite;
                    pointer-events: none;
                }
                .confetti-piece {
                    position: absolute;
                    top: -20px;
                    animation: confettiFall var(--speed) ease-in forwards;
                    animation-delay: var(--delay);
                    will-change: transform, opacity;
                }
                .anim-text-up { animation: textReveal 0.6s ease-out forwards; opacity: 0; }
            `}} />

            {/* --- Lluvia de Confeti --- */}
            {mounted && confetti.map((c) => (
                <div 
                    key={c.id}
                    className="confetti-piece z-0"
                    style={{
                        left: c.left,
                        width: c.size,
                        height: c.shape === '50%' ? c.size : '16px',
                        backgroundColor: c.color,
                        borderRadius: c.shape,
                        '--speed': c.speed,
                        '--delay': c.delay,
                        '--rot': c.rot
                    } as any}
                />
            ))}

            {/* --- Aura brillante de fondo --- */}
            <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse z-0 pointer-events-none"></div>

            {/* --- Contenedor Principal Animado --- */}
            <div className="relative z-10 flex flex-col items-center pointer-events-none w-full px-6">
                
                <div className="anim-text-up text-center mb-10" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.4)] mb-2">
                        ¡Felicidades!
                    </h2>
                    <p className="text-emerald-100 font-medium tracking-wide text-lg drop-shadow-md">
                        Acabas de subir al <span className="font-black text-white text-2xl ml-1">Nivel {level}</span>
                    </p>
                </div>

                {/* --- Medalla 3D Premium --- */}
                <div className="anim-badge-flip mb-12">
                    <div className="anim-float">
                        <div className="anim-shine relative flex items-center justify-center w-52 h-52 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 rounded-full border-[8px] border-white shadow-[0_0_80px_rgba(16,185,129,0.7)] overflow-hidden">
                            {/* Anillos interiores */}
                            <div className="absolute inset-2 border-[4px] border-emerald-100/40 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                            <div className="absolute inset-4 bg-gradient-to-t from-black/20 to-transparent rounded-full mix-blend-overlay"></div>
                            
                            {/* Contenido de la medalla */}
                            <div className="text-center relative z-10 flex flex-col items-center justify-center mt-2 w-full h-full">
                                <span className="text-emerald-50 font-black text-sm uppercase tracking-[0.3em] leading-none mb-1 drop-shadow-md">Nivel</span>
                                <span className="text-white font-black text-[5.5rem] leading-none drop-shadow-[0_6px_15px_rgba(0,0,0,0.5)]">{level}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Mensaje de recompensa Premium --- */}
                <div className="anim-text-up relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 px-8 py-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full max-w-sm overflow-hidden" style={{ animationDelay: '0.8s' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-yellow-400/20 p-3 rounded-full mb-3 border border-yellow-400/30">
                            <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </div>
                        <p className="text-white font-black text-xl mb-2 tracking-wide text-center">¡Eres un Gran Piloto!</p>
                        <p className="text-emerald-100/90 text-sm text-center leading-relaxed font-medium">
                            Ve a tu <b className="text-white font-bold">Camino de Recompensas</b> para descubrir tus nuevos beneficios y premios exclusivos.
                        </p>
                    </div>
                </div>

            </div>

            {/* --- Texto de Continuar --- */}
            <div className="absolute bottom-8 left-0 right-0 text-center anim-text-up" style={{ animationDelay: '1.5s' }}>
                <p className="text-white/60 text-xs font-bold animate-pulse tracking-widest uppercase bg-black/20 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                    Toca la pantalla para continuar
                </p>
            </div>
        </div>
    );
};

export default WinnerScreen;