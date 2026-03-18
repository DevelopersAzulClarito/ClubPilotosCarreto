import React from 'react';
import { PlayerProfile, ActiveTab } from '../../types';
import { CloseIcon } from '../icons/CloseIcon';
import { WifiIcon } from '../icons/WifiIcon';
import { CarretoLogoIcon } from '../icons/CarretoLogoIcon';

interface QRScreenProps {
    player: PlayerProfile;
    setActiveTab: (tab: ActiveTab) => void;
    onCheckin?: () => void; 
}

const QRScreen: React.FC<QRScreenProps> = ({ player, setActiveTab }) => {
    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] relative overflow-hidden">
            
            {/* --- DECORACIÓN DE FONDO --- */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-200/50 to-transparent pointer-events-none"></div>
            <div className="absolute top-10 right-0 w-64 h-64 bg-orange-400 opacity-[0.08] blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute top-40 left-0 w-64 h-64 bg-emerald-500 opacity-[0.06] blur-[80px] rounded-full pointer-events-none"></div>

            {/* --- HEADER --- */}
            <header className="px-6 py-5 flex items-center justify-between relative z-20">
                <div className="w-10"></div> {/* Spacer */}
                <h2 className="text-lg font-black text-gray-900 tracking-widest uppercase text-center">Pase Digital</h2>
                <button 
                    onClick={() => setActiveTab('home')} 
                    className="p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:bg-white hover:text-gray-900 transition-all active:scale-95 shadow-sm border border-gray-200/50"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-grow flex flex-col items-center pt-2 px-5 space-y-6 overflow-y-auto pb-28 relative z-10">
                
                {/* --- TICKET / PASE VIP UNIFICADO --- */}
                <div className="w-full max-w-[340px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col relative border border-gray-100/80">
                    
                    {/* PARTE SUPERIOR: Membresía Oscura */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-7 relative overflow-hidden">
                        {/* Brillo interno en la tarjeta oscura */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/20 blur-2xl rounded-full"></div>
                        
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="brightness-0 invert opacity-95">
                                <CarretoLogoIcon className="w-24 h-auto" />
                            </div>
                            <WifiIcon className="w-6 h-6 transform rotate-90 opacity-40 text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md mb-2 border border-white/5">
                                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <p className="text-[9px] text-white font-bold tracking-[0.2em] uppercase">Piloto Oficial</p>
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{player.name}</h3>
                            <p className="font-mono text-sm text-gray-400 tracking-[0.15em]">{player.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3')}</p>
                        </div>
                    </div>

                    {/* DIVISOR DEL TICKET (Efecto de corte) */}
                    <div className="relative h-8 bg-white">
                        {/* Línea punteada */}
                        <div className="absolute top-1/2 left-4 right-4 border-t-[2.5px] border-dashed border-gray-200 -translate-y-1/2"></div>
                        {/* Círculos laterales (Cortes) - El color debe coincidir con el bg-[#F4F5F7] de la app */}
                        <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#F4F5F7] rounded-full -translate-y-1/2 shadow-inner border-r border-gray-100/80"></div>
                        <div className="absolute top-1/2 -right-4 w-8 h-8 bg-[#F4F5F7] rounded-full -translate-y-1/2 shadow-inner border-l border-gray-100/80"></div>
                    </div>

                    {/* PARTE CENTRAL: QR Code */}
                    <div className="p-6 pt-2 flex flex-col items-center bg-white relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 border border-emerald-100">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Listo para escanear
                        </div>

                        {/* Marco Escáner para el QR */}
                        <div className="relative p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            {/* Esquinas del escáner */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-xl"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-xl"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-xl"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-xl"></div>
                            
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CARRETO-${player.phone}`} 
                                alt="QR Code" 
                                className="w-44 h-44 mix-blend-multiply opacity-95"
                            />
                        </div>
                        
                        <p className="text-[10px] font-bold text-gray-300 mt-4 tracking-widest uppercase">
                            ID: {player.id?.substring(0,8) || player.customerId?.substring(0,8)}
                        </p>
                    </div>

                    {/* PARTE INFERIOR: Estadísticas Rápidas */}
                    <div className="grid grid-cols-3 bg-gray-50/80 divide-x divide-gray-200/60 border-t border-gray-100">
                        <div className="py-4 px-2 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nivel</span>
                            <span className="text-xl font-black text-[#136A40] leading-none drop-shadow-sm">{player.level}</span>
                        </div>
                        <div className="py-4 px-2 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Puntos</span>
                            <span className="text-xl font-black text-[#e35212] leading-none drop-shadow-sm">{player.xp}</span>
                        </div>
                        <div className="py-4 px-2 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check-ins</span>
                            <span className="text-xl font-black text-gray-800 leading-none drop-shadow-sm">{(player as any).visits || 0}</span>
                        </div>
                    </div>
                </div>

                {/* --- ALERTA ELEGANTE --- */}
                <div className="w-full max-w-[340px]">
                    <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-2.5 rounded-xl shadow-sm shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-0.5">Importante</h4>
                            <p className="text-xs text-gray-600 font-medium leading-snug">
                                Muestra este pase en <b className="text-gray-900">cada carga</b> para asegurar tus puntos y recompensas.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QRScreen;