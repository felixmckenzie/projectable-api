import express from 'express';
import cors from './config/cors.js';
import routes from './routes/index.js';

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Projects router:
app.use('/projects', routes.projectsRouter);
// Tasks router:
app.use('/tasks', routes.tasksRouter);
// Comments router
app.use('/comments', routes.commentsRouter)

export const PORT = process.env.PORT || 3000;
export const HOST = '0.0.0.0';

export default app;
