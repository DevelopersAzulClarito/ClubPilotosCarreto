import React from 'react';
import { StarIcon } from '../icons/StarIcon';

export const IllustrationLevels: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#e35212', stopOpacity: 1 }} />
            </linearGradient>
        </defs>

        {/* Person silhouette */}
        <circle cx="50" cy="40" r="15" fill="#9CA3AF" />
        <path d="M 30 90 C 30 60, 70 60, 70 90 Z" fill="#9CA3AF" />

        {/* Level Badges around person */}
        <g transform="translate(15, 25)">
            <circle cx="0" cy="0" r="10" fill="url(#gradOrange)" />
            <text x="0" y="3.5" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">1</text>
        </g>
        
        <g transform="translate(85, 45)">
            <circle cx="0" cy="0" r="10" fill="url(#gradOrange)" />
            <text x="0" y="3.5" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">5</text>
        </g>

        <g transform="translate(20, 70)">
            <circle cx="0" cy="0" r="10" fill="url(#gradOrange)" />
            <text x="0" y="3.5" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">10</text>
        </g>

        {/* Main large badge for "Legend" */}
        <g transform="translate(70, 80) scale(1.5)">
             <path d="M-5 0 L0 -10 L5 0 L10 5 L0 2 L-10 5 Z" fill="#e35212"/>
             <circle cx="0" cy="0" r="8" fill="#9CA3AF" />
             <g transform="translate(0,0) scale(0.3)">
                <StarIcon fill="#e35212" />
             </g>
        </g>
    </svg>
);