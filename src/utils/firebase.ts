if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import admin from 'firebase-admin';

const env = process.env.RAILWAY_SERVICE_ACCOUNT_KEY;
const serviceAccountKey = env ? JSON.parse(env) : {};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

export const db = admin.firestore();
