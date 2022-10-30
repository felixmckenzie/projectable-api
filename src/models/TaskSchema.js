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
    createdBy: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('task', taskSchema);
