import { initializeApp } from 'firebase/app';
import { development, production } from './config/firebase.js';

const config =
  process.env.NODE_ENV === 'development' ? development : production;

export default initializeApp(config);
