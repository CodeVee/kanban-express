import mongoose from 'mongoose';

const { Schema } = mongoose;

const subtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title value'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    query: {
      byName(name) {
        return this.where({ name: new RegExp(name, 'i') });
      },
    },
  }
);

export default mongoose.model('Subtask', subtaskSchema);
