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
const user_service_1 = __importDefault(require("../service/user.service"));
const http_exception_1 = __importDefault(require("../middleware/http.exception"));
const authenticated_middleware_1 = __importDefault(require("../middleware/authenticated.middleware"));
const exception_middleware_1 = __importDefault(require("../middleware/exception.middleware"));
const user_validator_1 = __importDefault(require("../validator/user.validator"));
class UserController {
    constructor() {
        this.path = '/register';
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, email, password, profilePicture } = req.body;
                const newUser = yield this.UserService.register(_id, name, email, password, profilePicture);
                res.status(201).json({ userId: newUser });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userLogin = yield this.UserService.Login(email, password);
                if (!userLogin)
                    res.status(400).json({ success: false, message: 'Wrong Credentials' });
                res.status(201).json(Object.assign({}, userLogin));
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new http_exception_1.default(404, 'No logged in user'));
            }
            res.status(200).send({ data: req.user });
        };
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/users`, (0, exception_middleware_1.default)(user_validator_1.default.register), this.register);
        this.router.post(`/sign-in`, (0, exception_middleware_1.default)(user_validator_1.default.login), this.login);
        this.router.get(`${this.path}`, authenticated_middleware_1.default, this.getUser);
    }
}
exports.default = UserController;
