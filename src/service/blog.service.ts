import {ObjectId} from 'mongodb';
import BlogModel from "../models/blog.model";

class BlogService{
    private blog = BlogModel;


    public async createBlog(
        userId: string, 
        content: string,
        title: string,
        blogPictureUrl: string
    ): Promise<string | Error>
    {
        try {

            const createBlog = await this.blog.create({
                userId,
                content,
                title,
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
            const blogs = await this.blog.find().populate('user', '-_id name profilePicture')
            .lean();

            return blogs;
        } catch (error) {
            throw new Error('Unable to fetch the available blogs');
        }
    }

    public async getBlogById(blogId: string): Promise<object | Error> {
        try {
            const blog = await this.blog.findById(blogId).populate('user', '-_id name profilePicture')
                .select('-_id -blog')
                .lean();

                console.log(blog)

            if (blog === null) {
                throw new Error("Not found with the blog Id provided.");
            }
    
            return blog;
        } catch (error) {
            console.error(error); // Log the actual error for debugging
            throw new Error('Unable to fetch the available blog');
        }
    }
    

        public async deleteBlogById(
            blogId: string,
            ): Promise<object | Error>{
                try {

                    const blog = await this.blog.findByIdAndDelete(blogId);
                    if(!blog){
                        throw new Error("Not found with the blog Id provided.");
                    }
    
                    return {
                        message: 'Blog deleted successfully'
                    };
                } catch (error) {
                    throw new Error('Unable to fetch the available blog');
                }
            }
    

            public async UpdateBlog(
                id: string,
                title: string,
                userId: string,
                content: string,
                blogPictureUrl: string
            ): Promise<string | Error>
            {
                try {

                    const blogFromDb = await this.blog.findById(id);
                    if(blogFromDb === null){
                        throw new Error("Not found with the blog Id provided.");
                    }

                    const createBlog = await this.blog.updateOne({
                        title,
                        content,
                        userId,
                        blogPictureUrl
                    })
        
                    return "Updated successfully";
        
                } catch (error) {
                    throw new Error('Unable to update blog');
                }
            }
        

}

export default BlogService;