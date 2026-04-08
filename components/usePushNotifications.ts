import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseTemp'; 

export const usePushNotifications = (userId?: string) => {
    useEffect(() => {
        // Si no hay usuario logueado, no hacemos nada
        if (!userId) return; 
        
        // Las Push Notifications no funcionan en el navegador Web de tu PC. 
        // Solo las ejecutamos si estamos en un celular nativo (Android).
        if (!Capacitor.isNativePlatform()) {
            console.log("Notificaciones Push silenciadas: Estás en el navegador web.");
            return;
        }

        const registerPush = async () => {
            // 1. Pedir permisos al usuario (Sale la ventanita "¿Permitir notificaciones?")
            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                permStatus = await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                console.log('El usuario denegó los permisos para notificaciones.');
                return;
            }

            // 2. Registrar el dispositivo con Google
            await PushNotifications.register();
        }

        registerPush();

        // 3. Google nos responde con un "Token" único para este celular
        const registrationListener = PushNotifications.addListener('registration', async (token) => {
            console.log('FCM Token obtenido:', token.value);
            
            try {
                // 4. Guardamos ese token en el perfil del cliente en Firestore
                const userRef = doc(db, 'customers', userId);
                await updateDoc(userRef, {
                    fcmToken: token.value
                });
                console.log('Token guardado en Firestore exitosamente.');
            } catch (error) {
                console.error('Error guardando el token en Firestore:', error);
            }
        });

        // 5. Escuchar posibles errores de registro
        const errorListener = PushNotifications.addListener('registrationError', (error) => {
            console.error('Error en el registro de Push:', error);
        });

        // 6. Escuchar cuando llega una notificación y el usuario TIENE LA APP ABIERTA
        const pushReceivedListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push recibida en primer plano:', notification);
        });

        // 7. Escuchar cuando el usuario TOCA la notificación en su barra superior
        const pushActionPerformedListener = PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push tocada por el usuario:', notification);
        });

        // Limpieza
        return () => {
            registrationListener.remove();
            errorListener.remove();
            pushReceivedListener.remove();
            pushActionPerformedListener.remove();
        };
    }, [userId]);
};