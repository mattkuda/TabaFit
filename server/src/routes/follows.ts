import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import authenticate from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const client = new MongoClient(connectionString);

let followsCollection: Collection;
let usersCollection: Collection;

(async () => {
  try {
    await client.connect();
    followsCollection = client.db('AbcountableDB').collection('follows');
    usersCollection = client.db('AbcountableDB').collection('users');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

// Endpoint to follow a user
router.post('/follow', authenticate, async (req: Request, res: Response) => {
  const { followerId, followeeId } = req.body;

  try {
    // Check if the follow relationship already exists
    const existingFollow = await followsCollection.findOne({
      followerId: new ObjectId(followerId),
      followeeId: new ObjectId(followeeId),
    });

    if (existingFollow) {
      res.status(400).send({ message: 'Already following this user' });
      return;
    }

    await followsCollection.insertOne({
      followerId: new ObjectId(followerId),
      followeeId: new ObjectId(followeeId),
      createdDate: new Date(),
    });

    res.status(200).send({ message: 'Followed successfully' });
  } catch (err) {
    console.error('Failed to follow user', err);
    res.status(500).send({ message: 'Failed to follow user' });
  }
});

// Endpoint to unfollow a user
router.delete('/unfollow', authenticate, async (req: Request, res: Response) => {
  const { followerId, followeeId } = req.body;

  try {
    // Check if the follow relationship exists
    const existingFollow = await followsCollection.findOne({
      followerId: new ObjectId(followerId),
      followeeId: new ObjectId(followeeId),
    });

    if (!existingFollow) {
      res.status(400).send({ message: 'Not following this user' });
      return;
    }

    await followsCollection.deleteOne({
      followerId: new ObjectId(followerId),
      followeeId: new ObjectId(followeeId),
    });

    res.status(200).send({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error('Failed to unfollow user', err);
    res.status(500).send({ message: 'Failed to unfollow user' });
  }
});

// Endpoint to get a list of followers for a user, with pagination
router.get('/:userId/followers', async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const query = {
      followeeId: userId,
      ...(req.query.followerId
        && { followerId: new mongoose.Types.ObjectId(req.query.followerId as string) }),
    };
    const followerDocuments = await followsCollection.find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    const followers = await Promise.all(followerDocuments.map(async (doc) => {
      const user = await usersCollection.findOne({ _id: doc.followerId });
      return user;
    }));

    res.status(200).send(followers);
  } catch (err) {
    console.error('Failed to fetch followers', err);
    res.status(500).send({ message: 'Failed to fetch followers' });
  }
});

// Endpoint to get a list of users a user is following, with pagination
router.get('/:userId/following', async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const query = {
      followerId: userId,
      ...(req.query.followeeId
        && { followeeId: new mongoose.Types.ObjectId(req.query.followeeId as string) }),
    };

    const followingDocuments = await followsCollection.find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    const following = await Promise.all(followingDocuments.map(async (doc) => {
      const user = await usersCollection.findOne({ _id: doc.followeeId });
      return user;
    }));

    res.status(200).send(following);
  } catch (err) {
    console.error('Failed to fetch following', err);
    res.status(500).send({ message: 'Failed to fetch following' });
  }
});

// Endpoint to follow multiple users
router.post('/followAll', authenticate, async (req: Request, res: Response) => {
  const { followerId } = req.body;

  if (!followerId) {
    res.status(400).send({ message: 'User ID is required' });
    return;
  }

  try {
    const usersToFollow = await usersCollection.find(
      { _id: { $ne: new ObjectId(followerId) } },
    ).toArray();

    const followOps = usersToFollow.map((user) => ({
      updateOne: {
        filter: { followerId: new ObjectId(followerId), followeeId: new ObjectId(user._id) },
        update: {
          $setOnInsert: {
            followerId: new ObjectId(followerId),
            followeeId: new ObjectId(user._id),
            createdDate: new Date(),
          },
        },
        upsert: true, // Ensures we don't insert duplicates
      },
    }));

    await followsCollection.bulkWrite(followOps);

    res.status(200).send({ message: `Successfully followed ${usersToFollow.length} users.` });
  } catch (err) {
    console.error('Failed to follow all users', err);
    res.status(500).send({ message: 'Failed to follow all users' });
  }
});

export default router;
