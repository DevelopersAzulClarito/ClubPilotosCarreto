import React from 'react';
import { ActiveTab } from '../types';

// ============================================================================
// ÍCONOS PREMIUM INTEGRADOS (Soportan estado Activo/Inactivo)
// ============================================================================

const IconHome = ({ active, className }: { active: boolean, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.75"} className={className}>
        {active ? (
            <path fillRule="evenodd" d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.99 8.99a.75.75 0 1 1-1.06 1.061l-4.69-4.69V21a.75.75 0 0 1-.75.75h-3.6a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a.75.75 0 0 1-.75-.75V9.252l-4.69 4.69a.75.75 0 0 1-1.06-1.06l8.99-8.991Z" clipRule="evenodd" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        )}
    </svg>
);

const IconStore = ({ active, className }: { active: boolean, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.75"} className={className}>
        {active ? (
            <path fillRule="evenodd" d="M10.5 3A3 3 0 0 0 7.5 6v1.5h9V6A3 3 0 0 0 13.5 3h-3ZM3 10.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.5v-9ZM8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" clipRule="evenodd" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        )}
    </svg>
);

const IconQR = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5Zm0 9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 19.125v-4.5Zm9.75-9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM16.5 16.5h1.5v1.5h-1.5v-1.5Zm-1.5-1.5h1.5v1.5H15v-1.5Zm1.5-1.5h1.5v1.5h-1.5v-1.5Zm-1.5 3h1.5v1.5H15v-1.5Zm3-1.5h1.5v1.5H18v-1.5Z" />
    </svg>
);

const IconGift = ({ active, className }: { active: boolean, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.75"} className={className}>
        {active ? (
            <>
            <path fillRule="evenodd" d="M12 2.25a3.375 3.375 0 0 0-3.375 3.375c0 .605.158 1.178.435 1.677A2.625 2.625 0 0 0 7.5 9h-3a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-3a2.625 2.625 0 0 0-1.565-1.698A3.375 3.375 0 0 0 12 2.25ZM12 4.125c.621 0 1.125.504 1.125 1.125S12.621 6.375 12 6.375s-1.125-.504-1.125-1.125.504-1.125 1.125-1.125Z" clipRule="evenodd" />
            <path d="M4.5 15v5.25c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5V15H4.5Z" />
            </>
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        )}
    </svg>
);

const IconUser = ({ active, className }: { active: boolean, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.75"} className={className}>
        {active ? (
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        )}
    </svg>
);

// ============================================================================

interface BottomNavProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const NavItem: React.FC<{
    label: string;
    IconComp: React.FC<{ active: boolean; className?: string }>;
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
                        <IconComp active={true} className="w-7 h-7" />
                    </div>
                </button>
                <span className={`text-[10px] font-bold mt-1.5 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {label}
                </span>
            </div>
        );
    }

    // --- DISEÑO DE LOS BOTONES NORMALES ---
    return (
        <button 
            onClick={onClick} 
            className="relative flex flex-col items-center justify-center w-full h-full pt-2 pb-1 group"
        >
            {/* Píldora de fondo que aparece con animación cuando está activo */}
            <div className={`absolute top-1.5 flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${
                isActive ? 'bg-orange-50 scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}></div>
            
            {/* Icono animado */}
            <div className={`relative z-10 transition-all duration-300 ${
                isActive ? 'text-[#e35212] -translate-y-0.5' : 'text-gray-400 group-hover:text-gray-500'
            }`}>
                <IconComp active={isActive} className="w-6 h-6" />
            </div>
            
            {/* Texto de la etiqueta */}
            <span className={`relative z-10 text-[10px] mt-1 transition-all duration-300 ${
                isActive ? 'font-bold text-[#e35212]' : 'font-medium text-gray-500'
            }`}>
                {label}
            </span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        // Contenedor principal con Safe Area para iPhones y esquinas redondeadas
        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.06)] rounded-t-[2rem] z-50 pb-[env(safe-area-inset-bottom)]">
            
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