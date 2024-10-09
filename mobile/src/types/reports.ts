import mongoose from 'mongoose';

export type ReportItemType = 'post' | 'comment' | 'user' | 'workout';

export enum ReportReason {
    InappropriateContent = 'Inappropriate content',
    Spam = 'Spam',
    Harassment = 'Harassment',
    FalseInformation = 'False information',
    Other = 'Other',
}

export interface Report {
    reporterId: mongoose.Types.ObjectId | string;
    reportedItemId: mongoose.Types.ObjectId | string;
    reportedItemType: ReportItemType;
    reportReason: ReportReason;
    description: string;
}

export interface ReportSchema extends Report {
    _id?: mongoose.Types.ObjectId;
    createdAt: Date;
}
