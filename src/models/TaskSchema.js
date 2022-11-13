import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    brief: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    deadline: {
      type: Date,
    },
    assignedTo: {
      type: String,
    },
    priority:{
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
  },
  { timestamps: true }
);

export const Task = mongoose.model('task', taskSchema);
