import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import productController from './controllers/productController.js';
import cartController from './controllers/cartController.js';
import connectToMongodb from './db/connect.js';
const app = express();
import cors from 'cors';
const port = 9900;
connectToMongodb();

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Middleware để xử lý dữ liệu x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

const prefix = '/api/v1/';
// products
app.get(prefix + 'products', productController.index);
app.get(prefix + 'products/:slug', productController.show);
app.get(prefix + 'products/show-many/:ids', productController.showMore);

// carts
app.get(prefix + 'carts', cartController.index);
app.get(prefix + 'carts/:userid', cartController.show);
app.post(prefix + 'carts', cartController.new);
app.patch(prefix + 'carts/:userid', cartController.update);

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

app.listen(port, () => {
    console.log(`web app listening on: http://localhost:${port}`);
});

export default app;
