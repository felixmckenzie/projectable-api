import { Project } from '../models/ProjectSchema.js';
import logger from '../config/logger.js';

export async function createProject(req, res) {
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.userId,
    });
    const savedProject = await newProject.save();
    return res.status(201).json(savedProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.userId }, { members: { userId: req.userId } }],
    });

    res.status(200).json(projects);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getOneProject(req, res) {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.userId,
    })
      .populate('tasks')
      .populate('members');

    res.status(200).json(project);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function updateProject(req, res) {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      {
        _id: req.params.projectId,
      },
      {
        _id: req.params.projectId,
        name: req.body.name,
        description: req.body.description,
        tasks: req.body.tasks,
        members: req.body.members,
        createdBy: req.body.createdBy,
      },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function removeOneProject(req, res) {
  try {
    const removed = await Project.findOneAndRemove({
      _id: req.params.projectId,
      createdBy: req.userId,
    });
    res.status(200).json(removed);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
