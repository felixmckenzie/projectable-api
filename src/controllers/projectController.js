import { Project } from '../models/ProjectSchema.js';

export async function createProject(projectDetails) {
  try {
    const newProject = new Project({
      name: projectDetails.name,
      description: projectDetails.description,
      createdBy: projectDetails.createdBy,
    });
    const savedProject = await newProject.save();
    return savedProject;
  } catch (error) {
    return { error: error.message };
  }
}

export async function getAllProjects(userId) {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: { userId: userId } }],
    });

    return projects;
  } catch (error) {
    return { error: error.message };
  }
}

export async function getOneProject(projectId, userId) {
  try {
    const project = await Project.findOne({
      _id: projectId,
      createdBy: userId,
    })
      .populate('tasks')
      .populate('members');

    return project;
  } catch (error) {
    return { error: error.message };
  }
}

export async function removeOneProject(projectId, userId) {
  try {
    const removed = await Project.findOneAndRemove({
      _id: projectId,
      createdBy: userId,
    });
    return removed;
  } catch (error) {
    return { error: error.message };
  }
}
