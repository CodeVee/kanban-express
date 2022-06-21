import mongoose from 'mongoose';

const { Schema } = mongoose;

const columnSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name value'],
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
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

export default mongoose.model('Column', columnSchema);
