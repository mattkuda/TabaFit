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

router.post('/save', async (req: AuthRequest, res: Response) => {
  const { workout } = req.body;
  const { userId } = req;

  delete workout._id;
  workout.userId = userId;

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
    const { userId } = req;
    const workoutToDelete = await workoutsCollection.findOne(
      {
        _id: new ObjectId(workoutId),
        userId: requestingUserId,
      },
    );

    if (!workoutToDelete) {
      res.status(404).send({ message: 'Workout not found or you do not have permission to delete it.' });
      return;
    }

    if (workoutToDelete?.userId !== userId) {
      res.status(403).send({ message: 'You do not have permission to delete this workout.' });
      return;
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
  const { userId } = req;
  delete workoutData._id;

  try {
    // First, find the workout to check ownership
    const workout = await workoutsCollection.findOne({ _id: new ObjectId(workoutId) });
    if (!workout) {
      res.status(404).send({ message: 'Workout not found' });
      return;
    }

    // Check if the authenticated user is the owner of the workout
    if (workout.userId.toString() !== userId) {
      res.status(403).send({ message: 'Not authorized to update this workout' });
      return;
    }

    // If the check passes, proceed to update the workout
    const updatedWorkout = await workoutsCollection.findOneAndUpdate(
      { _id: new ObjectId(workoutId) },
      { $set: workoutData },
      { returnDocument: 'after' },
    );

    if (!updatedWorkout.value) {
      res.status(404).send({ message: 'Unable to update workout.' });
      return;
    }

    res.send(updatedWorkout.value);
  } catch (err) {
    console.error('Failed to update workout', err);
    res.status(500).send({ message: 'Failed to update workout' });
  }
});

const SUGGESTED_WORKOUT_IDS = ['6584d7972b6663ce1eb2cce8', '6584d7a12b6663ce1eb2cce9'];

// Endpoint to get suggested workouts
router.get('/suggested', async (req: Request, res: Response) => {
  try {
    // Convert string IDs to ObjectId instances for MongoDB querying
    const idsToFetch = SUGGESTED_WORKOUT_IDS.map((id: string) => new ObjectId(id));

    // Fetch workouts with the specified IDs
    const suggestedWorkouts = await workoutsCollection.find({
      _id: { $in: idsToFetch },
    }).toArray();

    // Optionally, add user info to these workouts if needed
    const suggestedWorkoutsWithUserInfo = await addUserInfoToWorkouts(suggestedWorkouts);

    res.send(suggestedWorkoutsWithUserInfo);
  } catch (err) {
    console.error('Failed to fetch suggested workouts', err);
    res.status(500).send({ message: 'Failed to fetch suggested workouts' });
  }
});

export default router;
