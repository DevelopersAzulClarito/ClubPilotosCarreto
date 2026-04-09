import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseTemp'; // Ajusta la ruta si tu archivo de Firebase está en otro lado

export const usePushNotifications = (customerId: string | undefined) => {
    useEffect(() => {
        // Solo intentamos pedir Push reales si estamos en el celular y si el usuario ya inició sesión
        if (Capacitor.isNativePlatform() && customerId) {
            
            const registerPush = async () => {
                // 1. Pedimos permiso
                let permStatus = await PushNotifications.checkPermissions();
                
                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive === 'granted') {
                    // 2. Si nos da permiso, nos conectamos a Google FCM
                    await PushNotifications.register();
                }
            };

            registerPush();

            // 3. Escuchamos cuando Google nos responda con el Token
            const registrationListener = PushNotifications.addListener('registration', async (token) => {
                console.log('¡Token recibido de Google!: ', token.value);
                try {
                    // 4. Lo guardamos en el perfil del cliente en Firestore
                    const userRef = doc(db, 'customers', customerId);
                    await updateDoc(userRef, {
                        fcmToken: token.value
                    });
                    console.log('✅ Token guardado en Firebase exitosamente.');
                } catch (error) {
                    console.error('Error guardando el token en Firestore:', error);
                }
            });

            // Si hay un error al registrarse con Google
            const errorListener = PushNotifications.addListener('registrationError', (error) => {
                console.error('Error registrando Push Notifications:', error);
            });

            // Limpiamos los listeners si el usuario cierra sesión
            return () => {
                registrationListener.remove();
                errorListener.remove();
            };
        }
    }, [customerId]);
};