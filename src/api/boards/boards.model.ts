import { Request } from 'express';

interface IBaseBoard {
    name: string;
    columns: IColumn[];
}
interface IBoard extends IBaseBoard {
    id: string;
};

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

interface IGetBoardReq extends Request<{ id: string }> { }
interface IAddBoardReq extends Request<any, any, IBaseBoard> { }
interface IUpdateBoardReq extends Request<{ id: string }, any, IUpdateBoard> { }
interface IDeleteBoardReq extends Request<{ id: string }> { }

export { IBoard, IColumn, IGetBoardReq, IAddBoardReq, IUpdateBoardReq, IDeleteBoardReq }