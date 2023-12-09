import mongoose from 'mongoose';
import { UserPostInfo } from './posts';

export interface NotificationSchema {
    _id?: mongoose.Types.ObjectId;
    type: 'like' | 'comment' | 'follow';
    targetId: mongoose.Types.ObjectId;
    initiatorUserId: mongoose.Types.ObjectId;
    recipientUserId: mongoose.Types.ObjectId;
    createdAt: Date;
    read: boolean;
}

export type NotificationModel = NotificationSchema & {
    initiatorUser: UserPostInfo;
}
