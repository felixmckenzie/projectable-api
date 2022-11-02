import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server.js';
import { registerUser, loginUser } from '../src/routes/usersHelpers.js';
import admin from 'firebase-admin';
import { databaseConnector, databaseDisconnector } from '../src/database.js';

const DATABASE_URI =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/projectable-tests';

const newUserDetails = {
  email: 'john_test_user@mail.com',
  password: 'johntest1234',
  firstName: 'John',
  lastName: 'Test',
  username: 'johntester'

};
let userRecord;
let loginOutcome;

beforeAll(async () => {
  try {
    userRecord = await registerUser(newUserDetails);
    loginOutcome = await loginUser(newUserDetails)
    console.log(loginOutcome.idToken.token)
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
await admin
  .auth()
  .deleteUser(userRecord.uid)
  .then(() => {
    console.log('Successfully deleted user');
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
  });
});

// set up before-tests and after-tests operations
beforeEach(async () => {
  await databaseConnector(DATABASE_URI);
});

afterEach(async () => {
  await databaseDisconnector();
});

describe('Projects', () => {
  it('creates a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set("Authorization", "Bearer " + loginOutcome.idToken.token)
      .send({
        name: 'A new project',
        description: 'This is a test project',
        createdBy: 'John Smith',
      });
     
     
    expect(response.statusCode).toEqual(201);
    const project = response.body;
    expect(project.name).toEqual('A new project');
    expect(project.description).toEqual('This is a test project');
    expect(project.createdBy).toEqual('John Smith');
    expect(project.tasks).toEqual([]);
    expect(project.members).toEqual([]);
  });

  it('Retrieves all projects', async () => {
    const response = await request(app).get('/projects');
  });
});
