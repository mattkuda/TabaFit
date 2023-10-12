import express, { Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { Post } from '../../../mobile/src/types/posts';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

let postsCollection: Collection<Post>;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    postsCollection = client.db('AbcountableDB').collection<Post>('posts');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await postsCollection.aggregate([
      {
        $lookup: {
          from: 'workouts',
          localField: 'workout',
          foreignField: '_id',
          as: 'workout',
        },
      },
    ]).toArray();
    res.send(posts);
  } catch (err) {
    console.error('Failed to fetch posts', err);
    res.status(500).send({ message: 'Failed to fetch posts' });
  }
});

// Additional routes for creating, updating, deleting posts can be added here

export default router;
