/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response } from 'express';
import workoutRoutes from './routes/workouts';

const app = express();
const port = 3000;

app.use('/workouts', workoutRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('test!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
