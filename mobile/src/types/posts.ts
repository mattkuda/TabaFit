import mongoose from 'mongoose';
import { Workout } from './workouts';

export interface PostComment {
    _id?: mongoose.Types.ObjectId | string;
    userId: string;
    body: string;
    createdAt: string;
}

export interface PostSchema {
    _id: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    workout: Workout;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    likes: mongoose.Types.ObjectId[];
    comments: PostComment[];
}

export interface UserPostInfo {
    username: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
}

export interface PostModel {
    _id: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    user: UserPostInfo;
    workout: Workout;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    likes: mongoose.Types.ObjectId[];
    comments: PostComment[];
}
