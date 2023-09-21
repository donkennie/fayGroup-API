"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BlogsController {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        // this.initialiseRoutes();
    }
}
exports.default = BlogsController;
