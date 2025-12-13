import React, { useState } from 'react';
import { IllustrationWelcome } from './illustrations/IllustrationWelcome';
import { IllustrationHowItWorks } from './illustrations/IllustrationHowItWorks';
import { IllustrationLevels } from './illustrations/IllustrationLevels';
import { IllustrationRewards } from './illustrations/IllustrationRewards';
import { CheckIcon } from './icons/CheckIcon';


interface IntroCarouselProps {
    onComplete: () => void;
}

const slides = [
    {
        illustration: <IllustrationWelcome />,
        title: '¡Bienvenido al Club de Pilotos Carreto!',
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
        <div className="flex flex-col flex-grow p-6 text-gray-900 text-center">
            <div className="flex gap-2 my-4">
                {slides.map((_, index) => (
                    <div key={index} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${currentStep >= index ? 'bg-gray-800' : 'bg-gray-300'}`} />
                ))}
            </div>

            <div className="flex-grow flex items-center justify-center my-8 px-4">
                <div className="w-full h-full max-w-[250px] max-h-[250px]">
                    {currentSlide.illustration}
                </div>
            </div>

            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold mb-4">{currentSlide.title}</h2>
                 {currentSlide.points && (
                    <ul className="text-left space-y-3 mb-8 text-gray-600">
                        {currentSlide.points.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-[#136A40] mt-1 flex-shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-auto space-y-4">
                 <button
                    onClick={nextStep}
                    className="w-full bg-[#e35212] text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                    Continuar
                </button>
                <button onClick={onComplete} className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
                    Omitir intro
                </button>
            </div>
        </div>
    );
};

export default IntroCarousel;