import { Router } from 'express';
import tasksRouter from './tasks.js';
import {
  createProject,
  getAllProjects,
  getOneProject,
  removeOneProject,
  updateProject,
} from '../controllers/projectController.js';

const projectsRouter = Router();

projectsRouter.get('/', getAllProjects);

projectsRouter.post('/', createProject);

projectsRouter.get('/:projectId', getOneProject);

projectsRouter.put('/:projectId', updateProject);

projectsRouter.delete('/:projectId', removeOneProject);

projectsRouter.use('/:projectId/tasks', tasksRouter)

export default projectsRouter;
