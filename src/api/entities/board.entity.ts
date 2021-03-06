import mongoose from 'mongoose';

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name value'],
      unique: true,
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Board', boardSchema);
