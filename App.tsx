import React, { useState, useEffect } from 'react';
import { PlayerProfile, AppState, ActiveTab, type RegisterInfo } from './types';
import { 
    loginWithIdentifier, 
    registerWithEmail, 
    logoutFirebase, 
    subscribeToUser 
} from './services/userService';

// --- NUEVAS IMPORTACIONES PARA LA SESIÓN PERSISTENTE ---
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './components/firebaseTemp'; // Asegúrate de que esta ruta apunte a tu config de Firebase

// Componentes Visuales
import Dashboard from './components/Dashboard';
import IntroCarousel from './components/IntroCarousel';
import AuthScreen from './components/AuthScreen';
import ProfilingScreen from './components/ProfilingScreen';
import BottomNav from './components/BottomNav';
import QRScreen from './components/screens/QRScreen';
import StoreScreen from './components/screens/StoreScreen';
import LevelsScreen from './components/screens/LevelsScreen'; 
import ProfileScreen from './components/screens/ProfileScreen';

// 👇 NUEVO: Importamos el gancho de notificaciones Push (En segundo plano)
import { usePushNotifications } from './components/usePushNotifications';
import TermsGuardModal from './components/TermsGuardModal';


const App: React.FC = () => {
    const [player, setPlayer] = useState<PlayerProfile | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.INTRO);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    
    // --- ESTADO: Pantalla de Carga Inicial ---
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // --- ESTADO GLOBAL: CONEXIÓN A INTERNET ---
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // 👇 ACTIVAR PUSH NOTIFICATIONS AQUÍ 👇
    // Esto pedirá permisos y guardará el token en Firebase automáticamente
    usePushNotifications(player?.id || player?.customerId);

    // --- EFECTO: ESCUCHAR INTERNET GLOBALMENTE ---
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // --- EFECTO 1: VERIFICAR SESIÓN ACTIVA AL ABRIR LA APP ---
    useEffect(() => {
        const auth = getAuth();
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                try {
                    const q = query(collection(db, 'customers'), where('email', '==', firebaseUser.email));
                    const snapshot = await getDocs(q);
                    
                    if (!snapshot.empty) {
                        const userData = snapshot.docs[0].data() as PlayerProfile;
                        userData.id = snapshot.docs[0].id;
                        
                        setPlayer(userData);
                        setAppState(AppState.DASHBOARD);
                    } else {
                        setAppState(AppState.INTRO);
                    }
                } catch (error) {
                    console.error("Error al recuperar la sesión:", error);
                    setAppState(AppState.INTRO);
                }
            } else {
                setAppState(prev => prev !== AppState.AUTH ? AppState.INTRO : AppState.AUTH);
            }
            
            setIsCheckingSession(false);
        });

        return () => unsubscribe();
    }, []);

    // --- EFECTO 2: Sincronización en vivo de puntos y niveles ---
    useEffect(() => {
        if (!player?.email) return;
        const unsub = subscribeToUser(player.email, (updatedUser) => {
            setPlayer(updatedUser);
        });
        return () => { if (unsub) unsub(); };
    }, [player?.email]);

    // --- EFECTO 3: Resetear el scroll al cambiar de pestaña ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab, appState]);

    // --- LOGIN ---
    const handleLogin = async (identifier: string, pass: string) => {
        try {
            const user = await loginWithIdentifier(identifier, pass);
            setPlayer(user);
            setAppState(AppState.DASHBOARD);
        } catch (e: unknown) {
            console.error(e);
            const err = e as { message?: string; code?: string };
            let msg = err.message ?? "Error al iniciar sesión.";
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                msg = "Credenciales incorrectas.";
            }
            throw new Error(msg);
        }
    };

    // --- REGISTRO ---
    const handleRegister = async (info: RegisterInfo) => {
        try {
            const user = await registerWithEmail(info);
            setPlayer(user);
            setAppState(AppState.PROFILING);
        } catch (e: unknown) {
            console.error(e);
            const err = e as { message?: string; code?: string };
            let msg = err.message ?? "Error al registrarse.";
            if (err.code === 'auth/email-already-in-use') {
                msg = "El correo ya está registrado.";
            }
            throw new Error(msg);
        }
    };

    // --- LOGOUT ---
    const handleLogout = async () => {
        await logoutFirebase(); 
        setPlayer(null);
        setAppState(AppState.AUTH); 
        setActiveTab('home');
    };

    // --- REFRESCAR JUGADOR MANUALMENTE ---
    const handlePlayerUpdate = () => {
    };

    // --- RENDERIZADO DE PANTALLA DE CARGA ELEGANTE (SPLASH SCREEN) ---
    if (isCheckingSession) {
        return (
            // Agregamos select-none para prevenir selecciones de texto como si fuera una web
            <div className="min-h-[100dvh] bg-[#F4F5F7] flex justify-center select-none touch-manipulation">
                <div className="w-full max-w-sm bg-[#F4F5F7] min-h-[100dvh] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(227,82,18,0.15)] mb-8 animate-bounce relative z-10 border border-gray-100">
                        <img 
                            src="/icons/icon-512.webp" 
                            alt="Logo Carreto" 
                            className="w-20 h-20 rounded-2xl object-cover pointer-events-none" 
                        />
                    </div>
                    
                    <h1 className="font-black text-gray-900 text-3xl tracking-[0.15em] uppercase mb-4 relative z-10">Club Pilotos</h1>
                    
                    <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3.5 rounded-full border border-gray-200 shadow-sm relative z-10">
                        <div className="w-5 h-5 border-[3px] border-[#e35212] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-700 font-extrabold text-sm tracking-widest uppercase">Iniciando motor...</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- ROUTING VISUAL ESTÁNDAR ---
    const renderContent = () => {
        switch (appState) {
            case AppState.INTRO: return <IntroCarousel onComplete={() => setAppState(AppState.AUTH)} />;
            case AppState.AUTH: return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
            case AppState.PROFILING: return <ProfilingScreen onComplete={() => setAppState(AppState.DASHBOARD)} />;
            
            default: return (
                <>
                    {/* Terms Guard: bloquea el dashboard hasta que el usuario acepte */}
                    {player && !player.hasAcceptedTerms && (
                        <TermsGuardModal player={player} onDecline={handleLogout} />
                    )}
                    <div className="flex flex-col flex-grow pb-20 relative z-0">
                        {activeTab === 'home' && <Dashboard player={player!} setActiveTab={setActiveTab} error={null} />}
                        {activeTab === 'store' && <StoreScreen />}
                        {activeTab === 'qr' && <QRScreen player={player!} setActiveTab={setActiveTab} />}
                        {activeTab === 'prizes' && <LevelsScreen player={player!} onPlayerUpdate={handlePlayerUpdate} />}
                        {activeTab === 'profile' && <ProfileScreen player={player!} onLogout={handleLogout} onAvatarChange={() => {}} />}

                        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </>
            );
        }
    };

    return (
        // Utilizamos 100dvh para alturas móviles dinámicas y select-none para un "feel" nativo
        <div className="min-h-[100dvh] bg-gray-100 flex justify-center select-none touch-manipulation overflow-hidden">
            <div className="w-full max-w-md bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden">
                 
                 {/* CONTENEDOR STICKY PARA BANNER Y CABECERA */}
                 <div className="sticky top-0 z-50 w-full flex-shrink-0 flex flex-col bg-white/90 backdrop-blur-md">
                     
                     {/* BANNER GLOBAL DE MODO SIN CONEXIÓN (Respeta el Safe Area de la cámara) */}
                     {isOffline && (
                        <div className="bg-red-500/95 backdrop-blur-md w-full px-4 pt-[max(env(safe-area-inset-top),10px)] pb-2.5 flex items-center justify-center gap-2 text-white shadow-md transition-all">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M8.536 8.536a8.966 8.966 0 014.94-1.536c2.486 0 4.736.996 6.364 2.614M11.5 11.5a4.486 4.486 0 013.432 1.396M12 16.5c.21 0 .41-.03.606-.085" />
                            </svg>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">Sin conexión a Internet</p>
                        </div>
                     )}

                     {/* CABECERA (HEADER) MEJORADA */}
                     {appState === AppState.DASHBOARD && activeTab !== 'qr' && (
                        // El padding superior se ajusta si el banner de offline no está
                        <header className={`px-5 pb-4 flex items-center gap-3.5 border-b border-gray-100 w-full transition-all ${
                            !isOffline ? 'pt-[max(env(safe-area-inset-top),1.25rem)]' : 'pt-4'
                        }`}>
                            
                            {/* Contenedor del Logo con resplandor naranja */}
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-30 pointer-events-none"></div>
                                <img 
                                    src="/icons/icon-72.webp" 
                                    alt="Logo Carreto" 
                                    className="relative w-11 h-11 rounded-xl shadow-sm object-cover border border-gray-200/50 bg-white pointer-events-none" 
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="font-black text-gray-900 text-lg leading-tight tracking-tight truncate">Club Pilotos</h1>
                                <p className="text-[10px] font-bold text-[#136A40] uppercase tracking-[0.15em] truncate mt-0.5">Carreto Gas</p>
                            </div>
                        </header>
                     )}
                 </div>

                 {/* Contenedor escrolleable independiente */}
                 <div className="flex-grow overflow-y-auto overflow-x-hidden">
                     {renderContent()}
                 </div>
            </div>
        </div>
    );
};

export default App;