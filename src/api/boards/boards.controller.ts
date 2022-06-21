import { Request, RequestHandler, Response } from 'express';
import { ApiResponse } from '../models/api-response.model';
import { BadRequestError, NotFoundError } from '../models/custom-error.model';
import Board from '../entities/board.entity';
import Column from '../entities/column.entity';
import { IBoard, IGetBoardReq, IAddBoardReq, IUpdateBoardReq, IDeleteBoardReq, IColumn } from './boards.model';
import asyncHandler from 'express-async-handler';


/**
 * Get Board List
 *
 * @param req Express Request
 * @param res Express Response
 */
export const getBoards = asyncHandler(async (req: Request, res: Response) => {
    const boards = await Board.find();
    const boardDtos: IBoard[] = boards.map(c => ({ id: c.id, name: c.name, columns: []}))
    const response = ApiResponse.successData(boardDtos);
    res.send(response);
});

/**
 * Get Board record based on id provided
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const getBoardById: RequestHandler = asyncHandler(async (req: IGetBoardReq, res: Response) => {

    const board = await Board.findById(req.params.id); 

    if (!board) {
        throw new NotFoundError('Board not found');
    }
    const boardDto: IBoard =  { id: board.id, name: board.name, columns: []};
    const response = ApiResponse.successData(boardDto);
    res.send(response);
});

/**
 * Inserts a new Board record based
 *
 * @param req Express Request
 * @param res Express Response
 */
export const addBoard: RequestHandler = asyncHandler(async (req: IAddBoardReq, res: Response) => {
    const { name, columns } = req.body;

    if (!name) {
        throw new BadRequestError('Name is required');  
    }

    const boardExist = await Board.exists({ name });
    if (boardExist) {
        throw new BadRequestError('Name already used');  
    }

    const session = await Board.startSession();
    session.startTransaction();
    const options = { session };

    const board = await Board.create({ name });
    
    let message = 'Board created';
    if (columns && !!columns.length) {
        const validColumns = columns.every(c => !!c.name);

        if (!validColumns) {
            throw new BadRequestError('Column Name is required'); 
        }

        const attachedColumns = columns.map(c => ({ name: c.name, board: board._id}));
        await Column.insertMany(attachedColumns);
        message += ' with Columns';
    }

    const response = ApiResponse.successDataMessage(board.id, message);
    res.send(response);
});

/**
 * Updates existing Board record
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const updateBoardById: RequestHandler = asyncHandler(async (req: IUpdateBoardReq, res: Response) => {
    const { name, columns } = req.body;

    if (!name) {
        throw new BadRequestError('Name is required');  
    }

    if (!columns) {
        throw new BadRequestError('Column(s) required');  
    }

    const validColumns = columns.every(c => !!c.name);
    if (!validColumns) {
        throw new BadRequestError('Column name is required'); 
    }

    const boardExist = await Board.findOne({ _id: { $ne: req.params.id }, name });
    if (boardExist) {
        throw new BadRequestError('Name already used');  
    }
    const session = await Board.startSession();
    session.startTransaction();
    const options = { session };

    const board = await Board.findByIdAndUpdate(req.params.id, { name }, options);
    if (!board) {
        throw new BadRequestError('Board not found');
    }

    if (!!columns.length) {
        const boardColumns = await Column.find({board: board._id}, null, options);
        const columnIds = columns.filter(c => !!c.id).map(c => (c.id));

        const updatedColumns = boardColumns.filter(c => columnIds.includes(c.id));
        const updateQueries: Promise<any>[] = [];
        updatedColumns.forEach(async column => {
            const newColumn = columns.find(c => c.id === column.id);
            if (newColumn.name !== column.name) {
                const query = column.updateOne({ name: newColumn.name}, options).exec();
                updateQueries.push(query);
            }
        });
        await Promise.all(updateQueries);

        const deletedColumns = boardColumns.filter(c => !columnIds.includes(c.id));
        await Column.deleteMany({_id: {$in: deletedColumns.map(c => c._id)}}, options)
        
        const addedColumns = columns.filter(c => !c.id).map(c => ({ name: c.name, board: board._id}));
        await Column.insertMany(addedColumns, options);
    }
    
    await session.commitTransaction();
    await session.endSession();
    const response = ApiResponse.successDataMessage(board.id, 'Board updated with Columns');
    res.send(response);
});

/**
 * deletes a Board
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const deleteBoardById: RequestHandler = asyncHandler(async (req: IDeleteBoardReq, res: Response) => {
    
    const session = await Board.startSession();
    session.startTransaction();
    const options = { session };
    const board = await Board.findById(req.params.id, null, options);
    if (!board) {
        throw new BadRequestError('Board not found');
    }
    const boardColumns = await Column.find({board: board._id});

    await Column.deleteMany({_id: {$in: boardColumns.map(c => c._id)}}, options);
    await board.remove(options);
    const response = ApiResponse.successData(board.id);
    res.send(response);
});
