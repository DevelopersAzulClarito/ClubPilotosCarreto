
import React, { useState, useCallback } from 'react';
// FIX: Import `CheckinResult` type to resolve the 'Cannot find name' error.
import { PlayerProfile, AppState, ActiveTab, CheckinResult } from './types';
import { performCheckin } from './services/geminiService';
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
import { XP_PER_LEVEL } from './constants';

const App: React.FC = () => {
    const [player, setPlayer] = useState<PlayerProfile | null>(null);

    const [appState, setAppState] = useState<AppState>(AppState.INTRO);
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckin = useCallback(async () => {
        if (!player) return;
        setAppState(AppState.CHECKING_IN);
        setError(null);
        try {
            const result = await performCheckin(player.level);
            setCheckinResult(result);

            setPlayer(prevPlayer => {
                if (!prevPlayer) return null;
                
                let currentXp = prevPlayer.xp + result.xpGained;
                let currentLevel = prevPlayer.level;

                while (currentXp >= XP_PER_LEVEL) {
                    currentXp -= XP_PER_LEVEL;
                    currentLevel += 1;
                }

                return {
                    ...prevPlayer,
                    level: currentLevel,
                    xp: currentXp,
                };
            });

            if (result.isWinner) {
                setAppState(AppState.WINNER);
            } else {
                setAppState(AppState.STANDARD);
            }
        } catch (e) {
            setError('Error al conectar con el servidor. Inténtalo de nuevo.');
            setAppState(AppState.DASHBOARD);
            console.error(e);
        }
    }, [player]);

    const resetFlow = () => {
        setCheckinResult(null);
        setAppState(AppState.DASHBOARD);
        setActiveTab('home');
    };

    const handleLogin = (phone: string) => {
        setPlayer({
            name: 'Piloto Pro',
            level: 5,
            xp: 50,
            avatarUrl: `https://i.pravatar.cc/150?u=${phone}`,
            customerId: Math.floor(1000000 + Math.random() * 9000000).toString(),
            phone: phone,
        });
        setAppState(AppState.DASHBOARD);
    };

    const handleRegister = (userInfo: { name: string; phone: string; email: string; age: string }) => {
        setPlayer({
            name: userInfo.name,
            level: 1,
            xp: 0,
            avatarUrl: `https://i.pravatar.cc/150?u=${userInfo.phone}`,
            customerId: Math.floor(1000000 + Math.random() * 9000000).toString(),
            phone: userInfo.phone,
        });
        setAppState(AppState.PROFILING);
    };
    
    const handleProfilingComplete = () => {
        setAppState(AppState.DASHBOARD);
    };

    const handleLogout = () => {
        setPlayer(null);
        setAppState(AppState.AUTH);
        setActiveTab('home');
    }

    const handleAvatarChange = (newAvatarUrl: string) => {
        setPlayer(prev => prev ? { ...prev, avatarUrl: newAvatarUrl } : null);
    };

    const renderMainContent = () => {
        if (!player) return null;
        switch (activeTab) {
            case 'home':
                return <Dashboard player={player} setActiveTab={setActiveTab} error={error} />;
            case 'store':
                return <StoreScreen />;
            case 'qr':
                return <QRScreen player={player} setActiveTab={setActiveTab} onCheckin={handleCheckin} />;
            case 'prizes':
                return <PrizesScreen />;
            case 'profile':
                return <ProfileScreen player={player} onLogout={handleLogout} onAvatarChange={handleAvatarChange} />;
            default:
                return <Dashboard player={player} setActiveTab={setActiveTab} error={error} />;
        }
    };

    const renderContent = () => {
        switch (appState) {
            case AppState.INTRO:
                return <IntroCarousel onComplete={() => setAppState(AppState.AUTH)} />;
            case AppState.AUTH:
                return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
            case AppState.PROFILING:
                return <ProfilingScreen onComplete={handleProfilingComplete} />;
            case AppState.CHECKING_IN:
                return <CheckinScreen />;
            case AppState.WINNER:
                return checkinResult && <WinnerScreen result={checkinResult} onDone={resetFlow} />;
            case AppState.STANDARD:
                return checkinResult && <StandardScreen result={checkinResult} onDone={resetFlow} />;
            case AppState.DASHBOARD:
            default:
                return (
                    <div className="flex flex-col flex-grow w-full">
                        <main className="flex-grow pb-20">
                            {renderMainContent()}
                        </main>
                        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                );
        }
    };
    
    const showHeader = appState === AppState.DASHBOARD && activeTab !== 'qr';

    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-[#e35212] selection:text-white">
            <div className="w-full max-w-sm mx-auto flex flex-col flex-grow">
                {showHeader && (
                     <header className="p-6 flex items-center gap-4">
                        <GasPumpIcon className="w-10 h-10 text-[#e35212]"/>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Club Pilotos Carreto</h1>
                            <p className="text-sm text-gray-500">Tu lealtad tiene premio</p>
                        </div>
                    </header>
                )}
                <div className="flex-grow flex flex-col">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default App;