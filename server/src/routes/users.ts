import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import multer from 'multer';
// eslint-disable-next-line import/no-relative-packages
import { User, UserFullInfoModel } from '../../../mobile/src/types/users';
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
let followsCollection: Collection;

(async () => {
  try {
    await client.connect();
    usersCollection = client.db('AbcountableDB').collection<User>('users');
    followsCollection = client.db('AbcountableDB').collection('follows');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

const SUGGESTED_USER_IDS = ['64f4ccf351498c529ff6d7b0'];

router.get('/suggested', async (req: AuthRequest, res: Response) => {
  try {
    const idsToFetch = SUGGESTED_USER_IDS.map((id) => new mongoose.Types.ObjectId(id));
    const suggestedUsers = await usersCollection.find({ _id: { $in: idsToFetch } }).toArray();

    res.status(200).send(suggestedUsers);
  } catch (err) {
    console.error('Failed to fetch suggested users', err);
    res.status(500).send({ message: 'Failed to fetch suggested users' });
  }
});

router.get('/:userId', async (req: AuthRequest, res: Response) => {
  const requestedUserId = req.params.userId;

  if (!ObjectId.isValid(requestedUserId)) {
    res.status(400).send({ message: 'Invalid user ID' });
    return;
  }

  try {
    const userIdObj = new mongoose.Types.ObjectId(req.params.userId);

    // Find the user
    const user = await usersCollection.findOne({ _id: userIdObj });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // Aggregate followers and following counts
    const followersCount = await followsCollection.countDocuments({ followeeId: userIdObj });
    const followingCount = await followsCollection.countDocuments({ followerId: userIdObj });

    // Construct the UserFullInfoModel
    const userFullInfo: UserFullInfoModel = {
      ...user,
      followersCount,
      followingCount,
    };

    // Exclude sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUserFullInfo } = userFullInfo;

    res.status(200).send(safeUserFullInfo);
  } catch (err) {
    console.error('Failed to fetch user', err);
    res.status(500).send({ message: 'Failed to fetch user' });
  }
});

router.get('/username/:username', async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching user by username');

    // Find the user by username
    const user = await usersCollection.findOne({ username: req.params.username.toLowerCase() });

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

router.get('/email/:email', async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching user by email');

    // Find the user by email
    const user = await usersCollection.findOne({ email: req.params.email.toLowerCase() });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    res.status(200).send(safeUser);
  } catch (err) {
    console.error('Failed to get user by email', err);
    res.status(500).send({ message: 'Failed to get user by email' });
  }
});

// Function to upload file to Firebase Storage
async function uploadFile(
  fileBuffer: Buffer,
  mimeType: string,
  originalName: string,
): Promise<string> {
  // Create a unique file name
  const fileName = `${Date.now()}-${originalName}`;
  const file = bucket.file(fileName);

  // Save the file to Firebase Storage
  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });

  stream.on('error', (err) => {
    console.error('File upload error:', err);
  });

  stream.on('finish', async () => {
    // The file upload is complete and you can now get the public URL
  });

  stream.end(fileBuffer);

  // Construct the public URL for the file
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  return publicUrl;
}

function extractFileName(url: string): string | null {
  const matches = url.match(/\/([^/?#]+)[^/]*$/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
}

router.post('/upload/:userId', upload.single('file'), async (req: AuthRequest, res: Response) => {
  const { file, userId } = req;

  if (req.userId !== userId) {
    res.status(403).send({ message: 'Forbidden: You are not authorized to make this request.' });
    return;
  }

  if (!file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  try {
    // Resize and crop the image to a square (if not already)
    const processedImage = await sharp(file.path)
      .resize(512, 512, {
        fit: sharp.fit.cover, // Cover ensures the image is cropped to the desired aspect ratio
        position: sharp.strategy.entropy, // Focus on the center/most interesting part of the image
      })
      .toBuffer();

    // Delete the temporary file
    fs.unlinkSync(file.path);

    // Upload the processed image
    const uploadedFileUrl = await uploadFile(processedImage, file.mimetype, file.originalname);

    // Get the current user's data
    const currentUser = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    // Attempt to delete the previous image if it exists
    if (currentUser && currentUser.profilePictureUrl) {
      const oldFileName = extractFileName(currentUser.profilePictureUrl);
      if (oldFileName) {
        try {
          await bucket.file(oldFileName).delete();
        } catch (error) {
          // Log the error and continue - allows graceful failure
          console.error('Error deleting old profile picture:', error);
        }
      }
    }

    await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { profilePictureUrl: uploadedFileUrl } },
    );

    res.status(200).send({ url: uploadedFileUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).send('Error uploading file');
  }
});

router.get('/search/:query', async (req: AuthRequest, res: Response) => {
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
    const { userId } = req;
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

// Endpoint to delete a user account
router.delete('/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;

    // Check if the authenticated user is the same as the user being deleted
    if (req.userId !== userId) {
      res.status(403).send({ message: 'Forbidden: You cannot delete other users\' accounts.' });
      return;
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    // Delete the user from the users collection
    const deleteResult = await usersCollection.deleteOne(
      { _id: userIdObj },
    );

    if (deleteResult.deletedCount === 0) {
      res.status(404).send({ message: 'User not found or already deleted' });
      return;
    }

    // Delete all follow relationships where the user is either a follower or a followee
    await followsCollection.deleteMany({
      $or: [
        { followerId: userIdObj },
        { followeeId: userIdObj },
      ],
    });

    res.status(200).send({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Failed to delete user account', err);
    res.status(500).send({ message: 'Failed to delete user account' });
  }
});

export default router;
