import IController from "../interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from 'express';

class BlogsController implements IController {

    public path = '/';
    public router = Router();

    constructor(){
       // this.initialiseRoutes();
    }
}

export default BlogsController;