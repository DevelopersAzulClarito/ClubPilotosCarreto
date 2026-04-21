import { useEffect } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseTemp';

export const usePushNotifications = (customerId: string | undefined) => {
    useEffect(() => {
        if (!Capacitor.isNativePlatform() || !customerId) return;

        let cancelled = false;
        let registrationListener: PluginListenerHandle | null = null;
        let errorListener: PluginListenerHandle | null = null;

        const setup = async () => {
            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                permStatus = await PushNotifications.requestPermissions();
            }

            if (permStatus.receive === 'granted') {
                await PushNotifications.register();
            }

            if (cancelled) return;

            registrationListener = await PushNotifications.addListener('registration', async (token) => {
                try {
                    const userRef = doc(db, 'customers', customerId);
                    await updateDoc(userRef, { fcmToken: token.value });
                } catch (error) {
                    console.error('Error guardando el token FCM:', error);
                }
            });

            errorListener = await PushNotifications.addListener('registrationError', (error) => {
                console.error('Error registrando Push Notifications:', error);
            });
        };

        setup();

        return () => {
            cancelled = true;
            registrationListener?.remove();
            errorListener?.remove();
        };
    }, [customerId]);
};
