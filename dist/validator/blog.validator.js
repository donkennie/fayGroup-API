"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const blog = joi_1.default.object({
    content: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    blogPictureUrl: joi_1.default.string().required()
});
exports.default = { blog };
