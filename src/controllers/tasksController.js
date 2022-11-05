import { Task } from '../models/TaskSchema.js';
import { Project } from '../models/ProjectSchema.js';

export async function createTask(taskDetails) {
  try {
    const newTask = await Task.create(taskDetails);
    const projectToUpdate = await Project.findByIdAndUpdate(
      newTask.projectId,
      {
        $push: { tasks: newTask },
      },
      { new: true }
    );

    if(!projectToUpdate){
        throw new Error("Project to update not found")
    }

    return newTask;
  } catch (error) {
    return {error: error.message}
  }
}

export async function getAllTasks(userId) {}

export async function getOneTask() {}

export async function updateTask() {}

export async function deleteOneTask() {}
