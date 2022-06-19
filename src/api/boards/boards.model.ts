import mongoose from 'mongoose';
import { Request } from 'express'

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name value'],
      unique: true
    },
  },
  {
    timestamps: true,
  }
);
  
const Board =  mongoose.model('Board', boardSchema);

interface IBaseBoard {
    name: string;
}
interface IBoard extends IBaseBoard {
    id: string;
};

interface IGetBoardReq extends Request<{ id: string }> { }
interface IAddBoardReq extends Request<any, any, IBaseBoard> { }
interface IUpdateBoardReq extends Request<{ id: string }, any, any> { }
interface IDeleteBoardReq extends Request<{ id: string }> { }

export { Board, IBoard, IGetBoardReq, IAddBoardReq, IUpdateBoardReq, IDeleteBoardReq }