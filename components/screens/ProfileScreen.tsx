import React from 'react';
import { PlayerProfile } from '../../types';
import XPBar from '../XPBar';
import { getRequiredXpForLevel } from '../../constants';
import { PencilIcon } from '../icons/PencilIcon';

interface ProfileScreenProps {
    player: PlayerProfile;
    onLogout: () => void;
    onAvatarChange: (newAvatarUrl: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, onLogout, onAvatarChange }) => {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onAvatarChange(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const requiredXp = getRequiredXpForLevel(player.level);
    const percentage = Math.min(100, Math.round((player.xp / requiredXp) * 100));

    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] overflow-y-auto pb-28">
            
            {/* --- HEADER DECORATIVO PREMIUM --- */}
            <div className="relative bg-gradient-to-b from-[#111827] to-[#1f2937] h-56 rounded-b-[2.5rem] shadow-lg overflow-hidden shrink-0">
                {/* Destellos de luz en el fondo (Neón sutil) */}
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
                    {/* Aura detrás del avatar */}
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    
                    <img 
                        src={player.avatarUrl} 
                        alt={player.name} 
                        className="w-36 h-36 rounded-full border-[6px] border-[#F4F5F7] shadow-xl object-cover relative z-10 bg-white"
                    />
                    
                    {/* Botón de Cambiar Foto */}
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 z-20 bg-gray-900 text-white p-3 rounded-full shadow-lg border-4 border-[#F4F5F7] cursor-pointer hover:bg-[#e35212] hover:scale-105 transition-all active:scale-95">
                        <PencilIcon className="w-4 h-4"/>
                        <input 
                            type="file" 
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Badge de Nivel Flotante superior */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 border-[#F4F5F7] shadow-md tracking-widest whitespace-nowrap">
                        Nivel {player.level}
                    </div>
                </div>

                {/* --- NOMBRE Y TÍTULO --- */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{player.name}</h1>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Piloto Oficial</p>
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
                                <span className="text-emerald-600 font-bold">¡Tienes puntos suficientes para subir de nivel!</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* --- SECCIÓN DE CONTACTO (Estilo Grupo iOS) --- */}
                <div className="w-full">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3">Tus Datos</h3>
                    
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                        
                        {/* Fila Teléfono */}
                        <div className="flex items-center space-x-4 p-5 border-b border-gray-50">
                            <div className="p-2.5 bg-blue-50/50 text-blue-500 rounded-[1rem] shadow-sm border border-blue-100">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div className="flex-grow">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Teléfono Registrado</p>
                                <p className="font-bold text-gray-800 text-sm mt-0.5">{player.phone}</p>
                            </div>
                        </div>

                        {/* Fila Email */}
                        <div className="flex items-center space-x-4 p-5">
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