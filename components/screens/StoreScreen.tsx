import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getActiveProducts } from '../../services/productService';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

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
        <div className="p-5 sm:p-6 pb-24 h-full overflow-y-auto bg-[#FAFAFA]">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tienda</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Canjea tus puntos o paga en caja</p>
                </div>
                <div className="bg-emerald-50 text-[#136A40] border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide">
                    {products.length} Items
                </div>
            </div>

            {loading ? (
                // Skeleton Loader Premium
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-3 h-56 animate-pulse flex flex-col shadow-sm border border-gray-100">
                            <div className="w-full h-32 bg-gray-100 rounded-xl mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded-full w-1/2 mt-auto"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                // Estado vacío
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">El catálogo se está actualizando.<br/>¡Vuelve pronto!</p>
                </div>
            ) : (
                // Grid de Productos Reales
                <div className="grid grid-cols-2 gap-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group">
                            
                            {/* Imagen y Tags */}
                            <div className="relative h-36 overflow-hidden bg-gray-50">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Gradiente inferior en la imagen para contraste */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                
                                {product.department && (
                                    <span className="absolute top-2 left-2 bg-white/90 text-gray-800 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm backdrop-blur-md">
                                        {product.department}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col flex-grow justify-between bg-white z-10 relative">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                                        {product.name}
                                    </h3>
                                    {product.barcode && (
                                        <p className="text-[9px] font-bold text-gray-400 tracking-wider">#{product.barcode}</p>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-end mt-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Precio</p>
                                        <p className="font-black text-[#136A40] text-lg leading-none">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <button 
                                        className="text-[#e35212] hover:text-orange-600 active:scale-[0.85] transition-all duration-200"
                                        onClick={() => alert(`Agregaste ${product.name} (Próximamente carrito)`)}
                                    >
                                        <div className="bg-orange-50 rounded-full p-1 border border-orange-100 shadow-sm">
                                            <PlusCircleIcon className="w-7 h-7" />
                                        </div>
                                    </button>
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