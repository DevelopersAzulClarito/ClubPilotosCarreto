import { useEffect } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseTemp';

export const usePushNotifications = (customerId: string | undefined) => {
    useEffect(() => {
        if (!Capacitor.isNativePlatform() || !customerId) {
            console.log('PUSH_DEBUG: Saltando setup — isNative:', Capacitor.isNativePlatform(), '| customerId:', customerId);
            return;
        }

        let cancelled = false;
        let registrationListener: PluginListenerHandle | null = null;
        let errorListener: PluginListenerHandle | null = null;

        const setup = async () => {
            try {
                // Android 8+ (API 26+) requiere canal explícito o las notificaciones se descartan silenciosamente
                if (Capacitor.getPlatform() === 'android') {
                    await PushNotifications.createChannel({
                        id: 'default',
                        name: 'Notificaciones Club Pilotos',
                        description: 'Canal principal de notificaciones',
                        importance: 5,
                        sound: 'default',
                        vibration: true,
                        visibility: 1,
                    });
                    console.log('PUSH_DEBUG: Canal Android "default" creado.');
                }

                let permStatus = await PushNotifications.checkPermissions();
                console.log('PUSH_DEBUG: Estado de permisos inicial:', permStatus.receive);

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                    console.log('PUSH_DEBUG: Estado de permisos tras solicitud al usuario:', permStatus.receive);
                }

                if (permStatus.receive !== 'granted') {
                    console.warn('PUSH_DEBUG: Permisos NO concedidos. Estado final:', permStatus.receive, '— abortando registro.');
                    return;
                }

                // Verificar cancelación antes de registrar (el componente pudo desmontarse durante requestPermissions)
                if (cancelled) return;

                console.log('PUSH_DEBUG: Permisos concedidos. Intentando registrar en FCM...');
                await PushNotifications.register();
                console.log('PUSH_DEBUG: PushNotifications.register() completado. Esperando token...');

                // Verificar cancelación después del await de register()
                if (cancelled) return;

                registrationListener = await PushNotifications.addListener('registration', async (token) => {
                    console.log('PUSH_DEBUG: ¡Token FCM obtenido! ->', token.value);
                    try {
                        const userRef = doc(db, 'customers', customerId);
                        await updateDoc(userRef, { fcmToken: token.value });
                        console.log('PUSH_DEBUG: Token guardado en Firestore — doc ID:', customerId);
                    } catch (error) {
                        console.error('PUSH_DEBUG: Error al guardar token FCM en Firestore:', error);
                    }
                });

                errorListener = await PushNotifications.addListener('registrationError', (error) => {
                    console.error('PUSH_DEBUG: Error al registrar en FCM (registrationError):', error);
                });

                console.log('PUSH_DEBUG: Listeners "registration" y "registrationError" activos.');
            } catch (err) {
                console.error('PUSH_DEBUG: Excepción inesperada en setup():', err);
            }
        };

        setup();

        return () => {
            cancelled = true;
            registrationListener?.remove();
            errorListener?.remove();
        };
    }, [customerId]);
};
