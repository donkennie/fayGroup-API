"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const ValidateEnv_1 = __importDefault(require("./ValidateEnv"));
const app_1 = __importDefault(require("./app"));
const blog_contoller_1 = __importDefault(require("./controllers/blog.contoller"));
(0, ValidateEnv_1.default)();
const app = new app_1.default([new blog_contoller_1.default()], Number(process.env.PORT));
app.listen();
