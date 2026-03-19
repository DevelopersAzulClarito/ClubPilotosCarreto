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
    
    // Estado de Carga
    const [isLoading, setIsLoading] = useState(false);

    // --- ESTADOS PARA LAS VENTANAS EMERGENTES (MODALES) ---
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

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

            {/* --- ENLACES MODIFICADOS A BOTONES EMERGENTES --- */}
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

            {/* ============================================================== */}
            {/* VENTANA EMERGENTE (MODAL) DE TÉRMINOS Y CONDICIONES (PRODUCCIÓN) */}
            {/* ============================================================== */}
            {showTerms && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in touch-none">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Términos y Condiciones</h3>
                            <button 
                                onClick={() => setShowTerms(false)}
                                className="p-2 text-gray-400 bg-white border border-gray-200 rounded-full hover:bg-gray-100 active:scale-90 transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-sm text-gray-600 pb-8 overscroll-contain">
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Última actualización: Marzo 2026</p>
                            
                            <p className="leading-relaxed">
                                Bienvenido a <strong>Club Pilotos Carreto</strong> (en adelante, el "Programa" o la "Aplicación"), operado por Carreto Gas (en adelante, "El Operador"). Al descargar, registrarse o acceder a la Aplicación, usted (el "Usuario") acepta estar sujeto íntegramente a los siguientes Términos y Condiciones.
                            </p>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">1. Naturaleza del Programa</h4>
                                <p className="leading-relaxed">Club Pilotos Carreto es un programa de lealtad digital y gratuito diseñado para recompensar la preferencia de nuestros clientes. A través de la Aplicación, el Usuario acumula "Puntos" por sus consumos en estaciones participantes, los cuales determinan su "Nivel" y pueden ser canjeados por beneficios específicos.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">2. Requisitos de Elegibilidad y Cuentas</h4>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-[#e35212] leading-relaxed">
                                    <li>El Usuario declara tener al menos 18 años de edad y capacidad legal para obligarse bajo estos Términos.</li>
                                    <li>La cuenta es estrictamente <strong>personal e intransferible</strong>. Queda prohibida la venta, traspaso, cesión o consolidación de cuentas entre distintos Usuarios.</li>
                                    <li>El Usuario es responsable de mantener la confidencialidad de sus credenciales. El Operador no se hace responsable por canjes no autorizados derivados del descuido de la cuenta.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">3. Reglas de Acumulación y Valor de los Puntos</h4>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-[#e35212] leading-relaxed">
                                    <li>Para acumular Puntos, el Usuario <strong>debe</strong> presentar su Pase Digital (Código QR) al despachador <strong>antes o durante</strong> el proceso de carga. Por políticas del sistema, <strong>no se realizarán abonos de puntos retroactivos</strong> una vez finalizada y facturada la venta.</li>
                                    <li><strong>Los Puntos no son moneda de curso legal</strong>, no constituyen derechos de propiedad, no generan intereses y <strong>no pueden ser canjeados por dinero en efectivo</strong> ni ser utilizados para pago de deudas.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">4. Canje y Disponibilidad de Recompensas</h4>
                                <p className="leading-relaxed">Todas las recompensas mostradas en el catálogo o en los beneficios por Nivel están sujetas a <strong>disponibilidad de inventario</strong> en la estación física al momento de solicitar el canje. El Operador se reserva el derecho de sustituir recompensas por otras de valor similar o modificar el costo en Puntos en cualquier momento sin previo aviso.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">5. Vigencia y Cancelación de Puntos</h4>
                                <p className="leading-relaxed">Los Puntos acumulados tendrán una vigencia de <strong>12 (doce) meses</strong> contados a partir de su fecha de emisión. Adicionalmente, si la cuenta permanece inactiva (sin acumular ni redimir) por un periodo de 6 meses consecutivos, El Operador podrá cancelar la totalidad de los Puntos de dicha cuenta.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">6. Suspensión de Cuentas y Fraude</h4>
                                <p className="leading-relaxed">El Operador se reserva el derecho absoluto de <strong>suspender, desactivar o cancelar definitivamente</strong> la cuenta de un Usuario, así como invalidar todos sus Puntos y beneficios, si se detecta fraude, alteración del código QR, colusión con personal de la estación, o cualquier violación a los presentes Términos.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">7. Modificaciones y Terminación del Programa</h4>
                                <p className="leading-relaxed">El Operador puede modificar estos Términos, el esquema de Puntos, o dar por terminado el Programa "Club Pilotos Carreto" en su totalidad en cualquier momento. En caso de terminación, se notificará a los Usuarios mediante la Aplicación otorgando un plazo no menor a 30 días naturales para el canje de los Puntos vigentes; agotado dicho plazo, los Puntos perderán todo valor.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">8. Fallas Técnicas</h4>
                                <p className="leading-relaxed">El Operador no garantiza que la Aplicación funcione libre de errores, interrupciones o virus. El Operador no será responsable de la imposibilidad de acumular o canjear Puntos debido a fallas en el sistema, conectividad de red o mantenimiento de la Aplicación.</p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0">
                            <button 
                                onClick={() => setShowTerms(false)}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
                            >
                                He leído y acepto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* VENTANA EMERGENTE (MODAL) DE AVISO DE PRIVACIDAD (PRODUCCIÓN) */}
            {/* ============================================================== */}
            {showPrivacy && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in touch-none">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Aviso de Privacidad Integral</h3>
                            <button 
                                onClick={() => setShowPrivacy(false)}
                                className="p-2 text-gray-400 bg-white border border-gray-200 rounded-full hover:bg-gray-100 active:scale-90 transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-sm text-gray-600 pb-8 overscroll-contain">
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">En cumplimiento con la LFPDPPP</p>
                            
                            <p className="leading-relaxed">
                                <strong>Carreto Gas</strong> (en lo sucesivo "El Responsable"), es el responsable del uso, tratamiento y protección de sus datos personales, y al respecto le informamos lo siguiente en estricto apego a la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, su Reglamento y los Lineamientos del Aviso de Privacidad.
                            </p>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">1. Datos Personales que Recabamos</h4>
                                <p className="leading-relaxed">Para llevar a cabo las finalidades descritas en el presente aviso, recabaremos los siguientes datos personales de identificación y contacto:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-[#136A40] font-medium">
                                    <li>Nombre completo.</li>
                                    <li>Número de teléfono celular.</li>
                                    <li>Dirección de correo electrónico.</li>
                                    <li>Edad o rango de edad.</li>
                                </ul>
                                <p className="text-xs text-gray-500 mt-2"><em>* El Responsable no recaba datos personales considerados como sensibles según la Ley.</em></p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">2. Finalidades del Tratamiento de Datos</h4>
                                <p className="leading-relaxed">Sus datos personales serán utilizados para las siguientes <strong>Finalidades Primarias</strong> (necesarias para el servicio):</p>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-[#136A40] leading-relaxed">
                                    <li>Creación, gestión, administración y actualización de su cuenta en el programa "Club Pilotos Carreto".</li>
                                    <li>Asignación, registro y validación de Puntos acumulados y Niveles alcanzados.</li>
                                    <li>Verificación de identidad al momento de realizar el canje de recompensas o atención a quejas.</li>
                                </ul>
                                <p className="leading-relaxed mt-2">De manera adicional, utilizaremos su información para las siguientes <strong>Finalidades Secundarias</strong> (no necesarias para el servicio, pero nos permiten brindarle una mejor atención):</p>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-[#136A40] leading-relaxed">
                                    <li>Envío de promociones exclusivas, publicidad, y boletines informativos.</li>
                                    <li>Análisis de comportamiento de consumo y perfilamiento para mejorar nuestras ofertas.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">3. Transferencia de Datos Personales</h4>
                                <p className="leading-relaxed">
                                    Le informamos que sus datos personales <strong>no serán vendidos, alquilados ni transferidos a terceros</strong> para fines de comercialización. Únicamente podrán ser compartidos con proveedores de servicios tecnológicos (como servicios de alojamiento en la nube, ej. Google/Firebase) estrictamente para mantener el funcionamiento de la Aplicación, quienes están obligados a mantener la confidencialidad de los datos.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">4. Ejercicio de los Derechos ARCO</h4>
                                <p className="leading-relaxed">
                                    Usted tiene derecho a conocer qué datos tenemos (<strong>A</strong>cceso), solicitar la corrección de su información si está desactualizada, es inexacta o incompleta (<strong>R</strong>ectificación), que la eliminemos de nuestros registros (<strong>C</strong>ancelación), así como oponerse al uso de sus datos para fines específicos (<strong>O</strong>posición).
                                </p>
                                <p className="leading-relaxed">
                                    Para el ejercicio de cualquiera de los derechos ARCO, o para revocar su consentimiento para el tratamiento de sus datos, usted deberá presentar la solicitud respectiva acudiendo físicamente a la administración de nuestra estación de servicio Carreto Gas, presentando una identificación oficial vigente.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-black text-gray-900 text-sm">5. Cambios al Aviso de Privacidad</h4>
                                <p className="leading-relaxed">
                                    El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias necesidades por los servicios que ofrecemos; de nuestras prácticas de privacidad o por otras causas. Nos comprometemos a mantenerlo informado sobre dichos cambios publicando la versión actualizada en esta misma sección dentro de la Aplicación.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0">
                            <button 
                                onClick={() => setShowPrivacy(false)}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
                            >
                                He leído y comprendo
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AuthScreen;  