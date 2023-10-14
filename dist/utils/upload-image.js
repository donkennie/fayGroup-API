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
    cloud_name: 'donkennie',
    api_key: '647322255472842',
    api_secret: 'Ury67INi4VJpIYxT_miVSHviBw8'
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
