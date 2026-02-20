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

export interface Product {
    id: string;
    name: string;
    price: number;
    isActive?: boolean;
    department?: string;
    barcode?: string;
    imageUrl?: string; 
    nameLowercase?: string;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    validUntil: any;
}

export interface LevelConfig {
    id: string; 
    name: string;
    minPoints: number;
    rewardDescription: string;
    color: string;
}