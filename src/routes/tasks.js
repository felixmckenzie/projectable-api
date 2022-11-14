import { Router } from 'express';
import commentsRouter from './comments.js';
import {
  createTask,
  getAllProjectTasks,
  getAllAssignedTasks,
  getOneTask,
  updateTask,
  deleteOneTask,
} from '../controllers/tasksController.js';
const tasksRouter = Router({ mergeParams: true });

tasksRouter.get('/', getAllProjectTasks);

tasksRouter.get('/', getAllAssignedTasks);

tasksRouter.post('/', createTask);

tasksRouter.get('/:taskId', getOneTask);

tasksRouter.put('/:taskId', updateTask);

tasksRouter.delete('/:taskId', deleteOneTask);

tasksRouter.use('/:taskId/comments', commentsRouter);

export default tasksRouter;
