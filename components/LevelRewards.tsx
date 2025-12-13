import React from 'react';
import { Reward } from '../types';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CheckIcon } from './icons/CheckIcon';

interface LevelRewardsProps {
    rewards: Reward[];
    currentLevel: number;
}

const LevelRewards: React.FC<LevelRewardsProps> = ({ rewards, currentLevel }) => {
    return (
        <div className="space-y-3">
            {rewards.map(reward => {
                const isUnlocked = currentLevel >= reward.level;
                return (
                    <div key={reward.level} className={`flex items-center p-3 rounded-lg transition-all ${isUnlocked ? 'bg-green-50' : 'bg-gray-100'}`}>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isUnlocked ? 'bg-[#136A40] text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {isUnlocked ? <CheckIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className={`font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{reward.name}</p>
                            <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`}>
                                {isUnlocked ? reward.description : `Se desbloquea en Nivel ${reward.level}`}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LevelRewards;