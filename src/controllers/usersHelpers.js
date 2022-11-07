import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { firebaseClientConfig } from '../config/firebaseClientKey.js';
import logger from '../config/logger.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Initialize the Firebase Client SDK
initializeApp(firebaseClientConfig);

export async function registerUser(userDetails) {
  try {
    const userRecord = await admin.auth().createUser({
      email: userDetails.email,
      emailVerified: true,
      password: userDetails.password,
      disabled: false,
      displayName: userDetails.displayName,
    });

    return userRecord;
  } catch (error) {
    return { error: error.message };
  }
}

export async function loginUser(userDetails) {
  const clientAuth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      userDetails.email,
      userDetails.password
    );
    let userIdToken = await clientAuth.currentUser.getIdTokenResult(false);
    return {
      idToken: userIdToken,
      refreshToken: userCredential.user.refreshToken,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      uid: userCredential.user.uid,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function checkIfAuthenticated(req, res, next) {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).end();
  }
  const token = bearer.split(' ')[1].trim();
  try {
    const user = await admin.auth().verifyIdToken(token);
    req.userId = user.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}

export async function getUserByEmail(req, res) {
  try {
    const email = req.query;
    const userRecord = await admin.auth().getUserByEmail(email);
    res.status(200).json(userRecord);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
