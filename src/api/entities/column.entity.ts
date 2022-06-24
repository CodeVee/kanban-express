import { Schema, Document, Model, model, Types } from 'mongoose';

export interface IColumn {
  id: string;
  name: string;
}

const ColumnSchema = new Schema<ColumnDocument, ColumnModel>({
  name: {
    type: String,
    required: true,
  },
  board: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Board',
  },
},
{
  timestamps: true,
});

export interface Column {
  name: string;
  board: Types.ObjectId | IColumn;
}

interface ColumnBaseDocument extends Column, Document {
  tasks: Record<string, any> | any[];
}

export interface ColumnDocument extends ColumnBaseDocument {
  status: Types.ObjectId;
}

export interface ColumnPopulatedDocument extends ColumnBaseDocument {
  status: IColumn;
  subColumns: any[];
}

ColumnSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'status',
});

export interface ColumnModel extends Model<ColumnDocument> {
  findFullRecord(id: string): Promise<ColumnPopulatedDocument>;
}

ColumnSchema.statics.findFullRecord = async function (
  this: Model<ColumnDocument>,
  id: string
) {
  return this.findById(id).populate('tasks').exec();
};

export default model<ColumnDocument, ColumnModel>('Column', ColumnSchema);