import express, { NextFunction, Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import createSecretToken from '../util/createSecretToken';
import { IUser } from '../models/UserModel';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

let usersCollection: Collection<IUser>;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    usersCollection = client.db('AbcountableDB').collection<IUser>('users');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const {
      email, password, username, createdAt,
    } = req.body;
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      username,
      createdAt,
    } as IUser);
    const token = createSecretToken(result.insertedId.toString());

    const user = await usersCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({
      message: 'User signed in successfully',
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.error('LOGIN');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: 'All fields are required' });
    }
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }
    // eslint-disable-next-line no-underscore-dangle
    const token = createSecretToken(user._id.toString());
    return res.status(201).json({ message: 'User logged in successfully', success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    next();
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ status: false });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, decodedData: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(decodedData);
        }
      });
    });

    const user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(data.id) });
    if (user) {
      return res.json({ status: true, user: user.username });
    }
    return res.json({ status: false });
  } catch (error) {
    return res.json({ status: false });
  }
});

export default router;
