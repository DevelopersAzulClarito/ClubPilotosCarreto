// services/userService.ts
import { db, auth } from '../components/firebaseConfig';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    doc, 
    onSnapshot 
} from 'firebase/firestore';
import { PlayerProfile } from '../types';

const USERS_COLLECTION = 'customers'; // Tu colección real en Firestore

// --- LOGIN INTELIGENTE (CORREO O TELÉFONO) ---
export const loginWithIdentifier = async (identifier: string, password: string): Promise<PlayerProfile> => {
    let emailToUse = identifier.trim();

    // 1. Si no tiene arroba, asumimos que es un TELÉFONO
    if (!identifier.includes('@')) {
        const cleanPhone = identifier.replace(/\D/g, '').trim();
        console.log(`Intentando login con teléfono: ${cleanPhone}`);

        // Buscamos el correo asociado a ese teléfono en Firestore
        const q = query(collection(db, USERS_COLLECTION), where("phone", "==", cleanPhone));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error("Este número no está registrado.");
        }

        const userDoc = snapshot.docs[0].data();
        
        if (!userDoc.email) {
            throw new Error("Tu cuenta existe pero no está vinculada a un correo/contraseña. Por favor ve a 'Registrarme' para activarla.");
        }

        emailToUse = userDoc.email; // Usamos el correo encontrado
    }

    // 2. Autenticación oficial con Firebase Auth
    await signInWithEmailAndPassword(auth, emailToUse, password);

    // 3. Descargar perfil completo
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", emailToUse));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        
        return {
            id: docSnap.id,
            customerId: data.customerId || docSnap.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            xp: data.points || 0, // Mapeo crucial: BD(points) -> App(xp)
            level: data.level || 1,
            avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.phone}`,
        } as PlayerProfile;
    } else {
        throw new Error("Login exitoso pero no se encontró perfil en base de datos.");
    }
};

// --- REGISTRO CON VINCULACIÓN DE PUNTOS ---
export const registerWithEmail = async (userData: { email: string; password: string; phone: string; name: string; age: string }) => {
    const cleanPhone = userData.phone.replace(/\D/g, '').trim();

    // 1. Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const uid = userCredential.user.uid;

    // 2. Buscar si ya existe el teléfono en Firestore (Cuentas viejas)
    const q = query(collection(db, USERS_COLLECTION), where("phone", "==", cleanPhone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        // CASO A: YA EXISTÍA -> ACTUALIZAMOS (Vinculación)
        console.log("Cuenta existente encontrada. Vinculando...");
        const existingDoc = snapshot.docs[0];
        const userRef = doc(db, USERS_COLLECTION, existingDoc.id);

        await updateDoc(userRef, {
            email: userData.email,
            authUid: uid,
            name: userData.name, 
            age: userData.age
            // NO tocamos 'points', así conserva sus 1352 puntos
        });

        const data = existingDoc.data();
        return {
            ...data,
            id: existingDoc.id,
            xp: data.points || 0,
            level: data.level || 1,
            avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${cleanPhone}`
        } as PlayerProfile;

    } else {
        // CASO B: USUARIO NUEVO -> CREAMOS
        console.log("Usuario nuevo. Creando...");
        const newDocRef = await addDoc(collection(db, USERS_COLLECTION), {
            name: userData.name,
            phone: cleanPhone,
            email: userData.email,
            age: userData.age,
            points: 0,
            level: 1,
            authUid: uid,
            createdAt: new Date().toISOString()
        });
        
        return {
            id: newDocRef.id,
            customerId: newDocRef.id,
            name: userData.name,
            phone: cleanPhone,
            email: userData.email,
            xp: 0,
            level: 1,
            avatarUrl: `https://i.pravatar.cc/150?u=${cleanPhone}`
        } as PlayerProfile;
    }
};

// --- SUSCRIPCIÓN EN TIEMPO REAL ---
export const subscribeToUser = (email: string, callback: (user: PlayerProfile) => void) => {
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
    
    getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;
            // Escuchamos cambios en ese documento específico
            return onSnapshot(doc(db, USERS_COLLECTION, docId), (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    callback({
                        id: docSnap.id,
                        customerId: data.customerId || docSnap.id,
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        xp: data.points || 0,
                        level: data.level || 1,
                        avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.phone}`
                    } as PlayerProfile);
                }
            });
        }
    });
};

// --- ACTUALIZAR PUNTOS ---
export const updateUserStats = async (docId: string, newXp: number, newLevel: number) => {
    const userRef = doc(db, USERS_COLLECTION, docId);
    await updateDoc(userRef, {
        points: newXp, // Guardamos en 'points' para tu BD
        xp: newXp,     // Guardamos 'xp' por redundancia/compatibilidad
        level: newLevel
    });
};

export const logoutFirebase = async () => {
    await signOut(auth);
};