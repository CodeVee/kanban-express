import { Router } from 'express';
import TeamsRoutes from './teams/teams.routes';
import BoardsRoutes from './boards/boards.routes';

const router = Router();
router.use('/teams', TeamsRoutes);
router.use('/boards', BoardsRoutes);

export default router;