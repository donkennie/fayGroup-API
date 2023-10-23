import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import UserService from '../service/user.service';
import HttpException from '../middleware/http.exception';
import authenticated from '../middleware/authenticated.middleware'
import exceptionMiddleware from '../middleware/exception.middleware';
import validator from '../validator/user.validator';
import IUser  from '../interfaces/user.interface'
import UserModel from "../models/user.model";
import path from 'path'
import uploader from '../utils/multer'
import uploadImage, { upload } from '../utils/upload-image';
import fs from "fs";

class UserController implements IController {
    public path = '/users';
    private user = UserModel;
    public router = Router();
    private UserService = new UserService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            upload.single("file"),
            exceptionMiddleware(validator.register),
            this.register

        );
        
        this.router.post(
            `${this.path}/sign-in`,
            exceptionMiddleware(validator.login),
            this.login
        );
        this.router.get(`${this.path}/get-user`, authenticated, this.getUser)
        this.router.get(`${this.path}/get-user-by-id/:id`, this.getUserById)
        this.router.put(`${this.path}/upload-profile-picture`, upload.single("file"), this.UploadPicture)
    }

    
    
    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            
            const { name, email, password} = req.body;

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

            const existingUser = await this.user.findOne({ email });
            if (existingUser != null){
                throw new Error("User already exists.");
            }
            
            const newUser = await this.user.create({
                name,
                email,
                password,
                profilePicture: uploadPicture
            });


            res.status(201).json("User registered successfully!");

        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }

    
    
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
        ): Promise<Response | void> => {
            try {
                const {email, password} = req.body;
                const userLogin = await this.UserService.Login(email, password);

                if(!userLogin) 
                res.status(401).json({ success: false, message: 'Wrong Credentials' });

                res.status(201).json({...userLogin});
            } catch (error:any) {
                next(new HttpException(400, error.message));
            }

        }

       private getUser = (
        req: Request | any, 
        res: Response,
        next: NextFunction
    ): Response | void => {
        if(!req.user){
            return next(new HttpException(404, 'No logged in user'));
        }
        res.status(200).send({ data: req.user });
    }   
   

private UploadPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      
     const user = await this.user.findById(req.body.userId);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Wrong Credentials' });
      }

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
        console.log(uploadPicture)
        user.profilePicture = uploadPicture;
  
        await user.save();
  
        return res.json({ success: true, message: 'Profile picture updated', profilePicture: uploadPicture });

    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  


    private getUserById = async (
        req: Request,
        res: Response,
        next: NextFunction
        ): Promise<Response | void> => {
            try {
                const user = await this.UserService.getUserById(req.params.id);
                console.log(user)
                if(!user) 
                res.status(401).json({ success: false, message: 'Wrong Credentials' });

                res.status(200).json({user});
            } catch (error:any) {
                next(new HttpException(400, error.message));
            }

        }

}

export default UserController;
