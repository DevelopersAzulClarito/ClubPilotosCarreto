import React, { useState } from 'react';
import { PlayerProfile } from '../../types';
import XPBar from '../XPBar';
import { getRequiredXpForLevel } from '../../constants';
import { PencilIcon } from '../icons/PencilIcon';

// Firebase imports para actualizar datos y enviar correos de seguridad
import { db } from '../firebaseTemp';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

// --- Iconos extra necesarios ---
const CheckIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const XMarkIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);
const ShieldIcon = ({ className }: { className?: string }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
);

interface ProfileScreenProps {
    player: PlayerProfile;
    onLogout: () => void;
    onAvatarChange: (newAvatarUrl: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, onLogout, onAvatarChange }) => {
    // Estados para la edición del nombre
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);

    // Estado para notificaciones (Toast)
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // --- Función de Notificaciones Rápidas ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000); // Se oculta a los 4 segundos
    };

    // --- Manejador de Cambio de Foto ---
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast("La imagen es muy pesada. Máximo 2MB.", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const base64String = e.target.result as string;

                    try {
                        showToast("Subiendo foto...", "success");

                        const userRef = doc(db, 'customers', player.id || player.customerId);
                        await updateDoc(userRef, { avatarUrl: base64String });

                        onAvatarChange(base64String);
                        showToast("¡Foto de perfil actualizada!", "success");
                    } catch (error) {
                        console.error("Error al actualizar la foto:", error);
                        showToast("Hubo un error al guardar tu foto.", "error");
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Manejador de Actualización de Nombre ---
    const handleSaveName = async () => {
        const trimmedName = editNameValue.trim();
        if (!trimmedName) {
            setIsEditingName(false);
            return;
        }

        if (trimmedName === player.name) {
            setIsEditingName(false);
            return;
        }

        setIsSavingName(true);
        try {
            const userRef = doc(db, 'customers', player.id || player.customerId);
            await updateDoc(userRef, { name: trimmedName });

            showToast("Nombre actualizado con éxito", "success");
            setIsEditingName(false);
        } catch (error) {
            console.error("Error al actualizar nombre:", error);
            showToast("Hubo un error al guardar tu nombre.", "error");
        } finally {
            setIsSavingName(false);
        }
    };

    // --- Manejador de Cambio de Contraseña Seguro ---
    const handleResetPassword = async () => {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, player.email);
            showToast("Te hemos enviado un correo seguro para actualizar tu contraseña.", "success");
        } catch (error) {
            console.error("Error al enviar correo de reseteo:", error);
            showToast("Error al enviar el correo. Intenta de nuevo más tarde.", "error");
        }
    };

    const requiredXp = getRequiredXpForLevel(player.level);
    const percentage = Math.min(100, Math.round((player.xp / requiredXp) * 100));

    // Determina si debemos mostrar la silueta por defecto (si no hay foto o es la de pravatar)
    const isDefaultAvatar = !player.avatarUrl || player.avatarUrl.includes('pravatar.cc');

    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] overflow-y-auto pb-28 relative">

            {/* --- NOTIFICACIONES TOAST (Flotantes) --- */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[90%] max-w-sm">
                    <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md border ${toast.type === 'success'
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : 'bg-red-500/90 text-white border-red-400'
                        }`}>
                        {toast.type === 'success' ? <CheckIcon className="w-5 h-5 shrink-0" /> : <XMarkIcon className="w-5 h-5 shrink-0" />}
                        <p className="text-sm font-bold leading-tight">{toast.message}</p>
                    </div>
                </div>
            )}
            
            {/* Animación opcional para el modal */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideUpSheet {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .anim-bottom-sheet {
                    animation: slideUpSheet 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}} />

            {/* --- MODAL PARA EDITAR NOMBRE (ELEVADO EN MÓVIL PARA EVITAR TECLADO) --- */}
            {isEditingName && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start pt-[15vh] sm:pt-0 sm:items-center justify-center p-4 touch-none">
                    <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl anim-bottom-sheet">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">Editar Nombre</h3>
                            <button onClick={() => setIsEditingName(false)} className="p-2 text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-90 transition-all">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">¿Cómo te llamas?</label>
                                <input
                                    type="text"
                                    value={editNameValue}
                                    onChange={(e) => setEditNameValue(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#e35212] focus:border-[#e35212] outline-none transition-all"
                                    placeholder="Tu nombre completo"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleSaveName}
                                disabled={isSavingName || !editNameValue.trim()}
                                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-emerald-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
                            >
                                {isSavingName ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER DECORATIVO PREMIUM --- */}
            <div className="relative bg-gradient-to-b from-[#111827] to-[#1f2937] h-56 rounded-b-[2.5rem] shadow-lg overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500 rounded-full mix-blend-overlay opacity-20 blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500 rounded-full mix-blend-overlay opacity-20 blur-3xl -ml-10 -mb-10"></div>

                <div className="absolute inset-0 flex justify-center pt-10">
                    <h2 className="text-white/90 font-black text-lg tracking-widest uppercase">Mi Perfil</h2>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="px-5 sm:px-6 -mt-24 flex flex-col items-center space-y-7 relative z-10">

                {/* --- AVATAR E INSIGNIAS --- */}
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

                    {/* Contenedor del Avatar: Muestra la silueta de Instagram/FB o la foto real */}
                    <div className="w-36 h-36 rounded-full border-[6px] border-[#F4F5F7] shadow-xl relative z-10 bg-gray-200 overflow-hidden flex items-end justify-center">
                        {isDefaultAvatar ? (
                            <svg className="w-[85%] h-[85%] text-white translate-y-[5%]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <img
                                src={player.avatarUrl}
                                alt={player.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 z-20 bg-gray-900 text-white p-3 rounded-full shadow-lg border-4 border-[#F4F5F7] cursor-pointer hover:bg-[#e35212] hover:scale-105 transition-all active:scale-95">
                        <PencilIcon className="w-4 h-4" />
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>

                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 border-[#F4F5F7] shadow-md tracking-widest whitespace-nowrap">
                        Nivel {player.level}
                    </div>
                </div>

                {/* --- NOMBRE EDITABLE Y TÍTULO --- */}
                <div className="text-center w-full max-w-xs">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight truncate">{player.name}</h1>
                        <button
                            onClick={() => { setEditNameValue(player.name); setIsEditingName(true); }}
                            className="text-gray-400 hover:text-[#e35212] active:scale-90 transition-all p-1"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Piloto Oficial</p>
                </div>

                {/* --- TARJETA DE PROGRESO DE NIVEL --- */}
                <div className="w-full bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progreso de Nivel</span>
                        <span className="text-sm font-black text-emerald-600">{percentage}%</span>
                    </div>

                    <XPBar currentXp={player.xp} maxXp={requiredXp} />

                    <div className="flex justify-between mt-3 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                        <span>{player.xp.toLocaleString()} XP</span>
                        <span>Meta: {requiredXp.toLocaleString()} XP</span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500 font-medium">
                            {requiredXp - player.xp > 0 ? (
                                <>¡Te faltan <span className="font-bold text-gray-900">{(requiredXp - player.xp).toLocaleString()} XP</span> para subir!</>
                            ) : (
                                <span className="text-emerald-600 font-bold">¡Tienes experiencia suficiente para subir de nivel!</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* --- SECCIÓN DE DATOS Y SEGURIDAD --- */}
                <div className="w-full space-y-4">

                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-2">Tus Datos</h3>
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                            {/* Fila Teléfono */}
                            <div className="flex items-center space-x-4 p-4 border-b border-gray-50">
                                <div className="p-2.5 bg-blue-50/50 text-blue-500 rounded-[1rem] shadow-sm border border-blue-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Teléfono Registrado</p>
                                    <p className="font-bold text-gray-800 text-sm mt-0.5">{player.phone}</p>
                                </div>
                            </div>
                            {/* Fila Email */}
                            <div className="flex items-center space-x-4 p-4">
                                <div className="p-2.5 bg-emerald-50/50 text-emerald-500 rounded-[1rem] shadow-sm border border-emerald-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Correo Electrónico</p>
                                    <p className="font-bold text-gray-800 text-sm mt-0.5 truncate">{player.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila Seguridad (Cambio de contraseña vía email) */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-2">Seguridad</h3>
                        <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2.5 bg-amber-50/50 text-amber-500 rounded-[1rem] shadow-sm border border-amber-100 shrink-0">
                                    <ShieldIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Contraseña</p>
                                    <p className="text-[10px] text-gray-500 leading-tight pr-2">Te enviaremos un código seguro a tu correo.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleResetPassword}
                                className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 active:scale-95 transition-all shrink-0"
                            >
                                Cambiar
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BOTÓN CERRAR SESIÓN --- */}
                <div className="w-full pt-4">
                    <button
                        onClick={onLogout}
                        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-[1.5rem] hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2 active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Cerrar Sesión</span>
                    </button>
                    <p className="text-[10px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">
                        ID: <span className="font-mono text-gray-500">{player.id || player.customerId}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;