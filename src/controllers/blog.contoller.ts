import IController from "../interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../middleware/http.exception';
import authenticated from '../middleware/authenticated.middleware'
import exceptionMiddleware from '../middleware/exception.middleware';
import BlogService from '../service/blog.service';
import validator from '../validator/blog.validator';
import BlogModel from "../models/blog.model";

class BlogsController implements IController {
    public path = '/blog';
    public router = Router();
    private BlogService = new BlogService();
    private blog = BlogModel;

    constructor(){
       this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create-blog`,
            exceptionMiddleware(validator.blog),
            this.createBlog

        );

        this.router.put(
            `${this.path}/update-blog/:id`,
            exceptionMiddleware(validator.blog),
            this.updateBlog

        );

        this.router.delete(
            `${this.path}/delete-blog/:id`,
            this.DeleteBlog
        );
        
        this.router.get(`${this.path}/get-blogs`, this.GetAllBlogs);

        this.router.get(`${this.path}/get-blog/:id`, this.GetBlogById)
    }

    private createBlog = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, content, title, blogPictureUrl} = req.body;

            const blog = await this.BlogService.createBlog(
                userId,
                content,
                title,
                blogPictureUrl,
            );

            res.status(201).json({userId: blog});

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }


    private GetAllBlogs = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const blogs = await this.BlogService.getAllBlogs()
            res.status(200).json({blogs});

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }

    private GetBlogById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {blogId} = req.params;
           const blog = await this.BlogService.getBlogById(blogId);
            res.status(200).json({blog});

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }

    private updateBlog = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {blogId, content, title, blogPictureUrl} = req.body;

            const newUser = await this.BlogService.UpdateBlog(
                blogId,
                content,
                title,
                blogPictureUrl,
            );
            res.status(201).json({userId: newUser});

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }
    
    private DeleteBlog = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {blogId} = req.params;
            const blog = await this.blog.findByIdAndDelete(blogId);
            if(!blog){
                throw new Error("Not found with the blog Id provided.");
            }

            res.status(200).json({blog});

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }


}


export default BlogsController;