import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Your email address is required'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Your username is required'],
  },
  password: {
    type: String,
    required: [true, 'Your password is required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.pre<IUser>('save', async function saveUser(next: any): Promise<void> {
  const user = this as IUser;
  if (!user.isModified('password')) {
    next();
    return;
  }
  user.password = await bcrypt.hash(user.password, 12);
  next();
});

const User: Model<IUser> = mongoose.model<IUser>('users', userSchema);

export default User;
