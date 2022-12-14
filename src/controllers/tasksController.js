import { Task } from '../models/TaskSchema.js';
import { Project } from '../models/ProjectSchema.js';
import logger from '../config/logger.js';

export async function createTask(req, res) {
  try {
    const taskDetails = {
      brief: req.body.brief,
      description: req.body.description,
      createdBy: req.user.username,
      priority: req.body.priority,
      deadline: req.body.deadline,
      userId: req.user.uid,
      projectId: req.params.projectId,
    };
    const newTask = await Task.create(taskDetails);

    const projectToUpdate = await Project.findByIdAndUpdate(
      { _id: newTask.projectId },
      {
        $push: { tasks: newTask },
      },
      { new: true }
    );

    if (!projectToUpdate) {
      throw new Error('Project to update not found');
    }

    res.status(201).json({ task: newTask, project: projectToUpdate });
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getAllProjectTasks(req, res) {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    })
      .lean()
      .exec();

    res.status(200).json(tasks);
  } catch (error) {
    logger.info(error.messge);
    res.status(400).end();
  }
}

export async function getAllAssignedTasks(req, res) {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.uid,
    });

    res.status(200).json(tasks);
  } catch (error) {
    logger.info(error.message);
  }
}

export async function getOneTask(req, res) {
  try {
    const task = await Task.findById(req.params.taskId).populate('comments');
    res.status(200).json(task);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function updateTask(req, res) {
  try {
    const taskToUpdate = await Task.findByIdAndUpdate(
      {
        _id: req.params.taskId,
      },
      {
        ...req.body,
      },
      { new: true, upsert: true }
    );
    res.status(200).json(taskToUpdate);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function deleteOneTask(req, res) {
  try {
    const removed = await Task.findOneAndRemove({
      _id: req.params.taskId,
    });

    res.status(200).json(removed);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
