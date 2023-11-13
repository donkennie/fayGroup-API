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
const user_model_1 = __importDefault(require("../models/user.model"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
class UserService {
    constructor() {
        this.user = user_model_1.default;
    }
    register(name, email, uploadPicture, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.user.findOne({ email });
                if (existingUser != null) {
                    throw new Error("User already exists.");
                }
                const newUser = yield this.user.create({
                    name,
                    email,
                    uploadPicture: uploadPicture,
                    password
                });
                //const accessToken = jwtToken.createToken(newUser)
                return newUser._id.toHexString();
            }
            catch (error) {
                throw new Error("You've entered wrong credentials");
            }
        });
    }
    Login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            {
                try {
                    const user = yield this.user.findOne({ email });
                    if (!user) {
                        throw new Error('Unable to find user with that username');
                    }
                    if (yield user.isValidPassword(password)) {
                        const token = jwtToken_1.default.createToken(user);
                        return { token, profilePicture: user.profilePicture, name: user.name, email: user.email };
                    }
                    else {
                        throw new Error('Wrong credentials given');
                    }
                }
                catch (error) {
                    throw new Error("Something went wrong");
                }
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.user.findById(userId);
                if (existingUser === null) {
                    throw new Error("No user exists with this ID.");
                }
                return { profilePicture: existingUser.profilePicture, name: existingUser.name };
            }
            catch (error) {
                return new Error("User not found or an error occurred.");
            }
        });
    }
}
exports.default = UserService;
