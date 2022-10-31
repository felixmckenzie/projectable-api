import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server.js';
import { databaseConnector, databaseDisconnector } from '../src/database.js';

const DATABASE_URI =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/projectable-tests';

// set up before-tests and after-tests operations
beforeEach(async () => {
  await databaseConnector(DATABASE_URI);
});

afterEach(async () => {
  await databaseDisconnector();
});

describe('Projects', () => {
  it('creates a project', async () => {
    const response = await request(app).post('/projects').send({
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
