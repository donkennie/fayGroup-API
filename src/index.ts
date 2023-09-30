import 'dotenv/config';
import 'module-alias/register';
import validateEnv from './ValidateEnv';
import App from './app';
import UserController from './controllers/user.controller';
import BlogsController from "./controllers/blog.contoller"

validateEnv();


const app = new App([new UserController(), new BlogsController()],
    Number( process.env.PORT)
);

app.listen();