import { Router } from 'express';
import { createTask } from '../controllers/tasksController';
import logger from '../config/logger';
const tasksRouter = Router({ mergeParams: true });

tasksRouter.get('/');

tasksRouter.post('/', async (req, res) => {
  try {
    const newTask = await createTask({
      brief: req.body.brief,
      description: req.body.description,
      createdBy: req.userId,
      projectId: req.params.projectId,
    });
    res.status(201).json(newTask);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
});

tasksRouter.get('/:taskId');

tasksRouter.put('/:taskId');

tasksRouter.delete('/:taskId');

export default tasksRouter;
