import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server.js';
import { registerUser, loginUser } from '../src/controllers/usersHelpers.js';
import admin from 'firebase-admin';
import { databaseConnector, databaseDisconnector } from '../src/database.js';

const DATABASE_URI =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/projectable-tests';

const newUserDetails = {
  email: 'john_test_user@mail.com',
  password: 'johntest1234',
  firstName: 'John',
  lastName: 'Test',
  username: 'johntester',
};

let userRecord;
let loginOutcome;
let token;
let project;
let task;
let comment;

beforeAll(async () => {
  try {
    userRecord = await registerUser(newUserDetails);
    loginOutcome = await loginUser(newUserDetails);
    token = loginOutcome.idToken.token;
    console.log(userRecord)
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

describe('Get, Create and Update Projects', () => {
  it('creates a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A new project',
        description: 'This is a test project',
        createdBy: userRecord.uid,
      });
    expect(response.statusCode).toEqual(201);
    project = response.body;
    expect(project.name).toEqual('A new project');
    expect(project.description).toEqual('This is a test project');
    expect(project.createdBy).toEqual(userRecord.uid);
    expect(project.tasks).toEqual([]);
    expect(project.members).toEqual([]);
  });

  it('Retrieves all projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    const project = response.body[0];
    expect(project.createdBy).toEqual(userRecord.uid);
    expect(project.name).toEqual('A new project');
  });
  it('Fails to get all projects without a token', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.statusCode).toEqual(401);
    expect(response.error.message).toEqual('cannot GET /api/projects (401)');
  });
  it('Retrieves a single project by id', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(project.createdBy).toEqual(userRecord.uid);
    expect(project.name).toEqual('A new project');
    expect(project.description).toEqual('This is a test project');
  });

  it('Updates a single project', async () => {
    const response = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A better name for the project',
      });
    expect(response.statusCode).toEqual(200);
    project = response.body;
    expect(project.name).toEqual('A better name for the project');
    expect(project.description).toEqual('This is a test project');
  });

  // it('Deletes a single project', async () => {
  //   const response = await request(app)
  //     .delete(`/api/projects/${project._id}`)
  //     .set('Authorization', `Bearer ${token}`);
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body._id).toEqual(project._id);
  // });
});

describe('Get, Create and Update Tasks', () => {
  it('Creates a task on a project', async () => {
    const response = await request(app)
      .post(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        brief: 'first task for test project',
        description: 'created a task on test project',
      });
    expect(response.statusCode).toEqual(201);
    task = response.body.task;
    project = response.body.project;
    expect(task.brief).toEqual('first task for test project');
    expect(task.description).toEqual('created a task on test project');
    expect(project.tasks[0]).toEqual(task._id);
  });

  it('Retrieves all tasks for a project', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('Retrieves a single task by ID', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
  });

  it('Updates a single task', async () => {
    const response = await request(app)
      .put(`/api/projects/${project._id}/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        brief: 'Updated name for task',
        description: 'Updated description for task',
        deadline: new Date('2022-12-17').toString(),
      });
    expect(response.statusCode).toEqual(200);
    task = response.body;
    console.log(task.deadline);
    expect(task.brief).toEqual('Updated name for task');
    expect(task.description).toEqual('Updated description for task');
  });

  it('Deletes a single task', async () => {});
});

describe('Get, Create and Update Comments', () => {
  it('Creates a comment on a task', async () => {
    const response = await request(app)
      .post(`/api/projects/${project._id}/tasks/${task._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'test comment',
      });
    comment = response.body;
    expect(response.statusCode).toEqual(201);
    expect(comment.content).toEqual('test comment');
    expect(comment.task).toEqual(task._id);
    expect(comment.createdBy).toEqual(userRecord.uid);
  });

  it('Gets all comments on a task', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}/tasks/${task._id}/comments`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].content).toEqual('test comment');
    expect(response.body[0].task).toEqual(task._id);
  });

  it('Gets a single comment', async () => {
    const response = await request(app)
      .get(
        `/api/projects/${project._id}/tasks/${task._id}/comments/${comment._id}`
      )
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.content).toEqual('test comment');
  });

  it('Updates a single comment', async () => {
    const response = await request(app)
      .put(
        `/api/projects/${project._id}/tasks/${task._id}/comments/${comment._id}`
      )
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'updated content for test comment' });
    expect(response.statusCode).toEqual(200);
    expect(response.body.content).toEqual('updated content for test comment');
  
  });
});
