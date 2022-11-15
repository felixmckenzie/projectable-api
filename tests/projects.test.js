import request from 'supertest';
import app from '../src/server.js';
import { registerUser, loginUser } from '../src/controllers/usersHelpers.js';
import admin from 'firebase-admin';
import { getAuth, signOut } from 'firebase/auth';
import { databaseConnector, databaseDisconnector } from '../src/database.js';

const DATABASE_URI =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/projectable-tests';

const newUserDetails = {
  email: 'tim_test90@testmail.com',
  password: 'timtest123',
  username: 'Tim',
};

let userRecord;
let token;
let project;
let task;
let comment;

// beforeAll(async () => {
//   try {
//     userRecord = await registerUser(newUserDetails);
//     loginOutcome = await loginUser(newUserDetails);
//     console.log(loginOutcome)
//     token = loginOutcome.token;
//   } catch (error) {
//     console.log(error);
//   }
// });

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

describe('Authenticate users', () => {
  it('Registers new user and logs them in', async () => {
    const response = await request(app)
      .post('/users/register')
      .send(newUserDetails);
    expect(response.statusCode).toEqual(201);
    userRecord = response.body;
    token = response.body.token;
  });

  it('Logs the current user out and then logs them in', async () => {
    const auth = getAuth();
    signOut(auth)
      .then(async () => {
        const response = await request(app)
          .post('/users/login')
          .send(newUserDetails);
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual('tim_test90@testmail.com');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('Get, Create and Update Projects', () => {
  it('creates a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A new project',
        description: 'This is a test project',
        createdBy: userRecord.displayName,
        userId: userRecord.uid,
      });
    expect(response.statusCode).toEqual(201);
    project = response.body;
    expect(project.name).toEqual('A new project');
    expect(project.description).toEqual('This is a test project');
    expect(project.createdBy).toEqual(userRecord.displayName);
    expect(project.tasks).toEqual([]);
    expect(project.members).toEqual([]);
  });

  it('Retrieves all projects for a user', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    const project = response.body[0];
    expect(project.createdBy).toEqual(userRecord.displayName);
    expect(project.userId).toEqual(userRecord.uid);
    expect(project.name).toEqual('A new project');
  });

  it('Retrieves a single project by id', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(project.createdBy).toEqual(userRecord.displayName);
    expect(project.userId).toEqual(userRecord.uid);
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

  // it('Searches for a user using email address', async () => {
  //   const response = await request(app)
  //     .get(`/api/projects/${project._id}/members/search`)
  //     .query({ email: 'tim_test90@testmail.com' })
  //     .set('Authorization', `Bearer ${token}`);
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.uid).toEqual(userRecord.uid);
  // });

  it('Adds a user to project members', async () => {
    const response = await request(app)
      .put(`/api/projects/${project._id}/members/new`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: userRecord.displayName,
        email: userRecord.email,
        userId: userRecord.uid,
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Error scenarios for project routes', () => {
  it('Fails to retrieve all projects without a token', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.statusCode).toEqual(401);
    expect(response.error.message).toEqual('cannot GET /api/projects (401)');
  });

  it('Fails to retrieve a single project with an invalid project Id', async () => {
    const response = await request(app)
      .get(`/api/projects/ggegg45445ffggfe5`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(400);
  });

  it('fails to create a project without required values', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A failed test project',
      });
    expect(response.statusCode).toEqual(400);
  });

  it('fails to update a project with invalid project id', async () => {
    const response = await request(app)
      .put(`/api/projects/fifbfuwfi480485u0-`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A better name for the project',
      });
    expect(response.statusCode).toEqual(400);
  });
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
        assignedTo: userRecord.uid,
      });
    expect(response.statusCode).toEqual(200);
    task = response.body;
    expect(task.brief).toEqual('Updated name for task');
    expect(task.description).toEqual('Updated description for task');
  });

  it('Retrieves all tasks for a user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toEqual(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0].brief).toEqual('Updated name for task');
  });
});

describe('Error scenarios for task routes', () => {
  it('Fails to retrieve all tasks without a token', async () => {
    const response = await request(app).get(
      `/api/projects/${project._id}/tasks`
    );
    expect(response.statusCode).toEqual(401);
  });

  it('Fails to retrieve a single task with an invalid task Id', async () => {
    const response = await request(app)
      .get(`/api/projects/${project._id}/tasks/ggegg45445ffggfe5`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(400);
  });

  it('fails to create a task without required values', async () => {
    const response = await request(app)
      .post(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        brief: 'This should fail',
      });
    expect(response.statusCode).toEqual(400);
  });

  it('fails to create a task with an invalid project id ', async () => {
    const response = await request(app)
      .post(`/api/projects/39034093448n/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        brief: 'Failed task creation',
        description: 'Invalid project id',
      });
    expect(response.statusCode).toEqual(400);
    expect(response.error.message).toEqual(
      'cannot POST /api/projects/39034093448n/tasks (400)'
    );
  });

  it('fails to update a task with invalid task id', async () => {
    const response = await request(app)
      .put(`/api/projects/${project._id}/tasks/fifbfuwfi480485u0-`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A better name for the project',
      });
    expect(response.statusCode).toEqual(400);
  });
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
    expect(comment.createdBy).toEqual(userRecord.displayName);
    expect(comment.userId).toEqual(userRecord.uid);
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

describe('Error scenarios for comment routes', () => {
  it('Fails to retrieve all comments without a token', async () => {
    const response = await request(app).get(
      `/api/projects/${project._id}/tasks/${task._id}/comments`
    );
    expect(response.statusCode).toEqual(401);
  });

  it('Fails to retrieve a single comment with an invalid comment Id', async () => {
    const response = await request(app)
      .get(
        `/api/projects/${project._id}/tasks/${task._id}/comments/jjebeigb9349h9`
      )
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(400);
  });

  it('fails to create a comment without required values', async () => {
    const response = await request(app)
      .post(`/api/projects/${project._id}/tasks/${task._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(response.statusCode).toEqual(400);
  });

  it('fails to update a commment with invalid comment id', async () => {
    const response = await request(app)
      .put(
        `/api/projects/${project._id}/tasks/${task._id}/comments/jjebeigb9349h9`
      )
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A better name for the project',
      });
    expect(response.statusCode).toEqual(400);
  });
});

describe('Delete Projects, Tasks and Comments', () => {
  it('Deletes a single comment', async () => {
    const response = await request(app)
      .delete(
        `/api/projects/${project._id}/tasks/${task._id}/comments/${comment._id}`
      )
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
  });

  it('Deletes a single task', async () => {
    const response = await request(app)
      .delete(`/api/projects/${project._id}/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
  });

  it('Deletes a single project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body._id).toEqual(project._id);
  });
});
