import React from 'react';
import { ActiveTab } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { StoreIcon } from './icons/StoreIcon';
import { QRIcon } from './icons/QRIcon';
import { GiftIcon } from './icons/GiftIcon';
import { UserIcon } from './icons/UserIcon';


interface BottomNavProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-[#e35212]' : 'text-gray-500 hover:text-gray-900'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto h-16 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around z-50">
           <NavItem 
                label="Inicio"
                icon={<HomeIcon className="w-6 h-6 mb-1"/>}
                isActive={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
           />
            <NavItem 
                label="Tienda"
                icon={<StoreIcon className="w-6 h-6 mb-1"/>}
                isActive={activeTab === 'store'}
                onClick={() => setActiveTab('store')}
           />
           <NavItem 
                label="QR"
                icon={<QRIcon className="w-6 h-6 mb-1"/>}
                isActive={activeTab === 'qr'}
                onClick={() => setActiveTab('qr')}
           />
           <NavItem 
                label="Premios"
                icon={<GiftIcon className="w-6 h-6 mb-1"/>}
                isActive={activeTab === 'prizes'}
                onClick={() => setActiveTab('prizes')}
           />
           <NavItem 
                label="Perfil"
                icon={<UserIcon className="w-6 h-6 mb-1"/>}
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
           />
        </div>
    );
};

export default BottomNav;