/* eslint-disable import/no-unresolved */
import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { TabataWorkout } from '../../../mobile/src/types/workouts';
import authenticate, { AuthRequest } from '../middleware/authenticate';

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

// Gets all workouts
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

router.get('/workout/:workoutId', async (req: Request, res: Response) => {
  try {
    const { workoutId } = req.params;

    console.log('workoutId');
    console.log(workoutId);
    const workout = await workoutsCollection.findOne({ _id: new ObjectId(workoutId) });

    if (!workout) {
      res.status(404).send({ message: 'Workout not found.' });
      return;
    }

    res.send(workout);
  } catch (err) {
    console.error('Failed to fetch workout', err);
    res.status(500).send({ message: 'Failed to fetch workout' });
  }
});

// Gets a user's saved workouts
router.get('/my-saved', authenticate, async (req: AuthRequest, res: Response) => {
  const requestingUserId = req.userId;
  const offset = parseInt(req.query.offset as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

  try {
    const savedWorkouts = await workoutsCollection.find({
      userId: requestingUserId,
    })
      .skip(offset)
      .limit(limit)
      .toArray();

    res.send(savedWorkouts);
  } catch (err) {
    console.error('Failed to fetch saved workouts', err);
    res.status(500).send({ message: 'Failed to fetch saved workouts' });
  }
});

router.post('/save', async (req: Request, res: Response) => {
  const { workout } = req.body;

  delete workout._id;

  try {
    await workoutsCollection.insertOne(workout);

    res.status(201).send({ message: 'TabataWorkout saved successfully' });
  } catch (err) {
    console.error('Failed to save workout', err);
    res.status(500).send({ message: 'Failed to save workout' });
  }
});

router.delete('/:workoutId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { workoutId } = req.params;
    const requestingUserId = req.userId;
    const workoutToDelete = await workoutsCollection.findOne(
      {
        _id: new ObjectId(workoutId),
        userId: requestingUserId,
      },
    );

    console.log('requestingUserId');
    console.log(requestingUserId);
    console.log('workoutId');
    console.log(workoutId);

    if (!workoutToDelete) {
      res.status(404).send({ message: 'Workout not found or you do not have permission to delete it.' });
    }

    await workoutsCollection.deleteOne({ _id: new ObjectId(workoutId) });
    res.status(200).send({ message: 'Workout deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete workout', err);
    res.status(500).send({ message: 'Failed to delete workout' });
  }
});

export default router;
