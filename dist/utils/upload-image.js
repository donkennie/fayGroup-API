"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
cloudinary_1.default.v2.config({
    cloud_name: 'YOUR_CLOUD_NAME',
    api_key: 'YOUR_API_KEY',
    api_secret: 'YOUR_API_SECRET'
});
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};
const uploadImage = (image) => {
    const opts = {}; // You can customize the upload options here
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.error(error.message);
            return reject({ message: error.message });
        });
    });
};
exports.default = uploadImage;
