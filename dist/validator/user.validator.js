"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().max(100).min(2).required(),
    email: joi_1.default.string().max(50).email().required(),
    password: joi_1.default.string().min(6).required(),
    username: joi_1.default.string().required(),
});
const login = joi_1.default.object({
    email: joi_1.default.string().max(50).email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.default = { register, login };
