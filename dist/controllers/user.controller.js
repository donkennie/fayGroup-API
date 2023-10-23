"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const upload_image_1 = __importStar(require("../utils/upload-image"));
const fs_1 = __importDefault(require("fs"));
class UserController {
    constructor() {
        this.path = '/users';
        this.user = user_model_1.default;
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                if (!req.file) {
                    return res.status(400).json({ success: false, message: 'No image provided' });
                }
                const image = req.file.path;
                const imageToBase64 = (filePath) => {
                    // read binary data
                    const bitmap = fs_1.default.readFileSync(filePath, { encoding: 'base64' });
                    return `data:image/jpeg;base64,${bitmap}`;
                };
                let fileData = imageToBase64(image);
                const uploadPicture = yield (0, upload_image_1.default)(fileData);
                const existingUser = yield this.user.findOne({ email });
                if (existingUser != null) {
                    throw new Error("User already exists.");
                }
                const newUser = yield this.user.create({
                    name,
                    email,
                    password,
                    profilePicture: uploadPicture
                });
                res.status(201).json("User registered successfully!");
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
        this.UploadPicture = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findById(req.body.userId);
                if (!user) {
                    return res.status(401).json({ success: false, message: 'Wrong Credentials' });
                }
                if (!req.file) {
                    return res.status(400).json({ success: false, message: 'No image provided' });
                }
                const image = req.file.path;
                const imageToBase64 = (filePath) => {
                    // read binary data
                    const bitmap = fs_1.default.readFileSync(filePath, { encoding: 'base64' });
                    return `data:image/jpeg;base64,${bitmap}`;
                };
                let fileData = imageToBase64(image);
                const uploadPicture = yield (0, upload_image_1.default)(fileData);
                console.log(uploadPicture);
                user.profilePicture = uploadPicture;
                yield user.save();
                return res.json({ success: true, message: 'Profile picture updated', profilePicture: uploadPicture });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserService.getUserById(req.params.id);
                console.log(user);
                if (!user)
                    res.status(401).json({ success: false, message: 'Wrong Credentials' });
                res.status(200).json({ user });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/register`, upload_image_1.upload.single("file"), (0, exception_middleware_1.default)(user_validator_1.default.register), this.register);
        this.router.post(`${this.path}/sign-in`, (0, exception_middleware_1.default)(user_validator_1.default.login), this.login);
        this.router.get(`${this.path}/get-user`, authenticated_middleware_1.default, this.getUser);
        this.router.get(`${this.path}/get-user-by-id/:id`, this.getUserById);
        this.router.put(`${this.path}/upload-profile-picture`, upload_image_1.upload.single("file"), this.UploadPicture);
    }
}
exports.default = UserController;
