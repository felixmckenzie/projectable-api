import { Router } from 'express';
import logger from '../config/logger.js';
import { createProject, getAllProjects} from '../controllers/projectController.js';

const projectsRouter = Router();

projectsRouter.get('/', async (req, res)=>{
    try {
       const projects = await getAllProjects(req.userId)
        res.status(200).json(projects)
    } catch(error){
        logger.info(error.message)
        res.status(400).end()
    }
})

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

export default projectsRouter;
