import { Router } from 'express';
import TeamsRoutes from './teams/teams.routes';
import BoardsRoutes from './boards/boards.routes';
import TasksRoutes from './tasks/tasks.routes';

const router = Router();
router.use('/teams', TeamsRoutes);
router.use('/boards', BoardsRoutes);
router.use('/tasks', TasksRoutes);

export default router;