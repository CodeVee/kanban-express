import { Router } from 'express';
import * as Controller from './teams.controller';
import * as Auth from './../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .get(Auth.authorizeSecret, Controller.getTeams)
    .post(Auth.authorizeKey(['addTeams']), Controller.addTeam);


router.route('/:id')
    .get(Auth.authorizeKey(['getTeams']), Controller.getTeamById)
    .patch(Auth.authorizeKey(['updateTeams']), Controller.updateTeamById)
    .delete(Auth.authorizeKey(['deleteTeams']), Controller.deleteTeamById);

export default router;