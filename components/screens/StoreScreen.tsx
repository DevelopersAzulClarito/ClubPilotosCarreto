import React from 'react';
import { Product } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

const products: Product[] = [
    { id: 1, name: 'Coca-Cola 600ml', price: 18.00, imageUrl: 'https://images.unsplash.com/photo-1554866585-CD94860890b7?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'Sabritas Papas Sal', price: 17.00, imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b835748894?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: 'Gansito Marinela', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1622941369938-c62066642a8e?q=80&w=400&auto=format&fit=crop' },
    { id: 4, name: 'Café Americano', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1511920183353-34e85a74243c?q=80&w=400&auto=format&fit=crop' },
    { id: 5, name: 'Red Bull 250ml', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1582287232386-25e9ac939f8f?q=80&w=400&auto=format&fit=crop' },
    { id: 6, name: 'Agua Ciel 1L', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1553564402-c57f73d8c36a?q=80&w=400&auto=format&fit=crop' },
    { id: 7, name: 'Ruffles Queso', price: 17.00, imageUrl: 'https://images.unsplash.com/photo-1613842998858-efc339733f52?q=80&w=400&auto=format&fit=crop' },
    { id: 8, name: 'Hot Nuts', price: 16.00, imageUrl: 'https://images.unsplash.com/photo-1574092285149-8874f68564a9?q=80&w=400&auto=format&fit=crop' },
];

const StoreScreen: React.FC = () => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Tienda de Conveniencia</h2>
            <div className="grid grid-cols-2 gap-4">
                {products.map(product => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover"/>
                        <div className="p-3">
                            <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-bold text-[#136A40]">${product.price.toFixed(2)}</p>
                                <button className="text-[#e35212] hover:text-orange-600">
                                    <PlusCircleIcon className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreScreen;
