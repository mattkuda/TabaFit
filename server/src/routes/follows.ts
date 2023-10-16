import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import authenticate from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
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

// Endpoint to get a list of followers for a user
router.get('/:userId/followers', async (req: Request, res: Response) => {
  const userId = new ObjectId(req.params.userId);

  try {
    const followers = await followsCollection.find({ followeeId: userId }).toArray();
    res.status(200).send(followers);
  } catch (err) {
    console.error('Failed to fetch followers', err);
    res.status(500).send({ message: 'Failed to fetch followers' });
  }
});

// Endpoint to get a list of users a user is following
router.get('/:userId/following', async (req: Request, res: Response) => {
  const userId = new ObjectId(req.params.userId);

  try {
    const following = await followsCollection.find({ followerId: userId }).toArray();
    res.status(200).send(following);
  } catch (err) {
    console.error('Failed to fetch following', err);
    res.status(500).send({ message: 'Failed to fetch following' });
  }
});

export default router;
