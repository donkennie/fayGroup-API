import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';

export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profilePicture: string;

    isValidPassword(password: string): Promise<Error | boolean>;
}