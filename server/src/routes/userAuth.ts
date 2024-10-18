import express, { NextFunction, Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createSecretToken } from '../util/createSecretToken';
import { validateUsername } from '../util/util';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../mobile/src/types/users';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;
const REFRESH_TOKEN_EXPIRATION_DAYS = 90;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

// Connect to MongoDB
const client = new MongoClient(connectionString);

// Add this new interface for refresh tokens
interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

let usersCollection: Collection<User>;
let refreshTokensCollection: Collection<RefreshToken>;

(async () => {
  try {
    await client.connect();
    usersCollection = client.db('AbcountableDB').collection<User>('users');
    refreshTokensCollection = client.db('AbcountableDB').collection<RefreshToken>('refreshTokens');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, password, username, firstName, lastName,
    } = req.body;
    const trimmedUsername = username.trim();

    // Validate the username
    const { isValid, errorMessage } = validateUsername(trimmedUsername);
    if (!isValid) {
      return res.status(400).json({ message: errorMessage });
    }

    // Validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with email already exists' });
    }

    const existingUsername = await usersCollection.findOne({ username: trimmedUsername });
    if (existingUsername) {
      return res.status(400).json({ message: 'User with username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdAt = new Date();

    // Create a new user object without specifying _id
    const newUser: Omit<User, '_id'> = {
      email: email.trim(),
      password: hashedPassword,
      username: trimmedUsername,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      preferences: {
        exerciseVideosEnabled: true,
      },
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };
    // Insert the new user
    const result = await usersCollection.insertOne(newUser as User);
    const { insertedId } = result;

    const token = createSecretToken(insertedId.toString());

    // Fetch the inserted user
    const user = await usersCollection.findOne({ _id: insertedId });

    return res.status(201).json({
      message: 'User signed up successfully',
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    next();
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user by either email or username
    const user = await usersCollection.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Incorrect password or email/username' });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: 'Incorrect password or email/username' });
    }

    const token = createSecretToken(user._id.toString());

    // Create refresh token
    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d` },
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    await refreshTokensCollection.insertOne({
      token: refreshToken,
      userId: user._id.toString(),
      expiresAt,
    });

    // Exclude sensitive data from the user object before sending it to the client
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      token,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    next();
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ status: false });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, decodedData: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(decodedData);
        }
      });
    });

    const user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(data.id) });
    if (user) {
      return res.json({ status: true, user: user.username });
    }
    return res.json({ status: false });
  } catch (error) {
    return res.json({ status: false });
  }
});

// Add this new route for token refresh
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Find the refresh token in the database
    const storedToken = await refreshTokensCollection.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if the token has expired
    if (new Date() > storedToken.expiresAt) {
      await refreshTokensCollection.deleteOne({ token: refreshToken });
      return res.status(401).json({ message: 'Refresh token has expired' });
    }

    // Find the user associated with this token
    const user = await usersCollection
      .findOne({ _id: new mongoose.Types.ObjectId(storedToken.userId) });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Create new access token
    const newAccessToken = createSecretToken(user._id.toString());

    // Create new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d` },
    );

    // Update refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    await refreshTokensCollection.updateOne(
      { token: refreshToken },
      { $set: { token: newRefreshToken, expiresAt } },
    );

    return res.status(200).json({
      message: 'Token refreshed successfully',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
