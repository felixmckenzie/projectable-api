import { Project } from '../models/ProjectSchema.js';
import { Task } from '../models/TaskSchema.js';
import logger from '../config/logger.js';

export async function createProject(req, res) {
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.username,
      userId: req.user.uid,
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
      $or: [{ userId: req.user.uid }, { members: { userId: req.user.uid } }],
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
      $or: [{ userId: req.user.uid }, { members: { userId: req.user.uid } }],
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
        ...req.body,
      },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function addMember(req, res) {
  try {
    const email = req.body.email;
    const username = req.body.displayName;
    const uid = req.body.uid;
    const member = {
      email: email,
      username: username,
      uid: uid,
    };
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: req.params.projectId },
      {
        $push: { members: member },
      }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function removeMember(req, res) {
  try {
    const member = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: req.params.projectId },
      { $pull: { members: { uid: member.uid } } },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function removeOneProject(req, res) {
  try {
    const projectToRemove = await Project.findOne({
      _id: req.params.projectId,
    }).populate('tasks');

    for (const task of projectToRemove.tasks) {
      task.delete();
    }
    projectToRemove.delete();
    res.status(200).json(projectToRemove);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
