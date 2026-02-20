// services/productService.ts
import { db } from '../components/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

// Lista de imágenes de relleno ya que tu BD no tiene fotos
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1554866585-CD94860890b7?q=80&w=400&auto=format&fit=crop', // Coca
    'https://images.unsplash.com/photo-1599490659213-e2b835748894?q=80&w=400&auto=format&fit=crop', // Papas
    'https://images.unsplash.com/photo-1622941369938-c62066642a8e?q=80&w=400&auto=format&fit=crop', // Pastelito
    'https://images.unsplash.com/photo-1511920183353-34e85a74243c?q=80&w=400&auto=format&fit=crop', // Café
    'https://images.unsplash.com/photo-1582287232386-25e9ac939f8f?q=80&w=400&auto=format&fit=crop', // Bebida
    'https://images.unsplash.com/photo-1553564402-c57f73d8c36a?q=80&w=400&auto=format&fit=crop', // Agua
];

export const getActiveProducts = async (): Promise<Product[]> => {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        // Solo traemos productos activos (isActive == true)
        const q = query(productsRef, where("isActive", "==", true));
        
        const snapshot = await getDocs(q);
        
        const products = snapshot.docs.map((doc, index) => {
            const data = doc.data();
            
            // Asignamos una imagen aleatoria basada en el índice para que siempre sea la misma para ese producto
            const randomImage = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

            return {
                id: doc.id,
                name: data.name || 'Producto sin nombre',
                price: parseFloat(data.price) || 0, // Aseguramos que sea número
                isActive: data.isActive,
                department: data.department,
                barcode: data.barcode,
                imageUrl: data.imageUrl || randomImage // Usamos la de la BD si existe, si no, la de relleno
            } as Product;
        });

        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};