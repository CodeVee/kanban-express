import { Router } from 'express';
import * as Controller from './tasks.controller';

const router = Router();

router.route('/')
    .post(Controller.addTask);

router.route('/bycolumns')
    .post(Controller.getTasks)


router.route('/:id')
    .get(Controller.getTaskById)
    .patch(Controller.updateTaskById)
    .delete(Controller.deleteTaskById);

export default router;