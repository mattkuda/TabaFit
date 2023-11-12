import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { Post } from '../../../mobile/src/types/posts';
import authenticate, { AuthRequest } from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const client = new MongoClient(connectionString);

let postsCollection: Collection<Post>;
let followsCollection: Collection;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    postsCollection = client.db('AbcountableDB').collection<Post>('posts');
    followsCollection = client.db('AbcountableDB').collection('follows');
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

router.get('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;

  console.log('postId');
  console.log(postId);

  if (!ObjectId.isValid(postId)) {
    res.status(400).send({ message: 'Invalid post ID' });
    return;
  }

  try {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }

    res.send(post);
  } catch (err) {
    console.error('Failed to fetch post', err);
    res.status(500).send({ message: 'Failed to fetch post' });
  }
});

router.get('/following-posts', authenticate, async (req: AuthRequest, res: Response) => {
  const { userId } = req;

  if (!userId) {
    res.status(400).send({ message: 'User ID is required' });
    return;
  }

  try {
    const objectIdUserId = new ObjectId(userId);
    const following = await followsCollection.find({ followerId: objectIdUserId }).toArray();
    const followees = following.map((follow) => new ObjectId(follow.followeeId));
    followees.push(objectIdUserId);

    console.log('followees');
    console.log(followees);

    const posts = await postsCollection.aggregate([
      {
        // Match posts where the creator is in the list of followees or is the current user
        $match: {
          userId: { $in: followees },
        },
      },
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
    console.error('Failed to fetch following posts', err);
    res.status(500).send({ message: 'Failed to fetch following posts' });
  }
});

// LIKES ROUTES

router.put('/:postId/like', authenticate, async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: new ObjectId(userId) } },
    );
    res.status(200).send({ message: 'Post liked successfully' });
  } catch (err) {
    console.error('Failed to like post', err);
    res.status(500).send({ message: 'Failed to like post' });
  }
});

router.put('/:postId/unlike', authenticate, async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: new ObjectId(userId) } },
    );
    res.status(200).send({ message: 'Post unliked successfully' });
  } catch (err) {
    console.error('Failed to unlike post', err);
    res.status(500).send({ message: 'Failed to unlike post' });
  }
});

export default router;
