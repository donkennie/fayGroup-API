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
const blog_model_1 = __importDefault(require("../models/blog.model"));
class BlogService {
    constructor() {
        this.blog = blog_model_1.default;
    }
    createBlog(userId, content, title, blogPictureUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createBlog = yield this.blog.create({
                    userId,
                    content,
                    title,
                    blogPictureUrl
                });
                return "Created successfully";
            }
            catch (error) {
                throw new Error('Unable to create blog');
            }
        });
    }
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield this.blog.find();
                return blogs;
            }
            catch (error) {
                throw new Error('Unable to fetch the available blogs');
            }
        });
    }
    getBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.blog.findOne({ blogId });
                if (!blog) {
                    throw new Error("Not found with the blog Id provided.");
                }
                return blog;
            }
            catch (error) {
                throw new Error('Unable to fetch the available blog');
            }
        });
    }
    deleteBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.blog.findByIdAndDelete(blogId);
                if (!blog) {
                    throw new Error("Not found with the blog Id provided.");
                }
                return {
                    message: 'Blog deleted successfully'
                };
            }
            catch (error) {
                throw new Error('Unable to fetch the available blog');
            }
        });
    }
    UpdateBlog(id, title, content, blogPictureUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogFromDb = yield this.blog.findOne({ id });
                if (blogFromDb === null) {
                    throw new Error("Not found with the blog Id provided.");
                }
                const createBlog = yield this.blog.updateOne({
                    title,
                    content,
                    blogPictureUrl
                });
                return "Updated successfully";
            }
            catch (error) {
                throw new Error('Unable to update blog');
            }
        });
    }
}
exports.default = BlogService;
