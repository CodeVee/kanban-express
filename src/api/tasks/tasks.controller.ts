import { Request, RequestHandler, Response } from 'express';
import { ApiResponse } from '../models/api-response.model';
import { BadRequestError, NotFoundError } from '../models/custom-error.model';
import Task from '../entities/task.entity';
import Subtask from '../entities/subtask.entity';
import Column from '../entities/column.entity';
import { IReadTask, IGetTaskReq, IGetTasksReq, IAddTaskReq, IUpdateTaskReq, IDeleteTaskReq, ISubtask, IReadColumn } from './Tasks.model';
import asyncHandler from 'express-async-handler';


/**
 * Get Task record based on id provided
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const getTasks: RequestHandler = asyncHandler(async (req: IGetTasksReq, res: Response) => {

    const { columns } = req.body;

    const dbColumns = await Column.find({ _id: {$in: columns}});
    
    const columnIds = dbColumns.map(c => c.id as string);

    const tasks = await Task.findColumnsFullRecord(columnIds);

    const taskDtos = tasks.map(task => {
        const { id, title, description, status, subtasks } = task;
        const taskDto: IReadTask =  { 
            id, title, description, 
            status: { 
                id: status.id, 
                name: status.name
            },
            subtasks: subtasks.map(subtask => {
                const {id, title, isCompleted } = subtask;
                return {id, title, isCompleted };
            })
        };
        return taskDto;
    });

    const columnDtos = dbColumns.map(col => {
        const tasks = taskDtos.filter(dto => dto.status.name === col.name);
        return { 
            id: col.id,
            name: col.name, 
            tasks 
        } as IReadColumn;
    })

    
    const response = ApiResponse.successData(columnDtos);
    res.send(response);
});

/**
 * Get Task record based on id provided
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const getTaskById: RequestHandler = asyncHandler(async (req: IGetTaskReq, res: Response) => {

    const task = await Task.findFullRecord(req.params.id); 

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    const { id, title, description, status, subtasks } = task;
    const taskDto: IReadTask =  { 
        id, title, description, 
        status: { 
            id: status.id, 
            name: status.name
        },
        subtasks: subtasks.map(subtask => {
            const {id, title, isCompleted } = subtask;
            return {id, title, isCompleted };
        })
    };
    const response = ApiResponse.successData(taskDto);
    res.send(response);
});

/**
 * Inserts a new Task record based
 *
 * @param req Express Request
 * @param res Express Response
 */
export const addTask: RequestHandler = asyncHandler(async (req: IAddTaskReq, res: Response) => {
    const { title, description, status, subtasks } = req.body;

    if (!title || !status) {
        throw new BadRequestError('title is required');  
    }

    const statusExist = await Column.findById(status);
    if (!statusExist) {
        throw new BadRequestError('Status does not exist');  
    }
    
    const taskExist = await Task.exists({ title, status });
    if (taskExist) {
        throw new BadRequestError('Title already used');  
    }

    const session = await Task.startSession();
    session.startTransaction();
    const options = { session };

    const task = new Task({ title, description, status });
    await task.save(options);

    let message = 'Task created';
    if (subtasks && !!subtasks.length) {
        const validSubtasks = subtasks.every(c => !!c.title);

        if (!validSubtasks) {
            throw new BadRequestError('Subtask title is required'); 
        }

        const attachedSubtasks = subtasks.map(c => ({ title: c.title, task: task._id }));
        await Subtask.insertMany(attachedSubtasks, options);
        message += ' with Subtasks';
    }
    
    
    await session.commitTransaction();
    await session.endSession();
    const response = ApiResponse.successDataMessage(task.id, message);
    res.send(response);
});

/**
 * Updates existing Task record
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const updateTaskById: RequestHandler = asyncHandler(async (req: IUpdateTaskReq, res: Response) => {
    const { title, description, status, subtasks } = req.body;

    if (!title || !status) {
        throw new BadRequestError('title is required');  
    }

    if (!subtasks && !Array.isArray(subtasks)) {
        throw new BadRequestError('Subtask(s) required');  
    }

    const statusExist = await Column.findById(status);
    if (!statusExist) {
        throw new BadRequestError('Status does not exist');  
    }

    const taskExist = await Task.findOne({ _id: { $ne: req.params.id }, title, status });
    if (taskExist) {
        throw new BadRequestError('title already used');  
    }
    const session = await Task.startSession();
    session.startTransaction();
    const options = { session };

    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, status }, options);
    if (!task) {
        throw new BadRequestError('Task not found');
    }

    const validSubtasks = subtasks.every(c => !!c.title);
    if (!validSubtasks) {
        throw new BadRequestError('Subtask title is required'); 
    }

    const taskSubtasks = await Subtask.find({task: task._id}, null, options);
    const subtaskIds = subtasks.filter(c => !!c.id).map(c => (c.id));

    const updatedSubtasks = taskSubtasks.filter(c => subtaskIds.includes(c.id));
    const updateQueries: Promise<any>[] = [];
    updatedSubtasks.forEach(async subtask => {
        const newSubtask = subtasks.find(c => c.id === subtask.id);
        if (newSubtask.title !== subtask.title 
            || newSubtask.isCompleted !== subtask.isCompleted) {
            const query = subtask.updateOne(
                { title: newSubtask.title, isCompleted: newSubtask.isCompleted}, options).exec();
            updateQueries.push(query);
        }
    });
    await Promise.all(updateQueries);

    const deletedSubtasks = taskSubtasks.filter(c => !subtaskIds.includes(c.id));
    await Subtask.deleteMany({_id: {$in: deletedSubtasks.map(c => c._id)}}, options)
    
    const addedSubtasks = subtasks.filter(c => !c.id).map(c => ({ title: c.title, task: task._id}));
    await Subtask.insertMany(addedSubtasks, options);
    
    
    await session.commitTransaction();
    await session.endSession();
    const response = ApiResponse.successDataMessage(task.id, 'Task updated with Subtasks');
    res.send(response);
});

/**
 * deletes a Task
 *
 * @param req Express Request
 * @param res Express Response
 */
// @ts-ignore
export const deleteTaskById: RequestHandler = asyncHandler(async (req: IDeleteTaskReq, res: Response) => {
    
    const session = await Task.startSession();
    session.startTransaction();
    const options = { session };
    const task = await Task.findById(req.params.id, null, options);
    if (!task) {
        throw new BadRequestError('Task not found');
    }

    await Subtask.deleteMany({task: task._id}, options);
    await task.remove(options);

    await session.commitTransaction();
    await session.endSession();
    
    const response = ApiResponse.successData(task.id);
    res.send(response);
});
