import { Router } from 'express';
import logger from '../config/logger.js';
import {
  createProject,
  getAllProjects,
  getOneProject,
  removeOneProject,
  updateProject,
} from '../controllers/projectController.js';

const projectsRouter = Router();

projectsRouter.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects(req.userId);
    res.status(200).json(projects);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
});

projectsRouter.post('/', async (req, res) => {
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

projectsRouter.get('/:projectId', async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.projectId;
  try {
    const project = await getOneProject(userId, projectId);
    res.status(200).json(project);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
});

projectsRouter.put('/:projectId', async (req, res) => {
  try {
    const updatedProject = await updateProject({
      projectId: req.params.projectId,
      name: req.body.name,
      description: req.body.description,
      tasks: req.body.tasks,
      members: req.body.members,
      createdBy: req.body.createdBy,
    });
    res.status(200).json(updateProject);
  } catch (error) {
    res.status(400).end();
  }
});

projectsRouter.delete('/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.userId;
  try {
    const removed = await removeOneProject(projectId, userId);
    res.status(200).json(removed);
  } catch (error) {
    res.status(400).end();
  }
});

export default projectsRouter;
