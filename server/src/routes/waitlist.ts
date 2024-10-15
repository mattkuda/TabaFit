import express, { Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
import { AuthRequest } from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

interface WaitlistEntry {
  email: string;
  createdAt: Date;
}

// Connect to MongoDB
const client = new MongoClient(connectionString);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let waitlistCollection: Collection<WaitlistEntry>;

(async () => {
  try {
    await client.connect();
    waitlistCollection = client.db('AbcountableDB').collection<WaitlistEntry>('waitlist');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

router.post('/', async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ message: 'Email is required' });
    return;
  }

  // Validate the email
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Please enter a valid email' });
    return;
  }

  try {
    await waitlistCollection.insertOne({
      email,
      createdAt: new Date(),
    });

    res.status(200).send({ message: 'Email added to waitlist successfully' });
  } catch (err) {
    console.error('Failed to add email to waitlist', err);
    res.status(500).send({ message: 'Failed to add email to waitlist' });
  }
});

export default router;
