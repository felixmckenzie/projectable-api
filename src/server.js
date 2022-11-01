import express from 'express';
import cors from './config/cors.js';
import routes from './routes/index.js';
import 'dotenv/config';
import { databaseConnector } from './database.js';
import logger from './config/logger.js';

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  const DATABASE_URI =
    process.env.DATABASE_URI || 'mongodb://localhost:27017/projectable';
  try {
    databaseConnector(DATABASE_URI);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(error.message);
  }
}

// Users routes:
app.use('/users', routes.usersRouter);
// Projects router:
app.use('/projects', routes.projectsRouter);
// Tasks router:
app.use('/tasks', routes.tasksRouter);
// Comments router
app.use('/comments', routes.commentsRouter);

export const PORT = process.env.PORT || 3000;
export const HOST = '0.0.0.0';

export default app;
