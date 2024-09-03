import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { TabataWorkout, TabataWorkoutSchema } from '../../../mobile/src/types/workouts';
// eslint-disable-next-line import/no-relative-packages
import { PostComment, PostSchema } from '../../../mobile/src/types/posts';
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
let workoutsCollection: Collection<TabataWorkoutSchema>;
let notificationsCollection: Collection<NotificationSchema>;
let followsCollection: Collection;

(async () => {
  try {
    await client.connect();
    postsCollection = client.db('AbcountableDB').collection<PostSchema>('posts');
    workoutsCollection = client.db('AbcountableDB').collection<TabataWorkoutSchema>('workouts');
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

// Generic function to add workout info to posts
const addWorkoutInfoToPosts = async (posts: PostSchema[]) => Promise.all(posts.map(async (post) => {
  const workout = await workoutsCollection.findOne({ _id: new ObjectId(post.workoutId) });

  // console.log("omg here's the post.workoutId", post.workoutId);
  // console.log("omg here's the workout", workout);
  return {
    ...post,
    workout, // Add the full workout data here
  };
}));

const addUserInfoToComments = async (comments: PostComment[]) => Promise.all(
  comments.map(async (comment) => {
    const user = await client.db('AbcountableDB').collection<User>('users').findOne({ _id: new ObjectId(comment.userId) });
    return {
      ...comment,
      user: {
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePictureUrl: user?.profilePictureUrl,
      },
    };
  }),
);

// Helper function to create a new workout
async function createNewWorkout(workout: TabataWorkout, userId: string): Promise<ObjectId> {
  const workoutToSave = {
    ...workout,
    userId: new ObjectId(userId),
    _id: new ObjectId(),
    createdAt: new Date().toISOString(),
  };

  const result = await workoutsCollection.insertOne(workoutToSave);
  return result.insertedId;
}

router.get('/global', async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string, 10) || 0; // Set a default value for offset
    const limit = parseInt(req.query.limit as string, 10) || 10; // Set a default value for limit

    const posts = await postsCollection.find({})
      .sort({ createdAt: -1 })
      .skip(offset) // Skip the number of posts defined by offset
      .limit(limit) // Limit the number of posts to the limit
      .toArray();

    const transformedPosts = await addUserInfoToPosts(posts as PostSchema[]);
    const postsWithWorkout = await addWorkoutInfoToPosts(transformedPosts);
    res.send(postsWithWorkout);
  } catch (err) {
    console.error('Failed to fetch global posts', err);
    res.status(500).send({ message: 'Failed to fetch global posts' });
  }
});

router.get('/user-posts/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  const requestedUserId = req.params.userId;
  const offset = parseInt(req.query.offset as string, 10) || 0; // Set a default value for offset
  const limit = parseInt(req.query.limit as string, 10) || 10; // Set a default value for limit

  if (!ObjectId.isValid(requestedUserId)) {
    res.status(400).send({ message: 'Invalid user ID' });
    return;
  }

  try {
    const userPosts = await postsCollection.find({
      userId: new ObjectId(requestedUserId),
    })
      .sort({ createdAt: -1 })
      .skip(offset) // Skip the number of posts defined by offset
      .limit(limit) // Limit the number of posts to the limit
      .toArray();

    const transformedPosts = await addUserInfoToPosts(userPosts as PostSchema[]);
    const postsWithWorkout = await addWorkoutInfoToPosts(transformedPosts);
    res.send(postsWithWorkout);
  } catch (err) {
    console.error('Failed to fetch user posts', err);
    res.status(500).send({ message: 'Failed to fetch user posts' });
  }
});

router.get('/following-posts', authenticate, async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  const offset = parseInt(req.query.offset as string, 10);
  const limit = parseInt(req.query.limit as string, 10);

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
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
    ]).toArray();

    const transformedPosts = await addUserInfoToPosts(posts as PostSchema[]);
    const postsWithWorkout = await addWorkoutInfoToPosts(transformedPosts);
    res.send(postsWithWorkout);
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

    const transformedPosts = await addUserInfoToPosts([post] as PostSchema[]);
    const postsWithWorkout = await addWorkoutInfoToPosts(transformedPosts);

    const enrichedComments = await addUserInfoToComments(postsWithWorkout[0].comments);

    const result = { ...postsWithWorkout[0], comments: enrichedComments };

    res.send(postsWithWorkout.length ? result : null);
  } catch (err) {
    console.error('Failed to fetch post', err);
    res.status(500).send({ message: 'Failed to fetch post' });
  }
});

router.delete('/:postId', authenticate, async (req: AuthRequest, res) => {
  const { postId } = req.params;
  const { userId } = req; // Authenticated user's ID from the authentication middleware

  try {
    // First, find the post to get the comment
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }

    // Check if the authenticated user is the owner of the post
    if (post.userId.toString() !== userId) {
      res.status(403).send({ message: 'Not authorized to delete this post' });
      return;
    }

    // If the check passes, proceed to delete the Post
    await postsCollection.deleteOne(
      { _id: new ObjectId(postId) },
    );

    res.status(200).send({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Failed to delete Post', err);
    res.status(500).send({ message: 'Failed to delete Post' });
  }
});

router.post('/share', authenticate, async (req: AuthRequest, res: Response) => {
  const {
    workout, title, description, manualTabatas,
  } = req.body;
  const { userId } = req;

  if (!userId) {
    res.status(400).send({ message: 'User ID is required' });
    return;
  }
  let workoutId: ObjectId;

  try {
    if (manualTabatas) {
      // Handle manual tabatas logic here if necessary
    }

    // Determine if the workout needs to be created or already exists
    if (!workout._id || !ObjectId.isValid(workout._id)) {
      // Create a new workout if no valid ID is provided
      workoutId = await createNewWorkout(workout, userId);
    } else {
      // Check if the workout already exists in the database
      const existingWorkout = await workoutsCollection.findOne({ _id: new ObjectId(workout._id) });

      if (existingWorkout) {
        workoutId = existingWorkout._id;
      } else {
        // Create a new workout if the provided ID does not exist in the database
        workoutId = await createNewWorkout(workout, userId);
      }
    }

    // Create and insert the new post
    const newPost: PostSchema = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      workoutId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title,
      description,
      manualTabatas,
      likes: [],
      comments: [],
    };

    await postsCollection.insertOne(newPost);
    res.status(201).send({ message: 'Post shared successfully' });
  } catch (err) {
    console.error('Failed to share post', err);
    res.status(500).send({ message: 'Failed to share post' });
  }
});

// COMMENT ROUTES
router.post('/:postId/comments', authenticate, async (req: AuthRequest, res) => {
  const { postId } = req.params;
  const { body } = req.body;
  const { userId } = req;

  if (!userId) {
    res.status(400).send({ message: 'User ID is required' });
    return;
  }

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
  const { userId } = req; // Authenticated user's ID from the authentication middleware

  try {
    // First, find the post to get the comment
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }

    // Check if the comment exists and get the userId of the commenter
    const comment = post.comments.find(
      (foundComment) => foundComment?._id?.toString() === commentId,
    );
    if (!comment) {
      res.status(404).send({ message: 'Comment not found' });
      return;
    }

    // Check if the authenticated user is the owner of the comment or the post
    if (comment.userId !== userId && post.userId.toString() !== userId) {
      res.status(403).send({ message: 'Not authorized to delete this comment' });
      return;
    }

    // If the check passes, proceed to delete the comment
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
