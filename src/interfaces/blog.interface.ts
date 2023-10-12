import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';

export default interface IBlog extends Document{
    userId: string,
    content: string,
    title: string,
    PublishedAt: Date
    blogPictureUrl: string
}