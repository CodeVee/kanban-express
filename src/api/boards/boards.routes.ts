import { Router } from 'express';
import * as Controller from './boards.controller';

const router = Router();

router.route('/')
    .get(Controller.getBoards)
    .post(Controller.addBoard);


router.route('/:id')
    .get(Controller.getBoardById)
    .patch(Controller.updateBoardById)
    .delete(Controller.deleteBoardById);

export default router;