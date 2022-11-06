import { Router } from 'express';
import {
  createComment,
  getAllComments,
  getOneComment,
  updateComment,
  deleteComment,
} from '../controllers/commentsController.js';
const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/', getAllComments);
commentsRouter.post('/', createComment);
commentsRouter.get('/:commentId', getOneComment);
commentsRouter.put('/:commentId', updateComment);
commentsRouter.delete('/:commentId', deleteComment);

export default commentsRouter;
