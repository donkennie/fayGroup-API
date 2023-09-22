import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import UserService from '../service/user.service';
import HttpException from '../middleware/http.exception';
import authenticated from '../middleware/authenticated.middleware'
import exceptionMiddleware from '../middleware/exception.middleware';
import validator from '../validator/user.validator';

class UserController implements IController {
    public path = '/register';
    public router = Router();
    private UserService = new UserService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/users`,
            exceptionMiddleware(validator.register),
            this.register

        );
        
        this.router.post(
            `/sign-in`,
            exceptionMiddleware(validator.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticated, this.getUser)
    }

    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {_id, name, email, password, profilePicture} = req.body;

            const newUser = await this.UserService.register(
                _id,
                name,
                email,
                password,
                profilePicture
            );
            res.status(201).json({userId: newUser});

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
                res.status(400).json({ success: false, message: 'Wrong Credentials' });

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
}

export default UserController;