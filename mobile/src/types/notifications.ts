import mongoose from 'mongoose';

export interface NotificationSchema {
    _id?: mongoose.Types.ObjectId;
    type: 'like' | 'comment' | 'follow';
    targetId: mongoose.Types.ObjectId;
    initiatorUserId: mongoose.Types.ObjectId;
    recipientUserId: mongoose.Types.ObjectId;
    createdAt: Date;
    read: boolean;
}
