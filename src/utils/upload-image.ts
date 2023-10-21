import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";

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
cloudinary.v2.config({
  cloud_name: "donkennie",
  api_key: "647322255472842",
  api_secret: "Ury67INi4VJpIYxT_miVSHviBw8",
});


const uploadImage = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(file);
    cloudinary.v2.uploader.upload(
      file,
      { overwrite: true },
      (error: any, result: any) => {
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject({ message: error ? error.message : 'Unknown error' });
        }
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, callback) => {
    // Extract the file extension from the original filename
    const fileExt = path.extname(file.originalname);
    const uniqueFilename = `${Date.now()}${fileExt}`;

    callback(null, uniqueFilename);
  },
});

export const upload = multer({storage})

export default uploadImage;
