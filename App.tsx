import React, { useState, useEffect } from 'react';
import { PlayerProfile, AppState, ActiveTab, CheckinResult } from './types';
import { XP_PER_LEVEL } from './constants'; // Crea este archivo con: export const XP_PER_LEVEL = 1000;
import { performCheckin } from './services/geminiService';
import { 
    loginWithIdentifier, 
    registerWithEmail, 
    logoutFirebase, 
    subscribeToUser, 
    updateUserStats 
} from './services/userService';

// Componentes Visuales (Asegúrate que existan en sus carpetas)
import Dashboard from './components/Dashboard';
import CheckinScreen from './components/CheckinScreen';
import WinnerScreen from './components/WinnerScreen';
import StandardScreen from './components/StandardScreen';
import IntroCarousel from './components/IntroCarousel';
import AuthScreen from './components/AuthScreen';
import ProfilingScreen from './components/ProfilingScreen';
import BottomNav from './components/BottomNav';
import QRScreen from './components/screens/QRScreen';
import StoreScreen from './components/screens/StoreScreen';
import PrizesScreen from './components/screens/PrizesScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import { GasPumpIcon } from './components/icons/GasPumpIcon';

const App: React.FC = () => {
    const [player, setPlayer] = useState<PlayerProfile | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.INTRO);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);

    // --- EFECTO: Sincronización en vivo de puntos ---
    useEffect(() => {
        if (player?.email) {
            // Si el usuario existe, nos suscribimos a sus cambios
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

    // --- CHECK-IN (JUEGO) ---
    const handleCheckin = async () => {
        if (!player) return;
        setAppState(AppState.CHECKING_IN);
        
        // 1. Preguntar a Gemini (o simulación)
        const result = await performCheckin(player.level);
        setCheckinResult(result);

        // 2. Calcular matemática local
        let newXp = player.xp + result.xpGained;
        let newLevel = player.level;
        if (newXp >= XP_PER_LEVEL) {
            newLevel++; 
            newXp -= XP_PER_LEVEL;
        }

        // 3. Guardar en BD (El useEffect actualizará la vista)
        if (player.id) {
            await updateUserStats(player.id, newXp, newLevel);
        }
        
        // 4. Mostrar Pantalla de Resultado
        setTimeout(() => {
            setAppState(result.isWinner ? AppState.WINNER : AppState.STANDARD);
        }, 2000); 
    };

    const resetFlow = () => {
        setCheckinResult(null);
        setAppState(AppState.DASHBOARD);
        setActiveTab('home');
    };

    // --- ROUTING VISUAL ---
    const renderContent = () => {
        switch (appState) {
            case AppState.INTRO: return <IntroCarousel onComplete={() => setAppState(AppState.AUTH)} />;
            case AppState.AUTH: return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
            case AppState.PROFILING: return <ProfilingScreen onComplete={() => setAppState(AppState.DASHBOARD)} />;
            case AppState.CHECKING_IN: return <CheckinScreen />;
            case AppState.WINNER: return checkinResult && <WinnerScreen result={checkinResult} onDone={resetFlow} />;
            case AppState.STANDARD: return checkinResult && <StandardScreen result={checkinResult} onDone={resetFlow} />;
            default: return (
                <div className="flex flex-col flex-grow pb-20">
                    {activeTab === 'home' && <Dashboard player={player!} setActiveTab={setActiveTab} error={null} />}
                    {activeTab === 'store' && <StoreScreen />}
                    {activeTab === 'qr' && <QRScreen player={player!} setActiveTab={setActiveTab} onCheckin={handleCheckin} />}
                    {activeTab === 'prizes' && <PrizesScreen />}
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