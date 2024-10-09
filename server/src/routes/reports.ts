import express, { Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { ReportSchema } from '../../../mobile/src/types/reports';

import authenticate, { AuthRequest } from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const client = new MongoClient(connectionString);

let reportsCollection: Collection<ReportSchema>;

(async () => {
  try {
    await client.connect();
    reportsCollection = client.db('AbcountableDB').collection<ReportSchema>('reports');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

// Create a report
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { report } = req.body;

  const { userId: initiatorUserId } = req;

  const newReport: ReportSchema = {
    reporterId: new ObjectId(initiatorUserId),
    reportedItemId: new ObjectId(report.reportedItemId),
    reportedItemType: report.reportedItemType,
    reportReason: report.reportReason,
    description: report.description,
    createdAt: new Date(),
  };

  try {
    await reportsCollection.insertOne(newReport);
    res.status(201).send({ message: 'Report created successfully' });
  } catch (err) {
    console.error('Failed to create report', err);
    res.status(500).send({ message: 'Failed to create report' });
  }
});

export default router;
