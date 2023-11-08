import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import createSecretToken from '../util/createSecretToken';

interface IUser {
  email: string;
  password: string;
  username: string;
  createdAt: Date;
  _id: string;
}

// eslint-disable-next-line import/prefer-default-export
export const signup = async (req: Request, res: Response, next: NextFunction):
Promise<Response | void> => {
  try {
    const {
      email, password, username, createdAt,
    }: IUser = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: 'User already exists' });
    }
    const user = await User.create({
      email, password, username, createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie('token', token, {
      sameSite: 'strict',
      httpOnly: false,
    });
    return res
      .status(201)
      .json({ message: 'User signed in successfully', success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    next();
  }
};
