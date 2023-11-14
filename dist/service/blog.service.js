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
                const blogs = yield this.blog.find().populate('user', '-_id name profilePicture')
                    .lean();
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
                const blog = yield this.blog.findById(blogId).populate('user', '_id name profilePicture')
                    .select('-_id -user')
                    .lean();
                if (blog === null) {
                    throw new Error("Not found with the blog Id provided.");
                }
                return blog;
            }
            catch (error) {
                console.error(error); // Log the actual error for debugging
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
    UpdateBlog(id, title, userId, content, blogPictureUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogFromDb = yield this.blog.findById(id);
                if (blogFromDb === null) {
                    throw new Error("Not found with the blog Id provided.");
                }
                const createBlog = yield this.blog.updateOne({
                    title,
                    content,
                    userId,
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
