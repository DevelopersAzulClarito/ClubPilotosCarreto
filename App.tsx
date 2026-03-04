import React, { useState, useEffect } from 'react';
import { PlayerProfile, AppState, ActiveTab } from './types';
import { 
    loginWithIdentifier, 
    registerWithEmail, 
    logoutFirebase, 
    subscribeToUser 
} from './services/userService';

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

const App: React.FC = () => {
    const [player, setPlayer] = useState<PlayerProfile | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.INTRO);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');

    // --- EFECTO: Sincronización en vivo de puntos y niveles ---
    useEffect(() => {
        if (player?.email) {
            // Nos suscribimos a los cambios del usuario (ej. cuando sube de nivel manualmente o gana puntos)
            const unsub = subscribeToUser(player.email, (updatedUser) => {
                setPlayer(updatedUser);
            });
            // Cleanup al desmontar o salir
            return () => { if(unsub) { /* nada que hacer, es void */ } };
        }
    }, [player?.email]);

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
        await logoutFirebase();
        setPlayer(null);
        setAppState(AppState.AUTH);
        setActiveTab('home');
    };

    // --- REFRESCAR JUGADOR MANUALMENTE (Por si falla la suscripción en vivo) ---
    // Esta función se le pasará a LevelsScreen para forzar la UI a refrescar cuando suba de nivel
    const handlePlayerUpdate = () => {
        // Al estar suscritos (useEffect), Firebase debería disparar el setPlayer automáticamente,
        // pero esta función sirve como hook por si necesitas hacer algo extra al subir de nivel (ej. confeti).
        console.log("El jugador ha subido de nivel o se actualizó.");
    };

    // --- ROUTING VISUAL ---
    const renderContent = () => {
        switch (appState) {
            case AppState.INTRO: return <IntroCarousel onComplete={() => setAppState(AppState.AUTH)} />;
            case AppState.AUTH: return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
            case AppState.PROFILING: return <ProfilingScreen onComplete={() => setAppState(AppState.DASHBOARD)} />;
            
            // Eliminados los states de CHECKING_IN, WINNER y STANDARD
            
            default: return (
                <div className="flex flex-col flex-grow pb-20">
                    {/* IMPORTANTE: QRScreen ya no recibe onCheckin */}
                    {activeTab === 'home' && <Dashboard player={player!} setActiveTab={setActiveTab} error={null} />}
                    {activeTab === 'store' && <StoreScreen />}
                    {activeTab === 'qr' && <QRScreen player={player!} setActiveTab={setActiveTab} />}
                    
                    {/* Reemplazamos PrizesScreen por LevelsScreen */}
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
                    <header className="px-6 py-4 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <GasPumpIcon className="w-8 h-8 text-[#e35212]" />
                        <div>
                            <h1 className="font-bold text-gray-900 text-lg leading-tight">Club Pilotos</h1>
                            <p className="text-xs text-gray-500">Carreto Gas</p>
                        </div>
                    </header>
                 )}
                 {renderContent()}
            </div>
        </div>
    );
};

export default App;