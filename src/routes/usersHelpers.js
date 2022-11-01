import admin from 'firebase-admin';
import { initializeApp } from 'firebase';
import { firebaseClientConfig } from '../config/firebaseClientKey';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Initialize the Firebase Client SDK
initializeApp(firebaseClientConfig);

export async function registerUser(userDetails) {
  return admin
    .auth()
    .createUser({
      email: userDetails.email,
      emailVerified: true,
      password: userDetails.password,
      displayName: userDetails.displayName,
      disabled: false,
    })
    .then(async (userRecord) => {
      return userRecord;
    })
    .catch((error) => {
      return { error: error.message };
    });
}

export async function loginUser(userDetails) {
  const clientAuth = getAuth();
  const signInResult = signInWithEmailAndPassword(
    clientAuth,
    userDetails.email,
    userDetails.password
  )
    .then(async (userCredential) => {
      const userIdToken = await clientAuth.currentUser.getIdTokenResult(false);
      console.log(`userIdToken obj is\n ${JSON.stringify(userIdToken)}`);
      return {
        idToken: userIdToken.token,
        refreshToken: userCredential.user.refreshToken,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        uid: userCredential.user.uid,
      };
    })
    .catch((error) => {
      return { error: error.message };
    });
    return signInResult
}

export async function initUserProfile(user, profileInfo) {
  const { username } = profileInfo;
  return updateProfile(user, {
    displayName: username,
  })
    .then(() => {
      return {};
    })
    .catch((error) => {
      return {
        error: error.message,
      };
    });
}


