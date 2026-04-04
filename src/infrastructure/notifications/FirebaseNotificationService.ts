import * as admin from 'firebase-admin';
import path from 'path';
import { NotificationPort } from '../../domain/ports/NotificationPort';

export class FirebaseNotificationService implements NotificationPort {
  constructor() {
    const serviceAccount = require(path.resolve(__dirname, './tandamex-firebase-adminsdk-.json'));

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('🔥 Firebase Admin inicializado correctamente');
    }
  }

  async sendPushNotification(tokens: string[], title: string, body: string, data?: any): Promise<void> {
    if (!tokens || tokens.length === 0) return;

    const message = {
      notification: { title, body },
      data: data || {}, 
      tokens: tokens
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`🔔 Notificaciones enviadas: ${response.successCount} exitosas, ${response.failureCount} fallidas`);
    } catch (error) {
      console.error('❌ Error enviando notificación push de Firebase:', error);
    }
  }
}