import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import { acceptTerms } from '../services/userService';
import TermsScreen from './TermsScreen';

interface TermsGuardModalProps {
    player: PlayerProfile;
    onDecline: () => void;
}

const TermsGuardModal: React.FC<TermsGuardModalProps> = ({ player, onDecline }) => {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [acceptError, setAcceptError] = useState<string | null>(null);

    // Bloquear tecla Escape — no hay salida por teclado
    useEffect(() => {
        const block = (e: KeyboardEvent) => {
            if (e.key === 'Escape') e.preventDefault();
        };
        window.addEventListener('keydown', block, true);
        return () => window.removeEventListener('keydown', block, true);
    }, []);

    const handleAccept = async () => {
        if (!player.id || isAccepting || isDeclining) return;
        setAcceptError(null);
        setIsAccepting(true);
        try {
            await acceptTerms(player.id);
            // subscribeToUser detectará hasAcceptedTerms: true y actualizará el player en App.tsx
            // El guard desaparece automáticamente — no se necesita callback adicional
        } catch (err) {
            console.error('[TermsGuard] Error al aceptar términos:', err);
            setAcceptError('No se pudo guardar. Verifica tu conexión e intenta de nuevo.');
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        if (isAccepting || isDeclining) return;
        setIsDeclining(true);
        await onDecline();
    };

    return (
        // El overlay NO tiene onClick para evitar cierre accidental
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-end">
            <div className="w-full max-w-md h-[96dvh] bg-white rounded-t-[2rem] flex flex-col shadow-2xl overflow-hidden">

                {/* Cabecera fija */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-black text-gray-900 leading-tight">Lectura Obligatoria</h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Lee y acepta los términos para continuar</p>
                        </div>
                    </div>
                </div>

                {/* Área de scroll con los Términos */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {/* Sin prop onBack: oculta el botón "Volver" de TermsScreen */}
                    <TermsScreen />
                </div>

                {/* Pie fijo con botones de acción */}
                <div className="shrink-0 border-t border-gray-100 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.07)]">
                    {acceptError && (
                        <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-xs text-red-700 font-semibold text-center">{acceptError}</p>
                        </div>
                    )}
                    <div className="px-5 py-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleDecline}
                            disabled={isDeclining || isAccepting}
                            className="flex-1 py-3.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeclining ? 'Cerrando sesión...' : 'No Aceptar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={isAccepting || isDeclining}
                            className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAccepting
                                ? <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                  </>
                                : '✓ Aceptar Términos'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsGuardModal;
