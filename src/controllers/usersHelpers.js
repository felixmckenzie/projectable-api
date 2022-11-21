import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { firebaseClientConfig } from '../config/firebaseClientKey.js';
import logger from '../config/logger.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Project } from '../models/ProjectSchema.js';
import { Task } from '../models/TaskSchema.js';
import { Comment } from '../models/CommentSchema.js';

// Initialize the Firebase Client SDK
initializeApp(firebaseClientConfig);

export async function registerUser(userDetails) {
  try {
    const userRecord = await admin.auth().createUser({
      email: userDetails.email,
      emailVerified: true,
      password: userDetails.password,
      disabled: false,
      displayName: userDetails.username,
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
      token: userIdToken.token,
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
    req.user = { uid: user.uid, username: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}

export async function getUserByEmail(req, res) {
  try {
    admin
      .auth()
      .listUsers(1000)
      .then((listUsersResult) => {
        const result = listUsersResult.users.filter((userRecord) => {
          return userRecord.email.includes(req.query.email);
        });
        res.status(200).json(result);
      });
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getUserById(req, res) {
  try {
    const uid = req.user.uid;
    const user = await admin.auth().getUser(uid);
    res.status(200).json(user);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function updateUserDetails(req, res) {
  try {
    const uid = req.user.uid;
    const updatedUser = await admin.auth().updateUser(uid, {
      ...req.body,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function deleteUser(req, res) {
  try {
    const uid = req.user.uid;
    const updatedProjects = await Project.updateMany(
      { members: { $elemMatch: { userId: uid } } },
      { $pull: { members: { uid: uid } } },
      { multi: true }
    );
    if (updatedProjects.error) {
      throw new Error('Project members not updated');
    }

    await Task.deleteMany({ userId: uid });
    await Comment.deleteMany({ userId: uid });
    await Project.deleteMany({ userId: uid });

    const deletedUser = await admin.auth().deleteUser(uid);
    res.status(200).json(deletedUser);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
