import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server.js';
import { databaseConnector, databaseDisconnector } from '../src/database.js';

const DATABASE_URI = proces.env.DATABASE_URI || 'mongodb://localhost:27017/projectable-tests';

// set up before-tests and after-tests operations
beforeEach(async () => {
  await databaseConnector(DATABASE_URI);
});

afterEach(async () => {
  await databaseDisconnector();
});


describe('Projects', () => {
  it('lets you create a project', async () => {
    const response = await request(app).post('/projects').send({
      name: 'A new project',
      description: 'This is a test project',
      createdBy: 'John Smith',
    });
    expect(response.statusCode).toEqual(201);
  });
});
