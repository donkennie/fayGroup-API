import { Schema, model } from 'mongoose';
import IBlog from '../interfaces/blog.interface'

const BlogSchema = new Schema({
    content: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    publishedAt:{
        type: Date,
    },

    blogPictureUrl:{
        type: String,
        required: true,
    },

    userId:{
        type: String,
        required: true,
    }
},

{
    timestamps: true,
}

);

export default model<IBlog>('Blog', BlogSchema);