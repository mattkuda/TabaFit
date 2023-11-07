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

// Endpoint to get a list of followers for a user, with optional filtering by followerId
router.get('/:userId/followers', async (req: Request, res: Response) => {
  console.log('followers');
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const followerId = req.query.followerId
    ? new mongoose.Types.ObjectId(req.query.followerId as string) : undefined;

  try {
    const query = { followeeId: userId, followerId };
    const followers = await followsCollection.find(query).toArray();
    res.status(200).send(followers);
  } catch (err) {
    console.error('Failed to fetch followers', err);
    res.status(500).send({ message: 'Failed to fetch followers' });
  }
});

// Endpoint to get a list of users a user is following, with optional filtering by followeeId
router.get('/:userId/following', async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId as string);
  const followeeId = req.query.followeeId
    ? new mongoose.Types.ObjectId(req.query.followeeId as string)
    : null;

  console.log('userId');
  console.log(userId);

  console.log('followeeId');
  console.log(followeeId);

  try {
    // Construct the query object based on whether followeeId is provided
    const query = { followerId: userId, followeeId: followeeId || undefined };

    const following = await followsCollection.find(query).toArray();
    res.status(200).send(following);
  } catch (err) {
    console.error('Failed to fetch following', err);
    res.status(500).send({ message: 'Failed to fetch following' });
  }
});

export default router;
