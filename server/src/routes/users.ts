import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import mongoose from 'mongoose';
import { MongoClient, Collection } from 'mongodb';
import multer from 'multer';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../mobile/src/types/users';
import authenticate, { AuthRequest } from '../middleware/authenticate';
import { bucket } from '../config/firebaseConfig';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
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
    const user = await usersCollection.findOne(
      { _id: new mongoose.Types.ObjectId(req.params.userId) },
    );

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    res.status(200).send(safeUser);
  } catch (err) {
    console.error('Failed to fetch user', err);
    res.status(500).send({ message: 'Failed to fetch user' });
  }
});

router.get('/username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // Extract username from params

    // Find the user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    res.status(200).send(safeUser);
  } catch (err) {
    console.error('Failed to get user by username', err);
    res.status(500).send({ message: 'Failed to get user by username' });
  }
});

// Function to upload file to Firebase Storage
async function uploadFile(file: Express.Multer.File) {
  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
    contentType: file.mimetype,
    cacheControl: 'public, max-age=31536000',
  };

  await bucket.upload(file.path, {
    gzip: true,
    metadata,
  });

  // Delete the file from local storage
  fs.unlink(file.path, (err) => {
    if (err) console.error('Error deleting file:', err);
  });

  // Construct the public URL for the file
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.filename}`;
  return publicUrl;
}

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;

  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  try {
    const uploadedFileUrl = await uploadFile(file);
    res.status(200).send({ url: uploadedFileUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).send('Error uploading file');
  }
});

router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    // Create a case-insensitive regex pattern for the search query
    const regex = new RegExp(query, 'i');

    // Search for users by username, first name, or last name
    const users = await usersCollection.find({
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
      ],
    }).toArray();

    // Exclude sensitive fields from the results
    const safeUsers = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;

      return safeUser;
    });

    res.status(200).send(safeUsers);
  } catch (err) {
    console.error('Failed to search for users', err);
    res.status(500).send({ message: 'Failed to search for users' });
  }
});

router.put('/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData: Partial<User> = req.body; // Get the data to update from the request body

    // Check if the authenticated user is the same as the user being updated
    if (req.userId !== userId) {
      res.status(403).send({ message: 'Forbidden: You cannot update other users\' information.' });
      return;
    }

    // Prevent updating sensitive fields
    delete updateData._id;
    delete updateData.password;

    const result = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
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
