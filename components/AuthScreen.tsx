import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon'; 

interface AuthScreenProps {
    onLogin: (identifier: string, pass: string) => Promise<void> | void;
    onRegister: (info: any) => Promise<void> | void;
}

// --- Definimos este componente AFUERA de AuthScreen ---
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
    
    // Estado de Carga (Nuevo)
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [identifier, setIdentifier] = useState('');
    const [pass, setPass] = useState('');
    
    // Register State
    const [rName, setRName] = useState('');
    const [rPhone, setRPhone] = useState('');
    const [rEmail, setREmail] = useState('');
    const [rPass, setRPass] = useState('');
    const [rAge, setRAge] = useState('');

    // Error State
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const inputClasses = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#e35212]/20 focus:border-[#e35212] block pl-12 p-4 transition-all duration-200 outline-none placeholder-gray-400";

    const handleTabChange = (loginState: boolean) => {
        setIsLogin(loginState);
        setErrorMsg(null); 
    };

    // --- VALIDACIONES DE REGISTRO ---
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const cleanPhone = rPhone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return setErrorMsg("El número de celular debe tener exactamente 10 dígitos.");
        }

        const ageNum = parseInt(rAge, 10);
        if (isNaN(ageNum) || ageNum < 18) {
            return setErrorMsg("Debes tener al menos 18 años para poder registrarte.");
        }
        if (ageNum > 100) {
            return setErrorMsg("Por favor, ingresa una edad válida.");
        }

        const passErrors = [];
        if (rPass.length < 8) passErrors.push("8 caracteres");
        if (!/[A-Z]/.test(rPass)) passErrors.push("1 letra mayúscula");
        if (!/[0-9]/.test(rPass)) passErrors.push("1 número");

        if (passErrors.length > 0) {
            const formattedErrors = passErrors.length === 1 
                ? passErrors[0] 
                : passErrors.slice(0, -1).join(', ') + ' y ' + passErrors[passErrors.length - 1];
            return setErrorMsg(`La contraseña debe incluir al menos: ${formattedErrors}.`);
        }

        setIsLoading(true);
        try {
            await onRegister({ name: rName, phone: rPhone, email: rEmail, password: rPass, age: rAge });
        } catch (error: any) {
            let msg = error.message || "Error al intentar registrarse.";
            if (msg.includes("email-already-in-use")) {
                msg = "Este correo ya está registrado en otra cuenta.";
            }
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // --- VALIDACIONES DE LOGIN ---
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const idTrimmed = identifier.trim();
        const passTrimmed = pass.trim();

        if (!idTrimmed) return setErrorMsg("Por favor, ingresa tu correo o celular.");
        if (!passTrimmed) return setErrorMsg("Por favor, ingresa tu contraseña.");

        if (!idTrimmed.includes('@')) {
            const cleanPhone = idTrimmed.replace(/\D/g, '');
            if (/[a-zA-Z]/.test(idTrimmed)) return setErrorMsg("Si usas tu celular, ingresa solo números. Si es correo, no olvides incluir el '@'.");
            if (cleanPhone.length < 10) return setErrorMsg(`Al celular le faltan dígitos (escribiste ${cleanPhone.length}, deben ser 10).`);
            if (cleanPhone.length > 10) return setErrorMsg(`El celular tiene demasiados dígitos (escribiste ${cleanPhone.length}, deben ser 10).`);
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(idTrimmed)) return setErrorMsg("El correo electrónico no tiene un formato válido.");
        }

        setIsLoading(true);
        try {
            await onLogin(idTrimmed, passTrimmed);
        } catch (error: any) {
            let msg = error.message || "Error al iniciar sesión.";
            
            if (msg.includes("Este número no está registrado") || msg.includes("user-not-found")) {
                msg = "Este número o correo no está registrado. Ve a la pestaña 'Registrarme' para crear tu cuenta.";
            } else if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
                msg = "La contraseña es incorrecta o los datos no coinciden.";
            } else if (msg.includes("too-many-requests")) {
                msg = "Demasiados intentos fallidos. Por seguridad, intenta de nuevo más tarde.";
            }
            
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 justify-center">
            
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                    {isLogin ? '¡Hola de nuevo!' : 'Únete al Club'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {isLogin 
                        ? 'Ingresa para ver tus puntos y recompensas.' 
                        : 'Empieza a ganar Puntos con cada carga de gasolina.'}
                </p>
            </div>

            <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-6 relative">
                <button 
                    type="button"
                    onClick={() => handleTabChange(true)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isLogin 
                        ? 'bg-white text-gray-900 shadow-md transform scale-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Iniciar Sesión
                </button>
                <button 
                    type="button"
                    onClick={() => handleTabChange(false)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                        !isLogin 
                        ? 'bg-white text-gray-900 shadow-md transform scale-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Registrarme
                </button>
            </div>

            {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-red-800 font-medium leading-relaxed">{errorMsg}</p>
                </div>
            )}

            <div className="bg-white rounded-3xl transition-all duration-500">
                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in-up">
                        
                        <InputIconWrapper icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        }>
                            <input 
                                type="text" 
                                placeholder="Correo o Celular (10 dígitos)" 
                                value={identifier} 
                                onChange={e => setIdentifier(e.target.value)} 
                                className={inputClasses}
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
                            />
                        </InputIconWrapper>

                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-semibold text-[#e35212] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#e35212] to-[#ff7b42] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Cargando...' : 'Entrar'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in-up">
                        
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 items-start">
                            <div className="bg-white p-1 rounded-full shadow-sm text-lg shrink-0">💡</div>
                            <p className="text-xs text-orange-800 leading-relaxed pt-1">
                                <b>Importante:</b> Usa el mismo celular de la gasolinera para recuperar tus puntos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <InputIconWrapper icon={<UserIcon className="w-5 h-5"/>}>
                                <input type="text" placeholder="Nombre Completo" value={rName} onChange={e => setRName(e.target.value)} className={inputClasses} required />
                            </InputIconWrapper>

                            <InputIconWrapper icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            }>
                                <input type="tel" inputMode="numeric" placeholder="Celular (10 dígitos)" value={rPhone} onChange={e => setRPhone(e.target.value)} className={inputClasses} required />
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
                                        <input type="password" placeholder="Contraseña Segura" value={rPass} onChange={e => setRPass(e.target.value)} className={inputClasses} required />
                                    </InputIconWrapper>
                                </div>
                                <div className="flex-1">
                                    <input type="number" inputMode="numeric" placeholder="Edad" value={rAge} onChange={e => setRAge(e.target.value)} className={`${inputClasses} pl-4 text-center`} required />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creando...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
                Al continuar, aceptas los <span className="underline cursor-pointer text-gray-500 hover:text-[#e35212] transition-colors">Términos y Condiciones</span> de Club Pilotos Carreto.
            </p>
        </div>
    );
};

export default AuthScreen;