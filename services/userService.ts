import { db, auth } from '../components/firebaseTemp';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import {
    collection,
    query,
    where,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { PlayerProfile } from '../types';

const USERS_COLLECTION = 'customers'; 

// --- LOGIN INTELIGENTE (CORREO O TELÉFONO) ---
export const loginWithIdentifier = async (identifier: string, password: string): Promise<PlayerProfile> => {
    let emailToUse = identifier.trim();

    if (!identifier.includes('@')) {
        const cleanPhone = identifier.replace(/\D/g, '').trim();
        const q = query(collection(db, USERS_COLLECTION), where("phone", "==", cleanPhone), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error("Este número no está registrado.");
        }

        const userDoc = snapshot.docs[0].data();
        if (!userDoc.email) {
            throw new Error("Tu cuenta existe pero no está vinculada a un correo/contraseña. Por favor ve a 'Registrarme' para activarla.");
        }
        emailToUse = userDoc.email; 
    }

    await signInWithEmailAndPassword(auth, emailToUse, password);

    const q = query(collection(db, USERS_COLLECTION), where("email", "==", emailToUse), limit(1));
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
            xp: data.points ?? 0,
            level: data.level ?? 0,
            avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.phone}`,
            checkIns: data.checkIns || data.visits || 0,
            visits: data.visits || data.checkIns || 0,
            hasAcceptedTerms: data.hasAcceptedTerms ?? false,
        } as PlayerProfile;
    } else {
        throw new Error("Login exitoso pero no se encontró perfil en base de datos.");
    }
};

// --- REGISTRO CON VINCULACIÓN DE PUNTOS ---
export const registerWithEmail = async (userData: { email: string; password: string; phone: string; name: string; age: string }) => {
    const cleanPhone = userData.phone.replace(/\D/g, '').trim();
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const uid = userCredential.user.uid;

    const q = query(collection(db, USERS_COLLECTION), where("phone", "==", cleanPhone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const userRef = doc(db, USERS_COLLECTION, existingDoc.id);

        await updateDoc(userRef, {
            email: userData.email,
            authUid: uid,
            name: userData.name, 
            age: userData.age
        });

        const data = existingDoc.data();
        return {
            ...data,
            id: existingDoc.id,
            xp: data.points ?? 0,
            level: data.level ?? 0,
            avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${cleanPhone}`,
            checkIns: data.checkIns || data.visits || 0,
            visits: data.visits || data.checkIns || 0
        } as PlayerProfile;

    } else {
        const newDocRef = await addDoc(collection(db, USERS_COLLECTION), {
            name: userData.name,
            phone: cleanPhone,
            email: userData.email,
            age: userData.age,
            points: 0,
            level: 0,
            checkIns: 0,
            visits: 0,
            authUid: uid,
            hasAcceptedTerms: false,
            createdAt: new Date().toISOString()
        });

        return {
            id: newDocRef.id,
            customerId: newDocRef.id,
            name: userData.name,
            phone: cleanPhone,
            email: userData.email,
            xp: 0,
            level: 0,
            checkIns: 0,
            visits: 0,
            avatarUrl: `https://i.pravatar.cc/150?u=${cleanPhone}`,
            hasAcceptedTerms: false,
        } as PlayerProfile;
    }
};

// --- SUSCRIPCIÓN EN TIEMPO REAL (SIN NOTIFICACIONES LOCALES) ---
export const subscribeToUser = (email: string, callback: (user: PlayerProfile) => void): () => void => {
    let cancelSnapshot: (() => void) | null = null;
    let cancelled = false;

    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email), limit(1));

    getDocs(q).then(snapshot => {
        if (cancelled || snapshot.empty) return;

        const docId = snapshot.docs[0].id;
        cancelSnapshot = onSnapshot(doc(db, USERS_COLLECTION, docId), (docSnap) => {
            if (cancelled || !docSnap.exists()) return;
            const data = docSnap.data();
            callback({
                id: docSnap.id,
                customerId: data.customerId || docSnap.id,
                name: data.name,
                phone: data.phone,
                email: data.email,
                xp: data.points ?? 0,
                level: data.level ?? 0,
                avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.phone}`,
                checkIns: data.checkIns ?? data.visits ?? 0,
                visits: data.checkIns ?? data.visits ?? 0,
                hasAcceptedTerms: data.hasAcceptedTerms ?? false,
            } as PlayerProfile);
        });
    });

    return () => {
        cancelled = true;
        if (cancelSnapshot) cancelSnapshot();
    };
};

// --- ACTUALIZAR PUNTOS ---
export const updateUserStats = async (docId: string, newXp: number, newLevel: number) => {
    const userRef = doc(db, USERS_COLLECTION, docId);
    await updateDoc(userRef, {
        points: newXp,
        xp: newXp,
        level: newLevel
    });
};

export const logoutFirebase = async () => {
    await signOut(auth);
}; 

// --- ACEPTAR TÉRMINOS Y CONDICIONES ---
export const acceptTerms = async (docId: string): Promise<void> => {
    const userRef = doc(db, USERS_COLLECTION, docId);
    await updateDoc(userRef, { hasAcceptedTerms: true });
};

// --- RECUPERAR CONTRASEÑA INTELIGENTE ---
export const resetPasswordWithIdentifier = async (identifier: string): Promise<void> => {
    let emailToUse = identifier.trim();

    if (!identifier.includes('@')) {
        const cleanPhone = identifier.replace(/\D/g, '').trim();
        const q = query(collection(db, USERS_COLLECTION), where("phone", "==", cleanPhone), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error("Este número no está registrado.");
        }

        const userDoc = snapshot.docs[0].data();
        if (!userDoc.email) {
            throw new Error("Tu cuenta no tiene un correo vinculado.");
        }
        emailToUse = userDoc.email;
    }

    await sendPasswordResetEmail(auth, emailToUse);
};