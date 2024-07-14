import express, { Response } from 'express';
import { MongoClient, Collection, ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-relative-packages
import { NotificationSchema } from '../../../mobile/src/types/notifications';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../mobile/src/types/users';

import authenticate, { AuthRequest } from '../middleware/authenticate';

const router = express.Router();
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const client = new MongoClient(connectionString);

let notificationsCollection: Collection<NotificationSchema>;

(async () => {
  try {
    await client.connect();
    notificationsCollection = client.db('AbcountableDB').collection<NotificationSchema>('notifications');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
})();

const generatesummaryText = (
  notification: NotificationSchema,
  initiatorName: string,
): string => {
  switch (notification.type) {
    case 'like': return `${initiatorName} liked your workout.`;
    case 'comment': return `${initiatorName} commented on your workout.`;
    case 'follow': return `${initiatorName} followed you.`;
    default: return 'New notificaiton';
  }
};

const addUserInfoToNotifications = async (notifcations: NotificationSchema[]) => Promise.all(
  notifcations.map(async (notif) => {
    const user = await client.db('AbcountableDB').collection<User>('users').findOne({ _id: new ObjectId(notif.initiatorUserId) });
    return {
      ...notif,
      initiatorUserInfo: {
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePictureUrl: user?.profilePictureUrl,
      },
      summaryText: generatesummaryText(notif, `${user?.firstName} ${user?.lastName}`),
    };
  }),
);

// Fetch notifications for a user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  const unreadOnly = req.query.unreadOnly === 'true';

  try {
    const query: Partial<NotificationSchema> & { recipientUserId: ObjectId } = {
      recipientUserId: new ObjectId(userId),
    };
    if (unreadOnly) {
      query.read = false; // If unreadOnly is true, add read: false to the query
    }

    const notifications = await notificationsCollection.find(query)
      .sort({ createdAt: -1 }).toArray();

    console.log('unreadCOunt', notifications.filter((n) => !n.read).length);

    const notificationsWithUserInfo = await addUserInfoToNotifications(notifications);
    res.send(notificationsWithUserInfo);
  } catch (err) {
    console.error('Failed to fetch notifications', err);
    res.status(500).send({ message: 'Failed to fetch notifications' });
  }
});

// Create a notification
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { type, targetId } = req.body;
  const recipientUserId = req.userId;
  const { userId: initiatorUserId } = req;

  const newNotification = {
    type,
    targetId,
    initiatorUserId: new ObjectId(initiatorUserId),
    recipientUserId: new ObjectId(recipientUserId),
    createdAt: new Date(),
    read: false,
  } as NotificationSchema;

  try {
    await notificationsCollection.insertOne(newNotification);
    res.status(201).send({ message: 'Notification created successfully' });
  } catch (err) {
    console.error('Failed to create notification', err);
    res.status(500).send({ message: 'Failed to create notification' });
  }
});

// Mark all notifications as read
router.put('/mark-as-read', authenticate, async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  try {
    await notificationsCollection.updateMany(
      { recipientUserId: new ObjectId(userId), read: false },
      { $set: { read: true } },
    );
    res.status(200).send({ message: 'Notifications marked as read' });
  } catch (err) {
    console.error('Failed to mark notifications as read', err);
    res.status(500).send({ message: 'Failed to mark notifications as read' });
  }
});

export default router;
