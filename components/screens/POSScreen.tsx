import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Product } from '../../types';
import { TrashIcon } from '../icons/TrashIcon'; 
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { MinusCircleIcon } from '../icons/MinusCircleIcon'; 
import { ReceiptIcon } from '../icons/ReceiptIcon'; 

interface CartItem extends Product {
    quantity: number;
}

const POSScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, orderBy("name"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as unknown as Product[];
            
            setProducts(items);
            setLoading(false);
        }, (error) => {
            console.error("Error leyendo productos:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- 2. Lógica del Carrito ---

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId: string | number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item => 
                    item.id === productId 
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                );
            } else {
                return prevCart.filter(item => item.id !== productId);
            }
        });
    };

    const clearCart = () => setCart([]);

    // --- 3. Cálculos ---
    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = () => {
        setProcessing(true);
            setTimeout(() => {
            alert(`¡Venta completada por $${total.toFixed(2)}!\nTicket enviado a impresora.`);
            setProcessing(false);
            clearCart();
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            
            {/* --- COLUMNA IZQUIERDA: Catálogo de Productos --- */}
            <div className="flex-grow p-6 overflow-y-auto">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Punto de Venta</h1>
                        <p className="text-sm text-gray-500">Selecciona productos para agregar al ticket</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-600">
                        {products.length} productos disponibles
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                        {products.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-orange-500 hover:shadow-md transition-all flex flex-col items-center text-center group h-full justify-between"
                            >
                                <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-gray-50">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                                <p className="text-[#136A40] font-bold mt-1">${product.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- COLUMNA DERECHA: Ticket / Carrito --- */}
            <div className="w-96 bg-white shadow-2xl flex flex-col border-l border-gray-200 z-10">
                <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                    <ReceiptIcon className="w-6 h-6 text-gray-400"/>
                    <h2 className="font-bold text-gray-800 text-lg">Ticket de Venta</h2>
                </div>

                {/* Lista de Items */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
                            <PlusCircleIcon className="w-12 h-12" />
                            <p>Ticket vacío</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm truncate w-32">{item.name}</p>
                                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} unit.</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-white rounded-lg border border-gray-200">
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-1 hover:bg-red-50 hover:text-red-500 rounded-l-lg transition"
                                        >
                                            <MinusCircleIcon className="w-4 h-4"/>
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button 
                                            onClick={() => addToCart(item)}
                                            className="p-1 hover:bg-green-50 hover:text-green-500 rounded-r-lg transition"
                                        >
                                            <PlusCircleIcon className="w-4 h-4"/>
                                        </button>
                                    </div>
                                    <p className="font-bold text-gray-800 w-16 text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Resumen y Pago */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>Subtotal</span>
                            <span>${(total * 0.84).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>IVA (16%)</span>
                            <span>${(total * 0.16).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-gray-200">
                            <span className="font-bold text-gray-900 text-lg">Total</span>
                            <span className="font-black text-[#e35212] text-3xl">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                            onClick={clearCart}
                            disabled={cart.length === 0 || processing}
                            className="flex items-center justify-center p-3 text-red-600 font-bold bg-white border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-50 transition"
                        >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Cancelar
                        </button>
                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing}
                            className="py-3 px-4 bg-[#136A40] text-white font-bold rounded-xl hover:bg-green-800 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex justify-center items-center"
                        >
                            {processing ? 'Procesando...' : 'Cobrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POSScreen;