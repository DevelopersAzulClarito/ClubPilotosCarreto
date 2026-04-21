import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getActiveProducts } from '../../services/productService';

const StoreScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getActiveProducts();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    return (
        <div className="p-5 sm:p-6 pb-24 h-full overflow-y-auto bg-[#F4F5F7]">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catálogo</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Descubre nuestros productos en tienda</p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide shadow-sm">
                    {products.length} Items
                </div>
            </div>

            {loading ? (
                // Skeleton Loader Premium
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-3 h-56 animate-pulse flex flex-col shadow-sm border border-gray-100">
                            <div className="w-full h-32 bg-gray-100 rounded-2xl mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded-full w-1/2 mt-auto"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                // Estado vacío
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Catálogo Vacío</h3>
                    <p className="text-gray-500 text-sm font-medium">El catálogo se está actualizando.<br/>¡Vuelve pronto!</p>
                </div>
            ) : (
                // Grid de Productos Reales
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-100/80 rounded-3xl overflow-hidden shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group relative">
                            
                            {/* Imagen y Tags */}
                            <div className="relative h-40 overflow-hidden bg-gray-50/50 flex items-center justify-center p-3">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                                {/* Gradiente inferior en la imagen para contraste */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                {product.department && (
                                    <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md">
                                        {product.department}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col flex-grow justify-between bg-white z-10 relative border-t border-gray-50">
                                <div>
                                    <h3 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-2 mb-1.5 group-hover:text-emerald-700 transition-colors">
                                        {product.name}
                                    </h3>
                                    {product.barcode && (
                                        <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Cód: {product.barcode}</p>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-100/60 flex flex-col gap-1.5">
                                    {/* Mostrar puntos solo si el producto los tiene configurados (> 0) */}
                                    {(product.points ?? 0) > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Puntos</span>
                                            <span className="font-black text-amber-600 text-sm">{product.points} Pts</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Caja</span>
                                        <span className="font-black text-[#136A40] text-lg leading-none">
                                            ${(product.price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreScreen;