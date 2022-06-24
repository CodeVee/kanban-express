import { Request } from "express";
import { IColumn } from "../entities/column.entity";
import { ISubtask } from "../entities/subtask.entity";

interface IBaseTask {
  title: string;
  description: string;
  status: string | IColumn;
  subtasks: ISubtask[];
}
interface IReadTask extends IBaseTask {
  id: string;
  status: IColumn
}

interface IUpdateTask {
  title: string;
  description: string;
  status: string;
  subtasks: ISubtask[];
}

interface IGetTasks {
    columns: string[]
}

interface IReadColumn {
    id: string;
    name: string;
    tasks: IReadTask[];
}


interface IGetTaskReq extends Request<{ id: string }> {}
interface IGetTasksReq extends Request<any, any, IGetTasks> {}
interface IAddTaskReq extends Request<any, any, IBaseTask> {}
interface IUpdateTaskReq extends Request<{ id: string }, any, IUpdateTask> {}
interface IDeleteTaskReq extends Request<{ id: string }> {}

export {
  IReadTask,
  IReadColumn,
  ISubtask,
  IGetTaskReq,
  IGetTasksReq,
  IAddTaskReq,
  IUpdateTaskReq,
  IDeleteTaskReq,
};
