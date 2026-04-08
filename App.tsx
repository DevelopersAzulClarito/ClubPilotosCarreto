import React, { useState, useEffect } from 'react';
import { PlayerProfile, AppState, ActiveTab } from './types';
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
import { GasPumpIcon } from './components/icons/GasPumpIcon';

// --- NUEVO: IMPORTAMOS EL GANCHO DE NOTIFICACIONES PUSH ---
import { usePushNotifications } from './components/usePushNotifications';


const App: React.FC = () => {
    const [player, setPlayer] = useState<PlayerProfile | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.INTRO);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    
    // --- NUEVO ESTADO: Pantalla de Carga Inicial ---
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    // --- NUEVO: ACTIVAMOS LAS NOTIFICACIONES PUSH PARA ESTE USUARIO ---
    // Si el jugador está logueado, le pasamos su ID para guardar su Token en la BD
    usePushNotifications(player?.id || player?.customerId);

    // --- EFECTO 1: VERIFICAR SESIÓN ACTIVA AL ABRIR LA APP ---
    useEffect(() => {
        const auth = getAuth();
        
        // onAuthStateChanged detecta automáticamente si hay una sesión guardada en el celular
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                try {
                    // Si hay sesión en el dispositivo, buscamos sus datos completos en la BD
                    const q = query(collection(db, 'customers'), where('email', '==', firebaseUser.email));
                    const snapshot = await getDocs(q);
                    
                    if (!snapshot.empty) {
                        const userData = snapshot.docs[0].data() as PlayerProfile;
                        userData.id = snapshot.docs[0].id;
                        
                        // Guardamos al jugador y lo mandamos DIRECTO al Dashboard
                        setPlayer(userData);
                        setAppState(AppState.DASHBOARD);
                    } else {
                        // Falla de seguridad o cuenta borrada
                        setAppState(AppState.INTRO);
                    }
                } catch (error) {
                    console.error("Error al recuperar la sesión:", error);
                    setAppState(AppState.INTRO);
                }
            } else {
                // Si no hay sesión guardada, forzamos a que inicie sesión o vea la intro
                setAppState(prev => prev !== AppState.AUTH ? AppState.INTRO : AppState.AUTH);
            }
            
            // Ocultamos la pantalla de carga elegante
            setIsCheckingSession(false);
        });

        // Limpieza del listener cuando la app se cierra
        return () => unsubscribe();
    }, []);

    // --- EFECTO 2: Sincronización en vivo de puntos y niveles ---
    useEffect(() => {
        if (player?.email) {
            const unsub = subscribeToUser(player.email, (updatedUser) => {
                setPlayer(updatedUser);
            });
            return () => { if(unsub) { /* void */ } };
        }
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
        } catch (e: any) {
            console.error(e);
            let msg = e.message;
            if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
                msg = "Credenciales incorrectas.";
            }
            alert("Error: " + msg);
        }
    };

    // --- REGISTRO ---
    const handleRegister = async (info: any) => {
        try {
            const user = await registerWithEmail(info);
            setPlayer(user);
            setAppState(AppState.PROFILING);
        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/email-already-in-use') {
                alert("El correo ya está registrado.");
            } else {
                alert("Error: " + e.message);
            }
        }
    };

    // --- LOGOUT ---
    const handleLogout = async () => {
        await logoutFirebase(); // Esto borra la sesión del dispositivo
        setPlayer(null);
        setAppState(AppState.AUTH); // Mandamos directo a la pantalla de Auth, no a la Intro
        setActiveTab('home');
    };

    // --- REFRESCAR JUGADOR MANUALMENTE ---
    const handlePlayerUpdate = () => {
        console.log("El jugador ha subido de nivel o se actualizó.");
    };

    // --- RENDERIZADO DE PANTALLA DE CARGA ELEGANTE (SPLASH SCREEN) ---
    if (isCheckingSession) {
        return (
            <div className="min-h-screen bg-white flex justify-center">
                <div className="w-full max-w-sm bg-[#F4F5F7] min-h-screen shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Efectos de iluminación de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>

                    {/* Logo animado */}
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(227,82,18,0.15)] mb-8 animate-bounce relative z-10">
                        <GasPumpIcon className="w-20 h-20 text-[#e35212]" />
                    </div>
                    
                    <h1 className="font-black text-gray-900 text-3xl tracking-[0.15em] uppercase mb-4 relative z-10">Club Pilotos</h1>
                    
                    {/* Indicador de carga premium */}
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
                <div className="flex flex-col flex-grow pb-20">
                    {activeTab === 'home' && <Dashboard player={player!} setActiveTab={setActiveTab} error={null} />}
                    {activeTab === 'store' && <StoreScreen />}
                    {activeTab === 'qr' && <QRScreen player={player!} setActiveTab={setActiveTab} />}
                    {activeTab === 'levels' && <LevelsScreen player={player!} onPlayerUpdate={handlePlayerUpdate} />}
                    {activeTab === 'profile' && <ProfileScreen player={player!} onLogout={handleLogout} onAvatarChange={() => {}} />}
                    
                    <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="w-full max-w-sm bg-white min-h-screen shadow-2xl relative flex flex-col">
                 {appState === AppState.DASHBOARD && activeTab !== 'qr' && (
                    <header className="px-6 py-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-50 flex-shrink-0 w-full">
                        <GasPumpIcon className="w-8 h-8 text-[#e35212] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">Club Pilotos</h1>
                            <p className="text-xs text-gray-500 truncate">Carreto Gas</p>
                        </div>
                    </header>
                 )}
                 {renderContent()}
            </div>
        </div>
    );
};

export default App;