"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuration for multer
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `file/user-${path_1.default.extname(file.originalname)}-${Date.now()}.${ext}`);
    },
});
// Multer filter for images
const multerFilter = (req, file, cb) => {
    const allowedFileTypes = ['jpg', 'jpeg', 'gif', 'png'];
    const fileType = file.mimetype.split('/')[1];
    if (allowedFileTypes.includes(fileType)) {
        cb(null, true);
    }
    else {
        cb(new Error('Violated file requirements'));
    }
};
const uploader = (0, multer_1.default)({
    storage: multerStorage,
    limits: { fileSize: 1000000 * 5 },
    fileFilter: multerFilter,
}).single('file');
exports.default = uploader;
