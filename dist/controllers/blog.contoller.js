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
class BlogsController {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.BlogService = new blog_service_1.default();
        this.createBlog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, userId, content, title, blogPictureUrl } = req.body;
                const newUser = yield this.BlogService.createBlog(_id, userId, content, title, blogPictureUrl);
                res.status(201).json({ userId: newUser });
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
                const { blogId } = req.body;
                const blogs = yield this.BlogService.getBlogById(blogId);
                res.status(200).json({ blogs });
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
                const { blogId } = req.body;
                const blogs = yield this.BlogService.deleteBlogById(blogId);
                res.status(200).json({ blogs });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/blog`, (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.createBlog);
        this.router.put(`${this.path}/blog`, (0, exception_middleware_1.default)(blog_validator_1.default.blog), this.updateBlog);
        this.router.delete(`${this.path}/blog`, this.DeleteBlog);
        this.router.get(`${this.path}`, this.GetAllBlogs);
        this.router.get(`${this.path}`, this.GetBlogById);
    }
}
exports.default = BlogsController;
