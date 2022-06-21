import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title value'],
    },
    description: String,
    status: {
      type: Schema.Types.ObjectId,
      ref: 'Column',
    },
    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subtask',
      },
    ],
  },
  {
    timestamps: true,
    query: {
      byTitle(title) {
        return this.where({ title: new RegExp(title, 'i') });
      },
    },
  }
);

export default mongoose.model('Task', taskSchema);
