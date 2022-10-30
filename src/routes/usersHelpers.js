import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import firebaseApp from '../firebaseApp.js';

const auth = getAuth(firebaseApp);

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      return { error: error.message };
    });
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      return { error: error.message };
    });
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
