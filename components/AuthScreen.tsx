import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon'; 
import { CarretoPlusIcon } from './Icons'; // <-- Importamos el logo
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import { resetPasswordWithIdentifier } from '../services/userService';

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
    
    // Estado de Carga
    const [isLoading, setIsLoading] = useState(false);

    // --- ESTADOS PARA LAS VENTANAS EMERGENTES (MODALES LEGALES) ---
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    // --- ESTADOS PARA RECUPERAR CONTRASEÑA ---
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetInput, setResetInput] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

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

    // --- VALIDACIONES DE RECUPERAR CONTRASEÑA ---
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetMessage(null);
        
        if (!resetInput.trim()) {
            return setResetMessage({ text: "Ingresa tu correo o número de celular.", type: 'error' });
        }
        
        setIsResetting(true);
        try {
            await resetPasswordWithIdentifier(resetInput);
            setResetMessage({ text: "¡Enlace enviado! Revisa tu bandeja de entrada o carpeta de spam.", type: 'success' });
            setResetInput(''); // Limpiamos el input tras el éxito
        } catch (error: any) {
            let msg = error.message || "Error al enviar el correo.";
            if (msg.includes('invalid-email')) msg = "El formato del correo es inválido.";
            else if (msg.includes('user-not-found')) msg = "No hay ninguna cuenta con estos datos.";
            setResetMessage({ text: msg, type: 'error' });
        } finally {
            setIsResetting(false);
        }
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
            if (msg.includes("email-already-in-use") || msg.includes("El correo ya está registrado")) {
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
            
            // Traducción de los errores para el cuadro rojo
            if (msg.includes("Este número no está registrado") || msg.includes("user-not-found")) {
                msg = "Este número o correo no está registrado. Ve a la pestaña 'Registrarme' para crear tu cuenta.";
            } else if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("Credenciales incorrectas")) {
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
            
            <div className="text-center mb-8 flex flex-col items-center">
                
                {/* --- CONTENEDOR DEL LOGO PREMIUM --- */}
                <div className="relative mb-8 group animate-fade-in-up">
                    {/* Aura mágica de colores de fondo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e35212] to-emerald-500 rounded-[2.5rem] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                    
                    {/* Marco esmerilado elegante */}
                    <div className="relative bg-white/80 backdrop-blur-xl p-2.5 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white flex items-center justify-center">
                        <img 
                            src="icons/icon-192.webp" 
                            alt="Logo Carreto" 
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.3rem] object-cover shadow-inner transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                    </div>
                </div>

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

            {/* CUADRO ROJO DE ERRORES */}
            {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
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
                            <button 
                                type="button" 
                                onClick={() => setShowResetModal(true)}
                                className="text-xs font-semibold text-[#e35212] hover:underline"
                            >
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
                Al continuar, aceptas los{' '}
                <button 
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="underline cursor-pointer text-gray-600 hover:text-[#e35212] transition-colors font-bold focus:outline-none"
                >
                    Términos y Condiciones
                </button>
                {' '} y el {' '}
                <button 
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="underline cursor-pointer text-gray-600 hover:text-[#e35212] transition-colors font-bold focus:outline-none"
                >
                    Aviso de Privacidad
                </button>
                {' '}de Club Pilotos Carreto.
            </p>

            <TermsModal 
                isOpen={showTerms} 
                onClose={() => setShowTerms(false)} 
            />
            
            <PrivacyModal 
                isOpen={showPrivacy} 
                onClose={() => setShowPrivacy(false)} 
            />

            {/* ============================================================== */}
            {/* VENTANA EMERGENTE (MODAL) DE RECUPERAR CONTRASEÑA */}
            {/* ============================================================== */}
            {showResetModal && (
                <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in touch-none">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm p-7 shadow-2xl relative overflow-hidden flex flex-col">
                        
                        {/* Botón Cerrar */}
                        <button 
                            onClick={() => { setShowResetModal(false); setResetMessage(null); setResetInput(''); }}
                            className="absolute top-4 right-4 p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        {/* Icono Cabecera */}
                        <div className="w-16 h-16 bg-orange-50 text-[#e35212] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </div>

                        <h3 className="text-xl font-black text-gray-900 text-center mb-2 tracking-tight">Recuperar Contraseña</h3>
                        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                            Ingresa tu <span className="font-bold text-gray-700">correo</span> o <span className="font-bold text-gray-700">celular registrado</span> y te enviaremos un enlace seguro.
                        </p>

                        {/* Mensaje de Error/Éxito */}
                        {resetMessage && (
                            <div className={`mb-5 p-3.5 rounded-xl text-xs font-bold flex gap-3 items-center ${resetMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                <span className="text-xl leading-none shrink-0">{resetMessage.type === 'success' ? '✅' : '⚠️'}</span>
                                <p className="leading-tight">{resetMessage.text}</p>
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <InputIconWrapper icon={<UserIcon className="w-5 h-5"/>}>
                                <input 
                                    type="text" 
                                    placeholder="Correo o Celular" 
                                    value={resetInput} 
                                    onChange={e => setResetInput(e.target.value)} 
                                    className={inputClasses}
                                />
                            </InputIconWrapper>

                            <button 
                                type="submit" 
                                disabled={isResetting}
                                className="w-full bg-gradient-to-r from-[#e35212] to-[#ff7b42] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
                            >
                                {isResetting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Enviando...
                                    </>
                                ) : 'Enviar enlace seguro'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AuthScreen;