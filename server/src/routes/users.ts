/* eslint-disable no-underscore-dangle */
import express, { Request, Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../mobile/src/types/users';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

let usersCollection: Collection<User>;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    usersCollection = client.db('AbcountableDB').collection<User>('users');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const user = await usersCollection.findOne({ _id: userId.toHexString() });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    res.status(200).send(safeUser);
  } catch (err) {
    console.error('Failed to fetch user', err);
    res.status(500).send({ message: 'Failed to fetch user' });
  }
});

router.get('/username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // Extract username from params
    console.log('USERNAME');
    console.log(username);

    // Find the user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    res.status(200).send(safeUser);
  } catch (err) {
    console.error('Failed to get user by username', err);
    res.status(500).send({ message: 'Failed to get user by username' });
  }
});

router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = new ObjectId(req.params.userId); // Convert string ID to ObjectId
    const updateData: Partial<User> = req.body; // Get the data to update from the request body

    // Prevent updating sensitive fields
    delete updateData._id;
    delete updateData.passwordHash;

    const result = await usersCollection.updateOne(
      { _id: userId.toHexString() },
      { $set: updateData },
    );

    if (result.modifiedCount === 0) {
      res.status(404).send({ message: 'User not found or no changes made' });
    } else {
      res.status(200).send({ message: 'User updated successfully' });
    }
  } catch (err) {
    console.error('Failed to update user', err);
    res.status(500).send({ message: 'Failed to update user' });
  }
});

export default router;
