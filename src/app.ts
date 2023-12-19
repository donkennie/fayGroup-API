import express, { Application } from 'express';
import Mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from './interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import helmet from 'helmet';
import path from 'path';
import https from 'https'
import * as http from 'http';
import * as fs from 'fs';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    

    private initialiseDatabaseConnection(): void {

         const { MONGO_PATH } = process.env;

         Mongoose.connect(
            `${MONGO_PATH}`
         ).then(() => {
            console.log('DB connection successful');
          });
               
    }


    public listen(): void {

      const options = {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt'),
        ca: fs.readFileSync('./ssl/ca_bundle.crt'),
        };
        var app = this.express;
        var server = require('https').createServer(options, app);

        this.express = server;
        server.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    };
    
}


export default App;