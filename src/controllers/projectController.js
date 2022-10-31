import { Project } from '../models/ProjectSchema';


export async function createProject(projectDetails) {
  const newProject = new Project({
    name: projectDetails.name,
    description: projectDetails.description,
    createdBy: projectDetails.createdBy,
  });

  const savedProject = await newProject.save();

  return savedProject;
}
