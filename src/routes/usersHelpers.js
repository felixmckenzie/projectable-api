import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { firebaseClientConfig } from '../config/firebaseClientKey.js';
import {
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Initialize the Firebase Client SDK
initializeApp(firebaseClientConfig);

export async function registerUser(email, password) {
  return admin
    .auth()
    .createUser({
      email: email,
      emailVerified: true,
      password: password,
      disabled: false,
    })
    .then(async (userRecord) => {
      let defaultUserClaims = admin
        .auth()
        .setCustomUserClaims(userRecord.uid, { regularUser: true })
        .then(() => {});
      return userRecord;
    })
    .catch((error) => {
      return { error: error.message };
    });
}

export async function loginUser(email, password) {
  const clientAuth = getAuth();
  const signInResult = signInWithEmailAndPassword(clientAuth, email, password)
    .then(async (userCredential) => {
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
    })
    .catch((error) => {
      return { error: error };
    });
  return signInResult;
}


export async function checkIfAuthenticated(req, res, next) {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).end();
  }
  const token = bearer.split('Bearer ')[1].trim();
  try {
    const user = await admin.auth().verifyIdToken(token);
    req.userId = user.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}

// export async function initUserProfile(user, profileInfo) {
//   const { username } = profileInfo;
//   return updateProfile(user, {
//     displayName: username,
//   })
//     .then(() => {
//       return {};
//     })
//     .catch((error) => {
//       return {
//         error: error.message,
//       };
//     });
// }
