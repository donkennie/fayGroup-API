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
const http_exception_1 = __importDefault(require("../middleware/http.exception"));
const exception_middleware_1 = __importDefault(require("../middleware/exception.middleware"));
const blog_service_1 = __importDefault(require("../service/blog.service"));
const blog_validator_1 = __importDefault(require("../validator/blog.validator"));
const blog_model_1 = __importDefault(require("../models/blog.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class BlogsController {
    constructor() {
        this.path = '/blog';
        this.router = (0, express_1.Router)();
        this.user = user_model_1.default;
        this.BlogService = new blog_service_1.default();
        this.blog = blog_model_1.default;
        this.createBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, content, title, blogPictureUrl } = req.body;
                const user = yield this.user.findOne({ userId: userId });
                if (!user)
                    res.status(401).json({ success: false, message: 'No user is found with this ID' });
                const blog = yield this.BlogService.createBlog(userId, content, title, blogPictureUrl);
                res.status(201).json({ userId: blog });
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
                const { blogId } = req.params;
                const blog = yield this.BlogService.getBlogById(blogId);
                res.status(200).json({ blog });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.updateBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogId, content, title, blogPictureUrl } = req.body;
                const newUser = yield this.BlogService.UpdateBlog(blogId, content, title, blogPictureUrl);
                res.status(201).json({ userId: newUser });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.DeleteBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogId } = req.params;
                const blog = yield this.blog.findByIdAndDelete(blogId);
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
        this.router.post(`${this.path}/create-blog`, (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.createBlog);
        this.router.put(`${this.path}/update-blog/:id`, (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.updateBlog);
        this.router.delete(`${this.path}/delete-blog/:id`, this.DeleteBlog);
        this.router.get(`${this.path}/get-blogs`, this.GetAllBlogs);
        this.router.get(`${this.path}/get-blog/:id`, this.GetBlogById);
    }
}
exports.default = BlogsController;
