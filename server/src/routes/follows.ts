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

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    followsCollection = client.db('AbcountableDB').collection('follows');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

// TODO Finish this:
const addUserInfoToFollows = async (follows: any[]) => Promise.all(
  follows.map(async (follow) => {
    // Assuming you want to enrich the follower's user info
    const userId = follow.followerId || follow.followeeId;
    const user = await client.db('AbcountableDB').collection<User>('users').findOne({ _id: userId });

    return {
      ...follow,
      userInfo: {
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePictureUrl: user?.profilePictureUrl,
      },
    };
  }),
);

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
  console.log('GET /:userId/followers');
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  console.log('userId', userId);
  console.log('offset', offset);
  console.log('limit', limit);

  try {
    const query = {
      followeeId: userId,
      ...(req.query.followerId
         && { followerId: new mongoose.Types.ObjectId(req.query.followerId as string) }),
    };
    const followers = await followsCollection.find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    console.log('followers', followers);

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

    const following = await followsCollection.find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    res.status(200).send(following);
  } catch (err) {
    console.error('Failed to fetch following', err);
    res.status(500).send({ message: 'Failed to fetch following' });
  }
});

export default router;
