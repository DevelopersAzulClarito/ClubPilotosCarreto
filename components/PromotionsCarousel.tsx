import React from 'react';
import { Promotion } from '../types';

interface PromotionsCarouselProps {
    promotions: Promotion[];
}

const PromotionsCarousel = React.memo<PromotionsCarouselProps>(({ promotions }) => {
    const isSingle = promotions.length === 1;

    return (
        <div className={`flex pb-6 ${
            isSingle
                ? 'justify-center w-full'
                : 'overflow-x-auto space-x-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory'
        }`}>
            {promotions.map(promo => (
                <div
                    key={promo.id}
                    className={`flex-shrink-0 w-[85vw] max-w-[320px] h-48 rounded-2xl overflow-hidden relative shadow-md bg-gray-100 dark:bg-gray-800 transition-transform duration-200 ease-out active:scale-[0.98] ${
                        !isSingle ? 'snap-center' : ''
                    }`}
                >
                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                        Oferta
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                        <h4 className="text-white font-extrabold text-lg mb-1 line-clamp-1 leading-tight drop-shadow-md">
                            {promo.title}
                        </h4>

                        {promo.description && (
                            <p className="text-gray-200 text-sm line-clamp-2 leading-snug opacity-95">
                                {promo.description}
                            </p>
                        )}

                        {promo.validUntil && (
                            <div className="mt-2.5 flex items-center text-emerald-400 text-[11px] font-bold tracking-wide">
                                <svg className="w-3.5 h-3.5 mr-1.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Válido hasta {promo.validUntil}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default PromotionsCarousel;
