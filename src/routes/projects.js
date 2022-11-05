import { Router } from 'express';
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

export default projectsRouter;
