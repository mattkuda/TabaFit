/* eslint-disable import/no-unresolved */
import express, { Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { TabataWorkout } from '../../../mobile/src/types/workouts';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

let workoutsCollection: Collection<TabataWorkout>;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    workoutsCollection = client.db('AbcountableDB').collection<TabataWorkout>('workouts');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await workoutsCollection.aggregate([
      {
        $lookup: {
          from: 'exercises',
          localField: 'exercises',
          foreignField: '_id',
          as: 'exercises',
        },
      },
    ]).toArray();
    res.send(workouts);
  } catch (err) {
    console.error('Failed to fetch workouts', err);
    res.status(500).send({ message: 'Failed to fetch workouts' });
  }
});

router.post('/save', async (req: Request, res: Response) => {
  console.log('in save workout');
  const { workout } = req.body;

  try {
    await workoutsCollection.insertOne(workout);

    res.status(201).send({ message: 'TabataWorkout saved successfully' });
  } catch (err) {
    console.error('Failed to save workout', err);
    res.status(500).send({ message: 'Failed to save workout' });
  }
});

export default router;
