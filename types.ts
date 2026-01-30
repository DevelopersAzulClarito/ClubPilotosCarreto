export type ActiveTab = 'home' | 'store' | 'qr' | 'prizes' | 'profile';

export enum AppState {
    INTRO = 'intro',
    AUTH = 'auth',
    PROFILING = 'profiling',
    DASHBOARD = 'dashboard',
    CHECKING_IN = 'checking_in',
    WINNER = 'winner',
    STANDARD = 'standard'
}

export interface PlayerProfile {
    id?: string;
    customerId: string;
    name: string;
    phone: string;
    email: string;
    age?: string;
    level: number;
    xp: number; // La app usa 'xp', aunque la BD tenga 'points'
    avatarUrl: string;
    authUid?: string;
}

export interface CheckinResult {
    isWinner: boolean;
    prize: string | null;
    xpGained: number;
    message: string;
}

// Interfaces adicionales para tiendas y premios
export interface Product {
    id: string | number;
    name: string;
    price: number;
    imageUrl: string;
    quantity?: number;
}