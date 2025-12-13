
import React from 'react';
import { PlayerProfile } from '../../types';
import XPBar from '../XPBar';
import { XP_PER_LEVEL } from '../../constants';
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

    return (
        <div className="p-6 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
                <img 
                    src={player.avatarUrl} 
                    alt={player.name} 
                    className="w-32 h-32 rounded-full border-4 border-[#e35212] shadow-lg object-cover"
                />
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <PencilIcon className="w-8 h-8"/>
                    <input 
                        type="file" 
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-[#e35212]">
                    <span className="text-lg font-bold text-[#e35212]">{player.level}</span>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>

            <div className="w-full space-y-2">
                <XPBar currentXp={player.xp} maxXp={XP_PER_LEVEL} />
                <p className="text-sm text-gray-500">{player.xp} / {XP_PER_LEVEL} XP para el siguiente nivel</p>
            </div>

            <div className="w-full pt-4">
                 <button
                    onClick={onLogout}
                    className="w-full bg-gray-200 text-red-600 font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-300 transition-all duration-300"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
