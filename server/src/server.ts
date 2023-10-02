/* eslint-disable import/first */
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import workoutRoutes from './routes/workouts';
import postRoutes from './routes/posts';
import userAuthRoutes from './routes/userAuth';
import usersRoutes from './routes/users';

const app = express();
const port = 3000;

// eslint-disable-next-line import/no-relative-packages

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

app.use(cookieParser());
app.use(express.json());
app.use('/', userAuthRoutes);
app.use('/workouts', workoutRoutes);
app.use('/posts', postRoutes);
app.use('/users', usersRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('test!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
