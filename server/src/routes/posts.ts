import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { PostSchema } from '../../../mobile/src/types/posts';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../mobile/src/types/users';
import authenticate, { AuthRequest } from '../middleware/authenticate';
// eslint-disable-next-line import/no-relative-packages
import { NotificationSchema } from '../../../mobile/src/types/notifications';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const client = new MongoClient(connectionString);

let postsCollection: Collection<PostSchema>;
let notificationsCollection: Collection<NotificationSchema>;
let followsCollection: Collection;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    postsCollection = client.db('AbcountableDB').collection<PostSchema>('posts');
    followsCollection = client.db('AbcountableDB').collection('follows');
    notificationsCollection = client.db('AbcountableDB').collection('notifications');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

// Generic function to add user info to posts
const addUserInfoToPosts = async (posts: PostSchema[]) => Promise.all(posts.map(async (post) => {
  const user = await client.db('AbcountableDB').collection<User>('users').findOne({ _id: new ObjectId(post.userId) });
  return {
    ...post,
    user: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePictureUrl: user?.profilePictureUrl,
    },
  };
}));

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
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' }, // Unwind the user array
      { $sort: { createdAt: -1 } },
    ]).toArray();

    const transformedPosts = await addUserInfoToPosts(posts as PostSchema[]);
    res.send(transformedPosts);
  } catch (err) {
    console.error('Failed to fetch posts', err);
    res.status(500).send({ message: 'Failed to fetch posts' });
  }
});

router.get('/user-posts/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  const requestedUserId = req.params.userId;
  const requestingUserId = req.userId;

  if (!ObjectId.isValid(requestedUserId)) {
    res.status(400).send({ message: 'Invalid user ID' });
    return;
  }

  if (requestingUserId !== requestedUserId) {
    const isFollowing = await followsCollection.findOne({
      followerId: new ObjectId(requestingUserId),
      followeeId: new ObjectId(requestedUserId),
    });

    if (!isFollowing) {
      res.status(403).send({ message: 'You are not authorized to view these posts' });
      return;
    }
  }

  try {
    const userPosts = await postsCollection.find({
      userId: new ObjectId(requestedUserId),
    }).sort({ createdAt: -1 }).toArray();

    const transformedPosts = await addUserInfoToPosts(userPosts as PostSchema[]);
    res.send(transformedPosts);
  } catch (err) {
    console.error('Failed to fetch user posts', err);
    res.status(500).send({ message: 'Failed to fetch user posts' });
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
      { $sort: { createdAt: -1 } },
    ]).toArray();

    const transformedPosts = await addUserInfoToPosts(posts as PostSchema[]);
    res.send(transformedPosts);
  } catch (err) {
    console.error('Failed to fetch following posts', err);
    res.status(500).send({ message: 'Failed to fetch following posts' });
  }
});

router.get('/post/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;

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

    console.log([post]);

    const transformedPosts = await addUserInfoToPosts([post] as PostSchema[]);
    res.send(transformedPosts.length ? transformedPosts[0] : null);
  } catch (err) {
    console.error('Failed to fetch post', err);
    res.status(500).send({ message: 'Failed to fetch post' });
  }
});

router.post('/share', authenticate, async (req: Request, res: Response) => {
  const {
    userId, workout, title, description,
  } = req.body;

  console.log('userId');
  console.log(userId);
  console.log('workout');
  console.log(workout);
  console.log('description');
  console.log(description);

  try {
    const newPost = {
      userId: new ObjectId(userId),
      workout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title,
      description,
      likes: [],
      comments: [],
    };

    // @ts-expect-error Todo at partial type
    await postsCollection.insertOne(newPost);

    res.status(201).send({ message: 'Workout shared successfully' });
  } catch (err) {
    console.error('Failed to share workout', err);
    res.status(500).send({ message: 'Failed to share workout' });
  }
});

// COMMENT ROUTES
router.post('/:postId/comments', authenticate, async (req, res) => {
  const { postId } = req.params;
  const { userId, body } = req.body;

  try {
    const comment = {
      _id: new ObjectId(),
      userId,
      body,
      createdAt: new Date().toISOString(),
    };

    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: comment } },
    );

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (post && post.userId.toString() !== userId) {
      const notification: NotificationSchema = {
        type: 'comment',
        targetId: new ObjectId(postId),
        initiatorUserId: new ObjectId(userId),
        recipientUserId: new ObjectId(post.userId),
        createdAt: new Date(),
        read: false,
      };
      await notificationsCollection.insertOne(notification);
    }

    res.status(200).send({ message: 'Comment added successfully', commentId: comment._id });
  } catch (err) {
    console.error('Failed to add comment', err);
    res.status(500).send({ message: 'Failed to add comment' });
  }
});

router.delete('/:postId/comments/:commentId', authenticate, async (req: AuthRequest, res) => {
  const { postId, commentId } = req.params;

  try {
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } },
    );
    res.status(200).send({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Failed to delete comment', err);
    res.status(500).send({ message: 'Failed to delete comment' });
  }
});

// END COMMENT ROUTES

// LIKES ROUTES
router.put('/:postId/like', authenticate, async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: new ObjectId(userId) } },
    );

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (post && post.userId.toString() !== userId) {
      const notification: NotificationSchema = {
        type: 'like',
        targetId: new ObjectId(postId),
        initiatorUserId: new ObjectId(userId),
        recipientUserId: new ObjectId(post.userId),
        createdAt: new Date(),
        read: false,
      };
      await notificationsCollection.insertOne(notification);
    }

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
// END LIKE ROUTES

export default router;
