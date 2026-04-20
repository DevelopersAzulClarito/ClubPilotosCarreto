import React, { useState } from 'react';
import { IllustrationHowItWorks } from './illustrations/IllustrationHowItWorks';
import { IllustrationLevels } from './illustrations/IllustrationLevels';
import { IllustrationRewards } from './illustrations/IllustrationRewards';
import { CheckIcon } from './icons/CheckIcon';

interface IntroCarouselProps {
    onComplete: () => void;
}

// --- LOGO ELEGANTE PARA LA PRIMERA PANTALLA ---
const ElegantLogo = () => (
    <div className="relative w-48 h-48 mx-auto mt-4 group">
        {/* Aura mágica animada de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e35212] via-orange-400 to-emerald-500 rounded-[3rem] blur-[30px] opacity-40 animate-pulse duration-3000"></div>
        
        {/* Marco tipo Cristal (Glassmorphism) */}
        <div className="relative w-full h-full bg-white/80 backdrop-blur-2xl p-3.5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white flex items-center justify-center transform transition-transform duration-700 ease-out hover:scale-105">
            {/* Usamos el ícono grande para que se vea ultra nítido */}
            <img 
                src="/icons/icon-256.webp" 
                alt="Logo Club Pilotos Carreto" 
                className="w-full h-full rounded-[1.8rem] object-cover shadow-inner" 
            />
        </div>
    </div>
);

const slides = [
    {
        // Reemplazamos la ilustración por tu Logo Premium
        illustration: <ElegantLogo />,
        title: '¡Bienvenido al Club Pilotos Carreto!',
        points: [
            "Aquí no solo cargas gasolina… ¡cargas experiencia! 🔥",
            "Mientras otros te dan un helado, nosotros te damos estatus, retos y gloria local."
        ]
    },
    {
        illustration: <IllustrationHowItWorks />,
        title: 'Gana XP con cada carga',
        points: [
            "Cada vez que cargas, muestra tu QR y gana Litros de Experiencia (XP).",
            "Cuanto más ruedas, más XP acumulas… y más subes de nivel."
        ]
    },
    {
        illustration: <IllustrationLevels />,
        title: 'Sube de Nivel y Conviértete en Leyenda',
         points: [
            "Comienza como Novato y escala hasta ser una Leyenda Carreto.",
            "Cada nivel desbloquea nuevos beneficios y reconocimiento en la comunidad."
        ]
    },
    {
        illustration: <IllustrationRewards />,
        title: 'Sorteos y Retos Sorpresa',
         points: [
            "¡Cada carga puede activar el Sorteo Relámpago y darte premios al instante!",
            "Participa en retos locales como “El Madrugador” para ganar XP extra."
        ]
    },
];

const IntroCarousel: React.FC<IntroCarouselProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < slides.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const currentSlide = slides[currentStep];

    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden pb-[env(safe-area-inset-bottom)] relative">
            
            {/* Barra de progreso superior */}
            <div className="px-6 pt-[max(env(safe-area-inset-top),2rem)]">
                <div className="flex gap-2 my-4">
                    {slides.map((_, index) => (
                        <div 
                            key={index} 
                            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ease-out ${
                                currentStep >= index 
                                ? 'bg-gradient-to-r from-[#e35212] to-orange-400 shadow-sm' 
                                : 'bg-gray-200'
                            }`} 
                        />
                    ))}
                </div>
            </div>

            {/* Contenedor central (Ilustración y Textos) */}
            <div className="flex-grow overflow-y-auto px-6 pb-24 flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-center py-8 min-h-[280px]">
                    <div className="w-full max-w-[280px] flex justify-center animate-fade-in-up">
                        {currentSlide.illustration}
                    </div>
                </div>

                <div className="flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                        {currentSlide.title}
                    </h2>
                    
                    {currentSlide.points && (
                        <ul className="text-left space-y-4 text-gray-600 font-medium">
                            {currentSlide.points.map((point, index) => (
                                <li key={index} className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-gray-100">
                                    <div className="bg-emerald-50 p-1.5 rounded-full shrink-0 mt-0.5">
                                        <CheckIcon className="w-5 h-5 text-[#136A40]" />
                                    </div>
                                    <span className="leading-snug">{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Footer Flotante con Botones */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F4F5F7] via-[#F4F5F7] to-transparent z-20">
                <div className="space-y-4 max-w-sm mx-auto">
                    <button
                        onClick={nextStep}
                        className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-[1.5rem] text-lg hover:bg-gray-800 transition-all duration-300 active:scale-95 shadow-lg shadow-gray-900/20 flex justify-center items-center gap-2"
                    >
                        <span>{currentStep === slides.length - 1 ? '¡Comenzar!' : 'Continuar'}</span>
                        {currentStep < slides.length - 1 && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                    
                    <button 
                        onClick={onComplete} 
                        className="w-full text-gray-500 font-bold text-sm hover:text-gray-800 transition-colors uppercase tracking-widest py-2"
                    >
                        Omitir intro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroCarousel;