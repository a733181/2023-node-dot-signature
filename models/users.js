import { Schema, model, Error } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, '缺少密碼'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, '缺少信箱'],
      vaildate: {
        validator(email) {
          return validator.isEmail(email);
        },
      },
    },
    tokens: {
      type: [String],
      default: [],
    },
    role: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10);
    } else {
      const error = new Error.ValidationError(null);
      error.addError(
        'password',
        new Error.ValidatorError({ message: '密碼長度錯誤' })
      );
      next(error);
      return;
    }
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update;
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10);
    } else {
      const error = new Error.ValidationError(null);
      error.addError(
        'password',
        new Error.ValidatorError({ message: '密碼長度錯誤' })
      );
      next(error);
      return;
    }
  }
  next();
});

export default model('users', userSchema);
