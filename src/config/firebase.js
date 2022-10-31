export const development = {
  apiKey: process.env.DEV_FIREBASE_API_KEY,
  authDomain: process.env.DEV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.DEV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.DEV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.DEV_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.DEV_FIREBASE_APP_ID,
};

export const production = {
  apiKey: process.env.PROD_FIREBASE_API_KEY,
  authDomain: process.env.PROD_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PROD_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PROD_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PROD_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PROD_FIREBASE_APP_ID,
};
