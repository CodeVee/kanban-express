import { Schema, Document, Model, model, Types } from 'mongoose';
import { IColumn } from './column.entity';
import { ISubtask } from './subtask.entity';

const TaskSchema = new Schema<TaskDocument, TaskModel>({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Column',
  },
},
{
  timestamps: true,
});

export interface Task {
  title: string;
  description?: string;
  status: Types.ObjectId | IColumn;
}

interface TaskBaseDocument extends Task, Document {
  subtasks: Record<string, any> | ISubtask[];
}

export interface TaskDocument extends TaskBaseDocument {
  status: Types.ObjectId;
}

export interface TaskPopulatedDocument extends TaskBaseDocument {
  status: IColumn;
  subtasks: ISubtask[];
}

TaskSchema.virtual('subtasks', {
  ref: 'Subtask',
  localField: '_id',
  foreignField: 'task',
});

export interface TaskModel extends Model<TaskDocument> {
  findFullRecord(id: string): Promise<TaskPopulatedDocument>;
  findColumnsFullRecord(ids: string[]): Promise<TaskPopulatedDocument[]>;
}

TaskSchema.statics.findFullRecord = async function (
  this: Model<TaskDocument>,
  id: string
) {
  return this.findById(id).populate('status').populate('subtasks').exec();
};

TaskSchema.statics.findColumnsFullRecord = async function (
  this: Model<TaskDocument>,
  ids: string[]
) {
  return this.find({status: {$in: ids}}).populate('status').populate('subtasks').exec();
};

export default model<TaskDocument, TaskModel>('Task', TaskSchema);
