import React from 'react';
import { PlayerProfile } from '../../types';
import XPBar from '../XPBar';
import { XP_PER_LEVEL } from '../../constants';
import { PencilIcon } from '../icons/PencilIcon';
// Usaremos SVGs inline para Email/Phone para no obligarte a crear archivos extra

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

    // Calculamos el porcentaje para mostrarlo en texto también
    const percentage = Math.min(100, Math.round((player.xp / XP_PER_LEVEL) * 100));

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24">
            
            {/* --- HEADER DECORATIVO --- */}
            <div className="relative bg-gray-900 h-40 rounded-b-[40px] shadow-lg overflow-hidden shrink-0">
                {/* Patrón de fondo abstracto */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-overlay opacity-20 blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600 rounded-full mix-blend-overlay opacity-20 blur-2xl -ml-10 -mb-10"></div>
                
                <div className="absolute inset-0 flex justify-center pt-8">
                    <h2 className="text-white font-bold text-lg tracking-wide opacity-90">Mi Perfil</h2>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="px-6 -mt-16 flex flex-col items-center space-y-6">
                
                {/* --- AVATAR CON EFECTO --- */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <img 
                        src={player.avatarUrl} 
                        alt={player.name} 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover relative z-10"
                    />
                    
                    {/* Botón de Editar Foto */}
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 z-20 bg-gray-900 text-white p-2.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-[#e35212] transition-colors active:scale-90">
                        <PencilIcon className="w-4 h-4"/>
                        <input 
                            type="file" 
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Badge de Nivel */}
                    <div className="absolute top-0 left-0 z-20 bg-[#e35212] text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">
                        LVL {player.level}
                    </div>
                </div>

                {/* --- NOMBRE Y TÍTULO --- */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{player.name}</h1>
                    <p className="text-sm font-medium text-orange-600 uppercase tracking-widest">Piloto Carreto</p>
                </div>

                {/* --- TARJETA DE PROGRESO (GAMIFICATION) --- */}
                <div className="w-full bg-white p-5 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-gray-400">Progreso de Nivel</span>
                        <span className="text-sm font-black text-[#e35212]">{percentage}%</span>
                    </div>
                    
                    <XPBar currentXp={player.xp} maxXp={XP_PER_LEVEL} />
                    
                    <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                        <span>{player.xp} XP</span>
                        <span>Meta: {XP_PER_LEVEL} XP</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            ¡Te faltan <span className="font-bold text-gray-800">{XP_PER_LEVEL - player.xp} XP</span> para subir de nivel!
                        </p>
                    </div>
                </div>

                {/* --- DATOS PERSONALES --- */}
                <div className="w-full space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-wider">Información Personal</h3>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Teléfono</p>
                            <p className="font-semibold text-gray-800">{player.phone}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="w-full overflow-hidden">
                            <p className="text-xs text-gray-400">Correo Electrónico</p>
                            <p className="font-semibold text-gray-800 truncate">{player.email}</p>
                        </div>
                    </div>
                </div>

                {/* --- LOGOUT --- */}
                <button
                    onClick={onLogout}
                    className="w-full bg-white border-2 border-gray-200 text-gray-500 font-bold py-4 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 mt-4 flex items-center justify-center space-x-2 group"
                >
                    <svg className="w-5 h-5 group-hover:stroke-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Cerrar Sesión</span>
                </button>

                <p className="text-[10px] text-gray-300 pb-4">ID de Cliente: {player.id || player.customerId}</p>
            </div>
        </div>
    );
};

export default ProfileScreen;