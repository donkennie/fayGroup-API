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
const http_exception_1 = __importDefault(require("../middleware/http.exception"));
const exception_middleware_1 = __importDefault(require("../middleware/exception.middleware"));
const blog_service_1 = __importDefault(require("../service/blog.service"));
const blog_validator_1 = __importDefault(require("../validator/blog.validator"));
const blog_model_1 = __importDefault(require("../models/blog.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const upload_image_1 = __importStar(require("../utils/upload-image"));
const fs_1 = __importDefault(require("fs"));
class BlogsController {
    constructor() {
        this.path = '/blog';
        this.router = (0, express_1.Router)();
        this.user = user_model_1.default;
        this.BlogService = new blog_service_1.default();
        this.blog = blog_model_1.default;
        this.createBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, content, title } = req.body;
                const user = yield this.user.findById(req.body.userId);
                if (user === null)
                    res.status(401).json({ success: false, message: 'No user is found with this ID' });
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
                const blog = yield this.blog.create({
                    userId,
                    content,
                    title,
                    blogPictureUrl: uploadPicture,
                });
                res.status(201).json("Blog created successfully");
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.GetAllBlogs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield this.BlogService.getAllBlogs();
                res.status(200).json({ blogs });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.GetBlogById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.BlogService.getBlogById(req.params.id);
                res.status(200).json({ blog });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.updateBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateBlog = yield this.blog.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(201).json("Updated blog successfully");
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.DeleteBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.BlogService.deleteBlogById(req.params.id);
                if (!blog) {
                    throw new Error("Not found with the blog Id provided.");
                }
                res.status(200).json({ blog });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create-blog`, upload_image_1.upload.single("file"), (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.createBlog);
        this.router.put(`${this.path}/update-blog/:id`, (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.updateBlog);
        this.router.delete(`${this.path}/delete-blog/:id`, this.DeleteBlog);
        this.router.get(`${this.path}/get-blogs`, this.GetAllBlogs);
        this.router.get(`${this.path}/get-blog/:id`, this.GetBlogById);
    }
}
exports.default = BlogsController;
