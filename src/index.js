import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import productController from './controllers/productController.js';
import cartController from './controllers/cartController.js';
import connectToMongodb from './db/connect.js';
import cors from 'cors';
import cron from 'node-cron';
import OrderModel from './models/orderModel.js';
import orderController from './controllers/orderController.js';

const app = express();
const port = 9900;
connectToMongodb();

const corsOptions = {
    // origin: process.env.CLIENT_ORIGIN,
    origin: '*',
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

// orders
app.get(prefix + 'orders', orderController.index);
app.get(prefix + 'orders/:userid', orderController.show);
app.post(prefix + 'orders', orderController.new);
// app.patch(prefix + 'orders/:userid', cartController.update);

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Lập lịch chạy mỗi phút để kiểm tra và cập nhật trạng thái
cron.schedule('* * * * *', async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // Lấy thời điểm 10 phút trước
    await OrderModel.updateMany(
        { ispaid: false, createdAt: { $lt: tenMinutesAgo } },
        { disabled: true }
    );
});

app.listen(port, () => {
    console.log(`web app listening on: http://localhost:${port}`);
});

export default app;
