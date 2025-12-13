
export interface PlayerProfile {
    name: string;
    level: number;
    xp: number;
    avatarUrl: string;
    customerId: string;
    phone: string;
}

export enum AppState {
    INTRO,
    AUTH,
    PROFILING,
    DASHBOARD,
    CHECKING_IN,
    WINNER,
    STANDARD
}

export type ActiveTab = 'home' | 'store' | 'qr' | 'prizes' | 'profile';

export interface CheckinResult {
    isWinner: boolean;
    prize: string | null;
    xpGained: number;
    message: string;
}

export interface Promotion {
    id: number;
    imageUrl: string;
    title: string;
}

export interface Reward {
    level: number;
    name: string;
    description: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}
