import React from 'react';
import { GiftIcon } from '../icons/GiftIcon';

export const IllustrationRewards: React.FC = () => (
     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#e35212', stopOpacity: 1 }} />
            </linearGradient>
             <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Gift Box */}
        <g transform="translate(25, 30) scale(2)">
             <GiftIcon stroke="url(#gradOrange)" fill="none" />
        </g>

        {/* Lightning Bolt */}
        <g transform="translate(5, 5)">
            <path d="M 40 10 L 20 45 L 35 45 L 25 75 L 60 30 L 45 30 Z" fill="url(#gradOrange)" filter="url(#glow)" />
        </g>

        <g transform="translate(55, 45)">
            <path d="M 40 10 L 20 45 L 35 45 L 25 75 L 60 30 L 45 30 Z" fill="url(#gradOrange)" opacity="0.5" transform="scale(0.5)" />
        </g>
    </svg>
);