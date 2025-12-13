
import React from 'react';

interface XPBarProps {
    currentXp: number;
    maxXp: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXp, maxXp }) => {
    const percentage = maxXp > 0 ? (currentXp / maxXp) * 100 : 0;

    return (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-gray-300">
            <div
                className="bg-[#e35212] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default XPBar;