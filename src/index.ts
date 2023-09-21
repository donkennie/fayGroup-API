import 'dotenv/config';
import 'module-alias/register';
import validateEnv from './ValidateEnv';
import App from './app';
import BlogsController from "./controllers/blog.contoller"

validateEnv();


const app = new App([new BlogsController()],
    Number( process.env.PORT)
);

app.listen();