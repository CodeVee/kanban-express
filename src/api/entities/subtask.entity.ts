import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

const subtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Subtask', subtaskSchema);
