import IController from "../interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../middleware/http.exception';
import authenticated from '../middleware/authenticated.middleware'
import exceptionMiddleware from '../middleware/exception.middleware';
import BlogService from '../service/blog.service';
import validator from '../validator/blog.validator';
import BlogModel from "../models/blog.model";
import UserModel from "../models/user.model";
import uploadImage, { upload } from '../utils/upload-image';
import fs from "fs";

class BlogsController implements IController {
    public path = '/blog';
    public router = Router();
    private user = UserModel;
    private BlogService = new BlogService();
    private blog = BlogModel;

    constructor(){
       this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create-blog`,
            upload.single("file"),
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
            const { userId, content, title} = req.body;

            const user = await this.user.findById(req.body.userId);

            if(user === null) 
            res.status(401).json({ success: false, message: 'No user is found with this ID' });

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image provided' });
            }

            const image = req.file.path;

            const imageToBase64 = (filePath: string) => {
                // read binary data
                const bitmap = fs.readFileSync(filePath, {encoding: 'base64'});
                return `data:image/jpeg;base64,${bitmap}`
            };
            
            let fileData = imageToBase64(image)
            
            const uploadPicture = await uploadImage(fileData);

            const blog = await this.blog.create({
                user: user,
                content,
                title,
                blogPictureUrl: uploadPicture,
            });

            res.status(201).json("Blog created successfully");

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

           const blog = await this.BlogService.getBlogById(req.params.id);
    
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
                    const updateBlog = await this.blog.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true,
                      })

            res.status(201).json("Updated blog successfully");

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
            
            const blog = await this.BlogService.deleteBlogById(req.params.id);
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