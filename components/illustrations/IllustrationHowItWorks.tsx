import React from 'react';

export const IllustrationHowItWorks: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#e35212', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Phone */}
        <rect x="30" y="20" width="40" height="70" rx="5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="35" y="25" width="30" height="50" fill="#f8fafc" />

        {/* QR Code on phone screen */}
        <rect x="40" y="30" width="20" height="20" fill="white" />
        <rect x="42" y="32" width="5" height="5" fill="black" />
        <rect x="53" y="32" width="5" height="5" fill="black" />
        <rect x="42" y="43" width="5" height="5" fill="black" />
        <rect x="48" y="38" width="4" height="4" fill="black" />
        <rect x="54" y="44" width="2" height="2" fill="black" />
        <rect x="43" y="38" width="2" height="2" fill="black" />

        {/* XP Coin */}
        <circle cx="75" cy="40" r="15" fill="url(#gradOrange)" />
        <text x="75" y="45" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">XP</text>

        {/* Arrow */}
        <path d="M 60 65 Q 70 60 80 55" stroke="#e35212" strokeWidth="2" fill="none" strokeDasharray="3,3" />
        <path d="M 77 50 L 80 55 L 75 56 Z" fill="#e35212" />
    </svg>
);