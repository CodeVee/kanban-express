import { Request } from 'express';

interface ITeam {
  id: number;
  name: string;
  league: string,
  isActive: boolean
};

interface IGetTeamReq extends Request<{ id: ITeam['id'] }> { }
interface IAddTeamReq extends Request { }
interface IUpdateTeamReq extends Request<{ id: ITeam['id'] }, any, ITeam> { }
interface IDeleteTeamReq extends Request<{ id: ITeam['id'] }> { }

export { ITeam, IGetTeamReq, IAddTeamReq, IUpdateTeamReq, IDeleteTeamReq }