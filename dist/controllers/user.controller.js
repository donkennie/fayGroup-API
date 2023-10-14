"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("../service/user.service"));
const http_exception_1 = __importDefault(require("../middleware/http.exception"));
const authenticated_middleware_1 = __importDefault(require("../middleware/authenticated.middleware"));
const exception_middleware_1 = __importDefault(require("../middleware/exception.middleware"));
const user_validator_1 = __importDefault(require("../validator/user.validator"));
const user_model_1 = __importDefault(require("../models/user.model"));
const upload_image_1 = __importDefault(require("../utils/upload-image"));
class UserController {
    constructor() {
        this.path = '/users';
        this.user = user_model_1.default;
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, profilePicture, password } = req.body;
                const newUser = yield this.UserService.register(name, email, profilePicture, password);
                res.status(201).json({ user: newUser });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userLogin = yield this.UserService.Login(email, password);
                if (!userLogin)
                    res.status(401).json({ success: false, message: 'Wrong Credentials' });
                res.status(201).json(Object.assign({}, userLogin));
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new http_exception_1.default(404, 'No logged in user'));
            }
            res.status(200).send({ data: req.user });
        };
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
        this.UploadPicture = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const user = yield this.user.findOne({ userId: userId });
                if (!user) {
                    return res.status(401).json({ success: false, message: 'Wrong Credentials' });
                }
                const image = req.body.file;
                if (image === null) {
                    return res.status(400).json({ success: false, message: 'No image provided' });
                }
                const uploadPicture = yield (0, upload_image_1.default)(image);
                // Update the user's profile picture
                user.profilePicture = uploadPicture;
                // Save the updated user
                yield user.save();
                return res.json({ success: true, message: 'Profile picture updated', profilePicture: uploadPicture });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.UserService.getUserById(userId);
                if (!user)
                    res.status(401).json({ success: false, message: 'Wrong Credentials' });
                res.status(201).json({ user });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/register`, (0, exception_middleware_1.default)(user_validator_1.default.register), this.register);
        this.router.post(`${this.path}/sign-in`, (0, exception_middleware_1.default)(user_validator_1.default.login), this.login);
        this.router.get(`${this.path}/get-user`, authenticated_middleware_1.default, this.getUser);
        this.router.get(`${this.path}/get-user-by-id/:id`, this.getUserById);
        this.router.put(`${this.path}/upload-profile-picture`, this.UploadPicture);
    }
}
exports.default = UserController;
