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
        <div className="p-4 pb-24 h-full overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Tienda de Conveniencia</h2>
                    <p className="text-xs text-gray-500">Canjea tus puntos o paga en caja</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    {products.length} Items
                </div>
            </div>

            {loading ? (
                // Skeleton Loader (Efecto de carga)
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 h-48 animate-pulse flex flex-col justify-between">
                            <div className="w-full h-24 bg-gray-200 rounded-xl mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                // Estado vacío
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-gray-400 text-lg">No hay productos disponibles por ahora.</p>
                </div>
            ) : (
                // Grid de Productos Reales
                <div className="grid grid-cols-2 gap-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                            
                            {/* Imagen */}
                            <div className="relative h-32 overflow-hidden bg-gray-100">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                                {product.department && (
                                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                        {product.department}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-3 flex flex-col flex-grow justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1">
                                        {product.name}
                                    </h3>
                                    {product.barcode && (
                                        <p className="text-[10px] text-gray-400 mb-2">Code: {product.barcode}</p>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center mt-2">
                                    <p className="font-black text-[#136A40] text-lg">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <button 
                                        className="text-[#e35212] hover:text-orange-600 active:scale-90 transition-transform"
                                        onClick={() => alert(`Agregaste ${product.name} (Próximamente carrito)`)}
                                    >
                                        <PlusCircleIcon className="w-8 h-8" />
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