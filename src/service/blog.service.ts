import {ObjectId} from 'mongodb';
import BlogModel from "../models/blog.model";

class BlogService{
    private blog = BlogModel;


    public async createBlog(
        _id: ObjectId,
        userId: string, 
        title: string,
        content: string,
        blogPictureUrl: string
    ): Promise<string | Error>
    {
        try {
            const createBlog = await this.blog.create({
                _id: new ObjectId(),
                userId,
                title,
                content,
                blogPictureUrl
            })

            return "Created successfully";

        } catch (error) {
            throw new Error('Unable to create blog');
        }
    }


    public async getAllBlogs(

    ): Promise<object[] | Error>{
        try {
            const blogs = await this.blog.find();
            return blogs;
        } catch (error) {
            throw new Error('Unable to fetch the available blogs');
        }
    }

    public async getBlogById(
        blogId: string,
        ): Promise<{userId: string, blogId: object, title: string, content: string, blogPictureUrl: string, publishedAt: Date } | Error>{
            try {
                const blog = await this.blog.findById(blogId);
                if(!blog){
                    throw new Error("Not found with the blog Id provided.");
                }

                return {
                    userId: blog.userId,
                    blogId: blog?._id,
                    title: blog.title,
                    content: blog.content,
                    blogPictureUrl: blog.blogPictureUrl,
                    publishedAt: blog.PublishedAt,
                };
            } catch (error) {
                throw new Error('Unable to fetch the available blog');
            }
        }

        public async deleteBlogById(
            blogId: string,
            ): Promise<object | Error>{
                try {
                    const blogs = await this.blog.findByIdAndDelete(blogId);
                    if(!blogs){
                        throw new Error("Not found with the blog Id provided.");
                    }
    
                    return {
                        message: 'Blog deleted successfully'
                    };
                } catch (error) {
                    throw new Error('Unable to fetch the available blog');
                }
            }
    

}