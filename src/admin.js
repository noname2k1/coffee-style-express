import dotenv from 'dotenv';
dotenv.config();
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import express from 'express';
import MongoStore from 'connect-mongo';
import connectToMongodb from './db/connect.js';
import ProductModel from './models/productModel.js';
import CartModel from './models/cartModel.js';

const PORT = 3000;

const DEFAULT_ADMIN = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
};

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});

const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};

const start = async () => {
    const app = express();
    connectToMongodb();

    const admin = new AdminJS({
        resources: [ProductModel, CartModel],
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'sessionsecret',
        },
        null,
        {
            store: MongoStore.create({
                mongoUrl: 'mongodb://localhost:27017/adminjs',
            }),
            resave: true,
            saveUninitialized: true,
            secret: 'sessionsecret',
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            },
            name: 'adminjs',
        }
    );
    app.use(admin.options.rootPath, adminRouter);

    app.listen(PORT, () => {
        console.log(
            `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
        );
    });
};

start();
