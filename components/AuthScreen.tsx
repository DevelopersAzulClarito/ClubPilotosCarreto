import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon'; 

interface AuthScreenProps {
    onLogin: (identifier: string, pass: string) => void;
    onRegister: (info: any) => void;
}

// --- CORRECCIÓN: Definimos este componente AFUERA de AuthScreen ---
// Al estar afuera, React no lo recrea en cada tecla y el input no pierde el foco.
const InputIconWrapper = ({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e35212] transition-colors pointer-events-none">
            {icon}
        </div>
        {children}
    </div>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Login State
    const [identifier, setIdentifier] = useState('');
    const [pass, setPass] = useState('');
    
    // Register State
    const [rName, setRName] = useState('');
    const [rPhone, setRPhone] = useState('');
    const [rEmail, setREmail] = useState('');
    const [rPass, setRPass] = useState('');
    const [rAge, setRAge] = useState('');

    const inputClasses = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#e35212]/20 focus:border-[#e35212] block w-full pl-12 p-4 transition-all duration-200 outline-none placeholder-gray-400";

    return (
        <div className="flex flex-col h-full p-6 justify-center">
            
            {/* --- HEADER --- */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                    {isLogin ? '¡Hola de nuevo!' : 'Únete al Club'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {isLogin 
                        ? 'Ingresa para ver tus puntos y recompensas.' 
                        : 'Empieza a ganar XP con cada carga de gasolina.'}
                </p>
            </div>

            {/* --- TABS --- */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-8 relative">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isLogin 
                        ? 'bg-white text-gray-900 shadow-md transform scale-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Iniciar Sesión
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                        !isLogin 
                        ? 'bg-white text-gray-900 shadow-md transform scale-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Registrarme
                </button>
            </div>

            {/* --- FORMS --- */}
            <div className="bg-white rounded-3xl transition-all duration-500">
                {isLogin ? (
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(identifier, pass); }} className="space-y-5 animate-fade-in-up">
                        
                        <InputIconWrapper icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        }>
                            <input 
                                type="text" 
                                placeholder="Correo o Teléfono" 
                                value={identifier} 
                                onChange={e => setIdentifier(e.target.value)} 
                                className={inputClasses}
                                required
                            />
                        </InputIconWrapper>

                        <InputIconWrapper icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        }>
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                value={pass} 
                                onChange={e => setPass(e.target.value)} 
                                className={inputClasses}
                                required
                            />
                        </InputIconWrapper>

                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-semibold text-[#e35212] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-[#e35212] to-[#ff7b42] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all duration-300"
                        >
                            Entrar
                        </button>
                    </form>
                ) : (
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        onRegister({ name: rName, phone: rPhone, email: rEmail, password: rPass, age: rAge }); 
                    }} className="space-y-4 animate-fade-in-up">
                        
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 items-start">
                            <div className="bg-white p-1 rounded-full shadow-sm text-lg">💡</div>
                            <p className="text-xs text-orange-800 leading-relaxed pt-1">
                                <b>Importante:</b> Usa el mismo número de celular que usas en la gasolinera para recuperar tus puntos antiguos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <InputIconWrapper icon={<UserIcon className="w-5 h-5"/>}>
                                <input type="text" placeholder="Nombre Completo" value={rName} onChange={e => setRName(e.target.value)} className={inputClasses} required />
                            </InputIconWrapper>

                            <InputIconWrapper icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            }>
                                <input type="tel" placeholder="Teléfono" value={rPhone} onChange={e => setRPhone(e.target.value)} className={inputClasses} required />
                            </InputIconWrapper>

                            <InputIconWrapper icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            }>
                                <input type="email" placeholder="Correo Electrónico" value={rEmail} onChange={e => setREmail(e.target.value)} className={inputClasses} required />
                            </InputIconWrapper>

                            <div className="flex gap-3">
                                <div className="flex-[2]">
                                     <InputIconWrapper icon={
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    }>
                                        <input type="password" placeholder="Contraseña" value={rPass} onChange={e => setRPass(e.target.value)} className={inputClasses} required />
                                    </InputIconWrapper>
                                </div>
                                <div className="flex-1">
                                    <input type="number" placeholder="Edad" value={rAge} onChange={e => setRAge(e.target.value)} className={`${inputClasses} pl-4 text-center`} required />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300 mt-2"
                        >
                            Crear Cuenta
                        </button>
                    </form>
                )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
                Al continuar, aceptas los <span className="underline cursor-pointer">Términos y Condiciones</span> de Club Pilotos Carreto.
            </p>
        </div>
    );
};

export default AuthScreen;