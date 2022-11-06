import { Router } from 'express';
import {
  createComment,
  getAllComments,
  getOneComment,
  updateComment,
  deleteComment,
} from '../controllers/commentsController.js';
const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/');
commentsRouter.post('/');
commentsRouter.get('/:commentId');
commentsRouter.put('/:commentId');
commentsRouter.delete('/:commentId');

export default commentsRouter;
