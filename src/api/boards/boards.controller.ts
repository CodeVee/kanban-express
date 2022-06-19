import { Request, RequestHandler, Response } from 'express';
import { ApiResponse } from '../models/api-response.model';
import { BadRequestError, NotFoundError } from '../models/custom-error.model';
import { Board, IBoard, IGetBoardReq, IAddBoardReq, IUpdateBoardReq, IDeleteBoardReq } from './boards.model';
import handler from 'express-async-handler';


export const getBoards = handler(async (req: Request, res: Response) => {
    const boards = await Board.find();
    const boardDtos: IBoard[] = boards.map(c => ({ id: c.id, name: c.name}))
    const response = ApiResponse.successData(boardDtos);
    res.send(response);
});

/**
 * Get active Board records
 *
 * @param req Express Request
 * @param res Express Response
 */
// export const getActiveBoards: RequestHandler = (req: Request, res: Response) => {
//   const activeBoards = BoardS.filter((Board) => Board.isActive);
//   const response = ApiResponse.successData(activeBoards);
//   res.send(response);
// };

/**
 * Get Board record based on id provided
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const getBoardById: RequestHandler = handler(async (req: IGetBoardReq, res: Response) => {

    const board = await Board.findById(req.params.id); 

    if (!board) {
        throw new NotFoundError('Board not found');
    }
    const boardDto: IBoard =  { id: board.id, name: board.name};
    const response = ApiResponse.successData(boardDto);
    res.send(response);
});

/**
 * Inserts a new Board record based
 *
 * @param req Express Request
 * @param res Express Response
 */
export const addBoard: RequestHandler = handler(async (req: IAddBoardReq, res: Response) => {
    const name = req.body.name;

    if (!name) {
        throw new BadRequestError('Name is required');  
    }

    const boardAvailable = await Board.findOne({ name });

    if (boardAvailable) {
        throw new BadRequestError('Name already used');  
    }

    const board = new Board({name});
    await board.save();

    const response = ApiResponse.successData(board.id);
    res.send(response);
});

/**
 * Updates existing Board record
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const updateBoardById: RequestHandler = (req: IUpdateBoardReq, res: Response) => {
//   const currentBoard = BoardS.find(Board => Board.id === +req.params.id && Board.isActive);
//   currentBoard.name = req.body.name || currentBoard.name;
//   currentBoard.league = req.body.league || currentBoard.league;

//   res.send({ success: true });
};

/**
 * deletes a Board
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const deleteBoardById: RequestHandler = (req: IDeleteBoardReq, res: Response) => {
//   const BoardIndex = BoardS.findIndex(Board => Board.id === +req.params.id && Board.isActive);
//   BoardS.splice(BoardIndex, 1);

//   res.send({ success: true });
};
