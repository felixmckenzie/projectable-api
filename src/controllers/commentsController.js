import { Comment } from '../models/CommentSchema.js';
import { Task } from '../models/TaskSchema.js';
import logger from '../config/logger.js';

export async function createComment(req, res) {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      task: req.params.taskId,
      createdBy: req.userId,
    });

    const taskToUpdate = await Task.findByIdAndUpdate(
      { _id: newComment.task },
      {
        $push: { comments: newComment },
      },
      { new: true }
    );

    if (!taskToUpdate) {
      throw new Error('Task to update not found');
    }

    res.status(201).json(newComment);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getAllComments(req, res) {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    });

    res.status(200).json(comments);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function getOneComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    res.status(200).json(comment);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function updateComment(req, res) {
  try {
    const commentToUpdate = await Comment.findByIdAndUpdate(
      { _id: req.params.commentId },
     { ...req.body},
      { new: true }
    );
    res.status(200).json(commentToUpdate);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}

export async function deleteComment(req, res) {
  try {
    const removed = await Comment.findOneAndRemove({
      _id: req.params.commentId,
    });
    res.status(200).json(removed);
  } catch (error) {
    logger.info(error.message);
    res.status(400).end();
  }
}
