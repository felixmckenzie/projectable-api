import { Router } from 'express';
import logger from '../config/logger.js';
import { createProject } from '../controllers/projectController';

const projectsRouter = Router();

projectsRouter.post('/projects', async (req, res) => {
  try {
    const newProject = await createProject({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.body.createdBy,
    });
    res.status(201).json(newProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
});

export default projectsRouter;
