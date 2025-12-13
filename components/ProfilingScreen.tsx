
import React, { useState } from 'react';

interface ProfilingScreenProps {
    onComplete: () => void;
}

const questions = [
    {
        id: 1,
        text: '¿Con cuál de estas frases te identificas más?',
        options: [
            '“Mi tanque conoce mejor la estación que mi familia.”',
            '“Si no cargo aquí, no arranco el día.”',
            '“Siempre digo: ‘échale completo, joven’.”',
        ],
    },
    {
        id: 2,
        text: '¿Cómo describirías tu día al volante?',
        options: [
            '“Si mi carro hablara, pediría vacaciones.”',
            '“Sube uno, baja otro... y así todo el día.”',
            '“Yo y mi taxi somos inseparables, como Batman y el Batimóvil.”',
        ],
    },
    {
        id: 3,
        text: 'Cuando vienes a Carreto Gas, normalmente estás…',
        options: [
            '“De paso, camino a Acapulco y con la hielera lista.”',
            '“Regresando de Acapulco, con el traje de baño todavía húmedo.”',
            '“Ni de ida ni de vuelta, ¡yo vivo aquí cargando felicidad!”',
        ],
    },
];

const ProfilingScreen: React.FC<ProfilingScreenProps> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<{ [key: number]: string | null }>({ 1: null, 2: null, 3: null });

    const handleSelect = (questionId: number, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const allAnswered = Object.values(answers).every(answer => answer !== null);

    return (
        <div className="p-6 flex flex-col space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-900">¡Unas preguntas rápidas!</h2>
            <p className="text-center text-gray-500 text-sm">Ayúdanos a conocerte mejor como piloto.</p>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                {questions.map(q => (
                    <div key={q.id}>
                        <h3 className="font-semibold text-gray-800 mb-3">{q.id}. {q.text}</h3>
                        <div className="space-y-2">
                            {q.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(q.id, option)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition text-sm ${
                                        answers[q.id] === option 
                                        ? 'bg-green-50 border-green-500 text-[#136A40]' 
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onComplete}
                disabled={!allAnswered}
                className="w-full bg-[#e35212] text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            >
                Finalizar
            </button>
        </div>
    );
};

export default ProfilingScreen;