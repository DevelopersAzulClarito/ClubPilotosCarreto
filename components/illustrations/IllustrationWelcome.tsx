import React from 'react';

export const IllustrationWelcome: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#e35212', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        
        {/* Road */}
        <path d="M 0 85 H 100" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Car Body */}
        <path d="M 20 80 Q 25 70 40 70 L 60 70 Q 75 70 80 80 Z" fill="url(#gradBlue)" />
        <path d="M 30 70 L 65 70 L 60 60 L 35 60 Z" fill="#93C5FD" />
        
        {/* Wheels */}
        <circle cx="30" cy="80" r="7" fill="#4B5563" />
        <circle cx="30" cy="80" r="3" fill="#E5E7EB" />
        <circle cx="70" cy="80" r="7" fill="#4B5563" />
        <circle cx="70"cy="80" r="3" fill="#E5E7EB" />

        {/* Gas Pump Icon representation */}
        <rect x="80" y="50" width="12" height="25" rx="2" fill="url(#gradOrange)" />
        <path d="M 92 60 H 98 V 65 H 92 Z" fill="#e35212" />

        {/* Star */}
        <path d="M15 20 L18 28 L26 29 L20 34 L22 42 L15 38 L8 42 L10 34 L4 29 L12 28 Z" fill="#e35212" />
    </svg>
);