import React, { useState } from 'react';

interface ProfilingScreenProps {
    // onComplete ahora puede recibir opcionalmente las respuestas por si las quieres guardar en Firebase después
    onComplete: (answers?: Record<number, string>) => void;
}

const questions = [
    {
        id: 1,
        text: '¿Con cuál de estas frases te identificas más?',
        options: [
            { icon: '⛽', text: '“Mi tanque conoce mejor la estación que mi familia.”' },
            { icon: '☕', text: '“Si no cargo aquí, no arranco el día.”' },
            { icon: '💸', text: '“Siempre digo: ‘échale completo, joven’.”' },
        ],
    },
    {
        id: 2,
        text: '¿Cómo describirías tu día al volante?',
        options: [
            { icon: '🥵', text: '“Si mi carro hablara, pediría vacaciones.”' },
            { icon: '🚕', text: '“Sube uno, baja otro... y así todo el día.”' },
            { icon: '🦇', text: '“Mi taxi y yo somos inseparables, como Batman y el Batimóvil.”' },
        ],
    },
    {
        id: 3,
        text: 'Cuando vienes a Carreto Gas, normalmente estás…',
        options: [
            { icon: '🧳', text: '“De paso, camino a Acapulco y con la hielera lista.”' },
            { icon: '🏖️', text: '“Regresando de Acapulco, con el traje de baño todavía húmedo.”' },
            { icon: '🏡', text: '“Ni de ida ni de vuelta, ¡yo vivo aquí cargando felicidad!”' },
        ],
    },
];

const ProfilingScreen: React.FC<ProfilingScreenProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const currentQuestion = questions[currentStep];
    const totalSteps = questions.length;
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

    // Seleccionar una opción
    const handleSelect = (optionText: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionText }));
    };

    // Botón de Continuar / Finalizar
    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Si es la última pregunta, mandamos las respuestas al App.tsx
            onComplete(answers);
        }
    };

    const hasAnsweredCurrent = !!answers[currentQuestion.id];

    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden relative">
            
            {/* Motor de Animaciones CSS Optimizado para Android */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideInRight {
                    from { transform: translateX(30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .anim-slide-in {
                    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}} />

            {/* --- HEADER Y BARRA DE PROGRESO --- */}
            <div className="pt-10 px-6 pb-4 bg-white shadow-sm z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Conociendo al Piloto</h2>
                    <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {currentStep + 1} de {totalSteps}
                    </span>
                </div>
                
                {/* Barra de Progreso Dinámica */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#e35212] to-[#ff7b42] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* --- CONTENEDOR DE PREGUNTA --- */}
            <div className="flex-grow px-6 pt-8 pb-24 overflow-y-auto">
                {/* Usamos el key en el contenedor para que React reinicie la animación en cada paso */}
                <div key={currentStep} className="anim-slide-in space-y-6">
                    
                    <h3 className="text-2xl font-black text-gray-800 leading-snug drop-shadow-sm mb-6">
                        {currentQuestion.text}
                    </h3>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = answers[currentQuestion.id] === option.text;
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(option.text)}
                                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                                        isSelected 
                                        ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10 transform scale-[1.01]' 
                                        : 'bg-white border-transparent shadow-[0_4px_15px_rgb(0,0,0,0.04)] hover:border-emerald-200 text-gray-600'
                                    }`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl shrink-0 transition-colors ${
                                        isSelected ? 'bg-emerald-100/50' : 'bg-gray-50'
                                    }`}>
                                        {option.icon}
                                    </div>
                                    
                                    <p className={`ml-4 text-left font-medium text-[0.9rem] leading-snug ${
                                        isSelected ? 'text-[#136A40] font-bold' : 'text-gray-700'
                                    }`}>
                                        {option.text}
                                    </p>

                                    {/* Círculo indicador tipo "Radio Button" */}
                                    <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- FOOTER FLOTANTE CON BOTÓN --- */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F4F5F7] via-[#F4F5F7] to-transparent">
                <button
                    onClick={handleNext}
                    disabled={!hasAnsweredCurrent}
                    className={`w-full font-black py-4 rounded-[1.5rem] text-lg shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${
                        hasAnsweredCurrent
                        ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/30 translate-y-0 opacity-100'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed translate-y-2 opacity-80'
                    }`}
                >
                    <span>{currentStep === totalSteps - 1 ? '¡Finalizar!' : 'Continuar'}</span>
                    
                    {hasAnsweredCurrent && currentStep < totalSteps - 1 && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProfilingScreen;     