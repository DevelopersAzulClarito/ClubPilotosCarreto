import React, { useEffect } from 'react';
import TermsScreen from './TermsScreen';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-end"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md h-[93dvh] bg-white rounded-t-[2rem] flex flex-col shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-1 bg-gray-200 rounded-full absolute top-5 left-1/2 -translate-x-1/2"></div>
                        <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-3">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="mt-3">
                            <h2 className="text-base font-black text-gray-900 leading-tight">Términos y Condiciones</h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Club Pilotos Carreto</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:scale-90 transition-all shrink-0"
                        aria-label="Cerrar"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido con scroll — TermsScreen sin botón "Volver" */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <TermsScreen />
                </div>

                {/* Pie */}
                <div className="px-5 py-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
