"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
    },
    blogPictureUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Blog', BlogSchema);
