/* eslint-disable import/first */
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import workoutRoutes from './routes/workouts';
import postRoutes from './routes/posts';
import userAuthRoutes from './routes/userAuth';
import usersRoutes from './routes/users';
import followsRoutes from './routes/follows';
import notificationsRoutes from './routes/notifications';
import reportsRoutes from './routes/reports';
import waitlistRoutes from './routes/waitlist';

const app = express();

// Allow requests from your frontend domain
app.use(cors({
  origin: ['http://localhost:3001', 'https://www.tabafit.com'],
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
}));
const port = process.env.PORT || 3000;

// eslint-disable-next-line import/no-relative-packages

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDBÍS
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
app.use('/follows', followsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/reports', reportsRoutes);
app.use('/waitlist', waitlistRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('test!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
