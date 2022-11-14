import { Router } from 'express';
import tasksRouter from './tasks.js';
import { getUserByEmail } from '../controllers/usersHelpers.js';
import {
  createProject,
  getAllProjects,
  getOneProject,
  removeOneProject,
  updateProject,
  addMember,
} from '../controllers/projectController.js';

const projectsRouter = Router();

projectsRouter.get('/', getAllProjects);

projectsRouter.post('/', createProject);

projectsRouter.get('/:projectId', getOneProject);

projectsRouter.get('/:projectId/settings', getUserByEmail);

projectsRouter.put('/:projectId/members/new', addMember);

projectsRouter.put('/:projectId', updateProject);

projectsRouter.delete('/:projectId', removeOneProject);

projectsRouter.use('/:projectId/tasks', tasksRouter);

export default projectsRouter;
