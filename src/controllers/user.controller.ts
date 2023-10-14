import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import UserService from '../service/user.service';
import HttpException from '../middleware/http.exception';
import authenticated from '../middleware/authenticated.middleware'
import exceptionMiddleware from '../middleware/exception.middleware';
import validator from '../validator/user.validator';
import UserModel from "../models/user.model";
import uploadImage from '../utils/upload-image';

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
        this.router.put(`${this.path}/upload-profile-picture`, this.UploadPicture)
    }

    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, profilePicture, password} = req.body;

            const newUser = await this.UserService.register(
                name,
                email,
                profilePicture,
                password
            );
            res.status(201).json({user: newUser});

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

    // private UploadPicture = async(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<Response | void> => {
    //     try{
    //         const image = req.body.image;
    //         const {userId} = req.body;
            
    //         const user = await this.user.findOne({userId: userId});

    //         if(!user) 
    //         res.status(401).json({ success: false, message: 'No user is found with this ID' });

    //         let uploadPicture = await uploadImage(image);
    //        // user?.profilePicture =u

    //         const updateUser = await this.user.updateOne({user: user});

    //         res.json({ uploadPicture });
            
    //     }
    //     catch (error:any) {
    //         next(new HttpException(400, error.message));
    //     }
    // }


// ...

private UploadPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { userId } = req.body;
        const user = await this.user.findOne({ userId: userId });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Wrong Credentials' });
        }

        const image = req.body.file; 
        if (image === null) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const uploadPicture = await uploadImage(image);

        // Update the user's profile picture
        user.profilePicture = uploadPicture;

        // Save the updated user
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
                const {userId} = req.params;
                const user = await this.UserService.getUserById(userId);

                if(!user) 
                res.status(401).json({ success: false, message: 'Wrong Credentials' });

                res.status(201).json({user});
            } catch (error:any) {
                next(new HttpException(400, error.message));
            }

        }

}

export default UserController;