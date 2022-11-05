import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getOneTask,
} from '../controllers/tasksController';
const tasksRouter = Router({ mergeParams: true });

tasksRouter.get('/', getAllTasks);

tasksRouter.post('/', createTask);

tasksRouter.get('/:taskId', getOneTask);

tasksRouter.put('/:taskId');

tasksRouter.delete('/:taskId');

export default tasksRouter;
