"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// Configuration for multer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(
//       null,
//       `file/user-${path.extname(file.originalname)}-${Date.now()}.${ext}`
//     );
//   },
// });
// // Multer filter for images
// const multerFilter = (req: any, file: any, cb: any) => {
//   const allowedFileTypes = ["jpg", "jpeg", "gif", "png"];
//   const fileType = file.mimetype.split("/")[1];
//   if (allowedFileTypes.includes(fileType)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Violated file requirements"));
//   }
// };
// const handleMultipartData = multer({
//   storage: multerStorage,
//   limits: { fileSize: 1000000 * 5 },
//   fileFilter: multerFilter,
// }).single("image");
// Cloudinary configuration
cloudinary_1.default.v2.config({
    cloud_name: "donkennie",
    api_key: "647322255472842",
    api_secret: "Ury67INi4VJpIYxT_miVSHviBw8",
});
const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        console.log(file);
        cloudinary_1.default.v2.uploader.upload(file, { overwrite: true }, (error, result) => {
            if (result && result.secure_url) {
                resolve(result.secure_url);
            }
            else {
                reject({ message: error ? error.message : 'Unknown error' });
            }
        });
    });
};
const storage = multer_1.default.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        // Extract the file extension from the original filename
        const fileExt = path_1.default.extname(file.originalname);
        const uniqueFilename = `${Date.now()}${fileExt}`;
        callback(null, uniqueFilename);
    },
});
exports.upload = (0, multer_1.default)({ storage });
exports.default = uploadImage;
