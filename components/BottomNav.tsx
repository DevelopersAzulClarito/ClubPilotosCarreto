import React from 'react';
import { ActiveTab } from '../types';

// ============================================================================
// ÍCONOS IDÉNTICOS A LA IMAGEN (Siempre en Contorno / Outline)
// ============================================================================

const IconHome = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const IconStore = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const IconQR = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5Zm0 9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 19.125v-4.5Zm9.75-9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM16.5 16.5h1.5v1.5h-1.5v-1.5Zm-1.5-1.5h1.5v1.5H15v-1.5Zm1.5-1.5h1.5v1.5h-1.5v-1.5Zm-1.5 3h1.5v1.5H15v-1.5Zm3-1.5h1.5v1.5H18v-1.5Z" />
    </svg>
);

const IconGift = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
);

const IconUser = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

// ============================================================================

interface BottomNavProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{
    label: string;
    IconComp: React.FC<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
    isPrimary?: boolean; 
}> = ({ label, IconComp, isActive, onClick, isPrimary }) => {

    // --- DISEÑO DEL BOTÓN CENTRAL DESTACADO (QR) ---
    if (isPrimary) {
        return (
            <div className="relative flex flex-col items-center justify-center -top-5">
                <button 
                    onClick={onClick} 
                    className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl transform transition-all duration-300 active:scale-95 ${
                        isActive 
                        ? 'bg-emerald-600 shadow-emerald-500/40 scale-105' 
                        : 'bg-[#e35212] shadow-orange-500/40'
                    }`}
                >
                    <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                        <IconComp className="w-7 h-7" />
                    </div>
                </button>
                <span className={`text-[10.5px] font-bold mt-1.5 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {label}
                </span>
            </div>
        );
    }

    // --- DISEÑO DE LOS BOTONES NORMALES (SOLO LÍNEAS) ---
    return (
        <button 
            onClick={onClick} 
            className="relative flex flex-col items-center justify-center w-full h-full pt-2 pb-1 group"
        >
            {/* Píldora de fondo clarita que aparece con animación cuando está activo */}
            <div className={`absolute top-1.5 flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ${
                isActive ? 'bg-orange-50 scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}></div>
            
            {/* Icono animado (Siempre en Stroke/Contorno) */}
            <div className={`relative z-10 transition-all duration-300 ${
                isActive ? 'text-[#e35212] -translate-y-0.5' : 'text-gray-400 group-hover:text-gray-500'
            }`}>
                <IconComp className="w-6 h-6" />
            </div>
            
            {/* Texto de la etiqueta */}
            <span className={`relative z-10 text-[10.5px] mt-1 transition-all duration-300 ${
                isActive ? 'font-bold text-[#e35212]' : 'font-medium text-gray-500'
            }`}>
                {label}
            </span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        // Contenedor principal convertido en barra FLOTANTE (Floating Nav)
        <div 
            className="fixed left-0 right-0 w-[94%] max-w-sm mx-auto bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[2rem] z-50 transition-all duration-300"
            // Se calcula 1rem (16px) de separación desde el borde, más el espacio seguro del iPhone
            style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
            {/* Contenedor de los botones */}
            <div className="flex items-center justify-around h-[4.5rem] px-2 relative">
               <NavItem 
                    label="Inicio"
                    IconComp={IconHome}
                    isActive={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
               />
                <NavItem 
                    label="Tienda"
                    IconComp={IconStore}
                    isActive={activeTab === 'store'}
                    onClick={() => setActiveTab('store')}
               />
               
               {/* BOTÓN CENTRAL QR */}
               <NavItem 
                    label="Pase"
                    IconComp={IconQR}
                    isActive={activeTab === 'qr'}
                    onClick={() => setActiveTab('qr')}
                    isPrimary={true}
               />
               
               <NavItem 
                    label="Premios"
                    IconComp={IconGift}
                    isActive={activeTab === 'levels'}
                    onClick={() => setActiveTab('levels')}
               />
               <NavItem 
                    label="Perfil"
                    IconComp={IconUser}
                    isActive={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
               />
            </div>
        </div>
    );
};

export default BottomNav;