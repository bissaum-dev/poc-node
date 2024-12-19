if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import admin from 'firebase-admin';

const {
  RAILWAY_PUBLIC_DOMAIN,
  RAILWAY_PRIVATE_DOMAIN,
  RAILWAY_PROJECT_NAME,
  RAILWAY_ENVIRONMENT_NAME,
  RAILWAY_SERVICE_NAME,
  RAILWAY_PROJECT_ID,
  RAILWAY_ENVIRONMENT_ID,
  RAILWAY_SERVICE_ID,
  RAILWAY_SERVICE_ACCOUNT_KEY,
  RAILWAY_TEST,
} = process.env;
console.log({
  RAILWAY_PUBLIC_DOMAIN,
  RAILWAY_PRIVATE_DOMAIN,
  RAILWAY_PROJECT_NAME,
  RAILWAY_ENVIRONMENT_NAME,
  RAILWAY_SERVICE_NAME,
  RAILWAY_PROJECT_ID,
  RAILWAY_ENVIRONMENT_ID,
  RAILWAY_SERVICE_ID,
  RAILWAY_SERVICE_ACCOUNT_KEY,
  RAILWAY_TEST,
});
const env = process.env.RAILWAY_SERVICE_ACCOUNT_KEY;
console.log({ env });
const test = process.env.RAILWAY_TEST;
console.log({ test });
const serviceAccountKey = env ? JSON.parse(env) : {};
console.log({ serviceAccountKey });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

export const db = admin.firestore();
