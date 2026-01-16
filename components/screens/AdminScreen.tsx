import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Product } from '../../types';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon'; 
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

const AdminScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        imageUrl: ''
    });

    const productsCollection = collection(db, "products");

    
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getDocs(productsCollection);
            const items = data.docs.map(doc => ({ 
                ...doc.data(), 
                id: doc.id 
            })) as unknown as Product[];
            setProducts(items);
        } catch (error) {
            console.error("Error obteniendo productos:", error);
            alert("Error al cargar la tienda.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        setLoading(true);
        const priceNumber = parseFloat(formData.price);

        try {
            if (isEditing && currentId) {
                
                const productDoc = doc(db, "products", currentId);
                await updateDoc(productDoc, {
                    name: formData.name,
                    price: priceNumber,
                    imageUrl: formData.imageUrl || 'https://via.placeholder.com/150'
                });
                alert('Producto actualizado correctamente');
            } else {
                await addDoc(productsCollection, {
                    name: formData.name,
                    price: priceNumber,
                    imageUrl: formData.imageUrl || 'https://via.placeholder.com/150'
                });
                alert('Producto creado correctamente');
            }
            
            resetForm();
            fetchProducts();

        } catch (error) {
            console.error("Error guardando producto:", error);
            alert("Hubo un error al guardar.");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id: string | number) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        setLoading(true);
        try {
            const productDoc = doc(db, "products", String(id));
            await deleteDoc(productDoc);
            fetchProducts();
        } catch (error) {
            console.error("Error eliminando:", error);
            alert("No se pudo eliminar el producto.");
        } finally {
            setLoading(false);
        }
    };

   

    const startEdit = (product: Product) => {
        setIsEditing(true);
        setCurrentId(String(product.id));
        setFormData({
            name: product.name,
            price: product.price.toString(),
            imageUrl: product.imageUrl
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: '', price: '', imageUrl: '' });
    };

    return (
        <div className="p-6 pb-24 bg-gray-50 min-h-screen">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Administrar Tienda</h1>
                <p className="text-sm text-gray-500">Gestión de inventario y precios</p>
            </header>

            {/* --- FORMULARIO --- */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <h2 className="text-lg font-bold text-[#e35212] mb-4">
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="Ej. Coca-Cola 600ml"
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                            <input 
                                type="number" 
                                step="0.50"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                        <input 
                            type="url" 
                            value={formData.imageUrl}
                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`flex-1 py-3 px-4 rounded-xl text-white font-bold transition-all ${
                                isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#e35212] hover:bg-orange-600'
                            } disabled:opacity-50`}
                        >
                            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
                        </button>
                        
                        {isEditing && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- LISTA DE PRODUCTOS --- */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Inventario Actual</h2>
            
            {loading && products.length === 0 ? (
                <p className="text-center text-gray-500 animate-pulse">Cargando productos...</p>
            ) : (
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            />
                            
                            <div className="flex-grow">
                                <h3 className="font-bold text-gray-800">{product.name}</h3>
                                <p className="text-[#136A40] font-bold">${product.price.toFixed(2)}</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => startEdit(product)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <p>No hay productos en la base de datos.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminScreen;