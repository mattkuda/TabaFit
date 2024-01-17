/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-unresolved */
import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import authenticate, { AuthRequest } from '../middleware/authenticate';
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
    console.log('Connected to MongoDB');
    workoutsCollection = client.db('AbcountableDB').collection<TabataWorkout>('workouts');
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
    console.error('Error fetching user info for workout', error);
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
      .skip(offset)
      .limit(limit)
      .toArray();
    const workoutsWithUserInfo = await addUserInfoToWorkouts(workouts);
    res.send(workoutsWithUserInfo);
  } catch (err) {
    console.error('Failed to fetch workouts', err);
    res.status(500).send({ message: 'Failed to fetch workouts' });
  }
});
router.get('/workout/:workoutId', async (req: Request, res: Response) => {
  try {
    const { workoutId } = req.params;
    const workout = await workoutsCollection.findOne({ _id: new ObjectId(workoutId) });

    if (!workout) {
      res.status(404).send({ message: 'Workout not found.' });
      return;
    }

    const workoutWithUserInfo = await addUserInfoToWorkouts([workout]);
    res.send(workoutWithUserInfo[0]);
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

    const savedWorkoutsWithUserInfo = await addUserInfoToWorkouts(savedWorkouts);
    res.send(savedWorkoutsWithUserInfo);
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

router.put('/:workoutId', authenticate, async (req: AuthRequest, res: Response) => {
  const { workoutId } = req.params;
  const workoutData = req.body;
  const requestingUserId = req.userId;

  console.log(workoutId);

  // Remove the _id field from the workoutData
  delete workoutData._id;

  try {
    const updatedWorkout = await workoutsCollection.findOneAndUpdate(
      { _id: new ObjectId(workoutId), userId: requestingUserId },
      { $set: workoutData },
      { returnDocument: 'after' },
    );

    if (!updatedWorkout.value) {
      res.status(404).send({ message: 'Workout not found or not owned by user.' });
      return;
    }

    res.send(updatedWorkout.value);
  } catch (err) {
    console.error('Failed to update workout', err);
    res.status(500).send({ message: 'Failed to update workout' });
  }
});

export default router;
