/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */
import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { TabataWorkout, TabataWorkoutWithUserInfo } from '../../../mobile/src/types/workouts';
import { User } from '../../../mobile/src/types/users';

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
    workoutsCollection = client.db('AbcountableDB').collection<TabataWorkout>('premadeWorkouts');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

const addUserInfoToWorkouts = async (workouts: TabataWorkout[]):
 Promise<TabataWorkoutWithUserInfo[]> => Promise.all(workouts.map(async (workout) => {
  try {
    const user = await client.db('AbcountableDB').collection<User>('users').findOne({ _id: new ObjectId(workout.userId) });

    if (!user) {
      return {
        ...workout,
        user: {
          username: 'Unknown',
          firstName: 'N/A',
          lastName: 'N/A',
          profilePictureUrl: 'default_image_url', // Replace with actual default image URL if applicable
        },
      };
    }

    return {
      ...workout,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching user info for premade workout', error);
    return {
      ...workout,
      user: {
        username: 'Error',
        firstName: 'N/A',
        lastName: 'N/A',
        profilePictureUrl: 'error_image_url', // Replace with actual error image URL if applicable
      },
    };
  }
}));

// Gets all workouts
router.get('/', async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string, 10);
    const limit = parseInt(req.query.limit as string, 10);
    const workouts = await workoutsCollection.find({})
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
    const workoutsWithUserInfo = await addUserInfoToWorkouts(workouts);
    res.send(workoutsWithUserInfo);
  } catch (err) {
    console.error('Failed to fetch premade workouts', err);
    res.status(500).send({ message: 'Failed to fetch premade workouts' });
  }
});

router.get('/workout/:workoutId', async (req: Request, res: Response) => {
  try {
    const { workoutId } = req.params;
    const workout = await workoutsCollection.findOne({ _id: new ObjectId(workoutId) });

    if (!workout) {
      res.status(404).send({ message: 'Premade workout not found.' });
      return;
    }

    const workoutWithUserInfo = await addUserInfoToWorkouts([workout]);
    res.send(workoutWithUserInfo[0]);
  } catch (err) {
    console.error('Failed to fetch premade workout', err);
    res.status(500).send({ message: 'Failed to fetch premade workout' });
  }
});

export default router;
