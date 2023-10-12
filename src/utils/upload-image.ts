import cloudinary  from 'cloudinary';

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.v2.config({
    cloud_name: 'YOUR_CLOUD_NAME',
    api_key: 'YOUR_API_KEY',
    api_secret: 'YOUR_API_SECRET'
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};


const uploadImage = (image: string): Promise<string> => {
    const opts = {}; // You can customize the upload options here

    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(image, opts, (error: any, result: any) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.error(error.message);
            return reject({ message: error.message });
        });
    });
};

export default uploadImage;






