import express from 'express';
import logger from './logger.js';
import routes from './routes/index.js';

export function startServer(PORT, HOST) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Projects router:
  app.use('/projects', routes.projectsRouter);
  // Tasks router:
  app.use('/tasks', routes.tasksRouter);
  // Comments router
  app.use('/comments', routes.commentsRouter)

  app.listen(PORT, HOST, (error) => {
    if (error) {
      return logger.error(error.message);
    }

    logger.info(`Server listening on port ${PORT}`);
  });
}

export const PORT = process.env.PORT || 3000;
export const HOST = '0.0.0.0';
