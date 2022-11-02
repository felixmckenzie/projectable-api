import { Project } from '../models/ProjectSchema.js';

export async function createProject(projectDetails) {
  const newProject = new Project({
    name: projectDetails.name,
    description: projectDetails.description,
    createdBy: projectDetails.createdBy,
  });

  const savedProject = await newProject.save();

  return savedProject;
}

export async function getAllProjects(userId) {
  const projects = await Project.find({
    $or: [{ createdBy: userId }, { members: { userId: userId } }],
  })
   
  return projects;
}


