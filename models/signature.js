import { Schema, model, ObjectId } from 'mongoose';

const signatureSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少使用者 ID'],
    },
    signature: {
      type: Buffer,
      required: [true, '缺少簽名'],
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

export default model('signature', signatureSchema);
