import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import UserService from '../service/user.service';
import authenticated from '../middleware/authenticated.middleware'

