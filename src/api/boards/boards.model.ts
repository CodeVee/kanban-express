import { Request } from 'express';
import { ISubtask } from '../entities/subtask.entity';

interface IBaseBoard {
    name: string;
    columns: IColumn[];
}
interface IBoard extends IBaseBoard {
    id: string;
};

interface IBoardDto {
  id: string;
  name: string;
}

interface IColumn {
  name: string;
}

interface IUpdateBoard {
  name: string;
  columns: IUpdateColumn[];
}

interface IUpdateColumn extends IColumn {
  id: string
}

interface IReadColumn {
  id: string;
  name: string;
  tasks: IReadTask[];
}

interface IStatus {
  id: string;
  name: string;
}

interface IReadTask {
  id: string;
  title: string;
  description: string;
  status: IStatus;
  subtasks: ISubtask[];
}

interface IGetBoardReq extends Request<{ id: string }> { }
interface IAddBoardReq extends Request<any, any, IBaseBoard> { }
interface IUpdateBoardReq extends Request<{ id: string }, any, IUpdateBoard> { }
interface IDeleteBoardReq extends Request<{ id: string }> { }

export { 
  IBoard, IColumn, IGetBoardReq, IAddBoardReq, IUpdateBoardReq, 
  IDeleteBoardReq , IReadColumn, IReadTask, IBoardDto
}