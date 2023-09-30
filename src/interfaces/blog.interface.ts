import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';

export default interface IBlog extends Document{
    _id: ObjectId,
    userId: string,
    content: string,
    title: string,
    PublishedAt: Date
    blogPictureUrl: string
}