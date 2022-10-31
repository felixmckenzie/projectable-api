import { initializeApp } from 'firebase/app';
import { development, production } from './config/firebase.js';

const config =
  process.env.NODE_ENV === 'development' || 'test' ? development : production;

export default initializeApp(config);
