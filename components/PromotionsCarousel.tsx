import React from 'react';
import { Promotion } from '../types';

interface PromotionsCarouselProps {
    promotions: Promotion[];
}

const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ promotions }) => {
    return (
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-6 px-6 scrollbar-hide">
            {promotions.map(promo => (
                <div key={promo.id} className="flex-shrink-0 w-64 h-32 rounded-xl overflow-hidden relative shadow-lg">
                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <p className="absolute bottom-3 left-3 text-white font-bold text-sm">{promo.title}</p>
                </div>
            ))}
        </div>
    );
};

// A simple utility to hide the scrollbar if needed, add to your global CSS if you want to reuse it.
const style = document.createElement('style');
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;  
    scrollbar-width: none;
}
`;
document.head.appendChild(style);


export default PromotionsCarousel;