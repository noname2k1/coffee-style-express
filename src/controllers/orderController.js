import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/productModel.js';
import HandleError from '../utils/HandleError.js';
import HandleResponseJson from '../utils/HandleResponseJson.js';

const orderController = {
    // [GET] '/orders'
    index: async (req, res, next) => {
        try {
            const userid = req.query.userid;
            const skip = req.query.skip ?? 0;
            const limit = req.query.limit ?? 0;

            if (!userid) {
                return res.json(
                    new HandleResponseJson(
                        await OrderModel.find({}).skip(+skip).limit(+limit)
                    )
                );
            }
            const myOrders = await OrderModel.find({
                userid
            })
                .skip(+skip)
                .limit(+limit);
            return res.json(new HandleResponseJson(myOrders));
        } catch (error) {
            console.log(error);
            next(new HandleError());
        }
    },
    // [GET] '/orders/:userid'
    show: async (req, res, next) => {
        try {
            const userid = req.params.userid;
            if (!userid) {
                next(new HandleError(400, 'userid is required!'));
            }
            const existedOrder = await OrderModel.findOne({
                userid
            }).populate('products');
            if (!existedOrder) {
                return next(new HandleError(404, 'order not found!'));
            }
            return res.json(new HandleResponseJson(existedOrder));
        } catch (error) {
            console.log(error);
            next(new HandleError());
        }
    },
    // [POST] '/orders'
    new: async (req, res, next) => {
        try {
            const { action } = req.query;
            const { userid, address, contact, products, quantities, method } =
                req.body;
            // products format: [id*quantity]
            if (!userid) {
                next(new HandleError(400, 'userid is required!'));
            }
            if (!address) {
                next(new HandleError(400, 'address is required!'));
            }
            if (!contact) {
                next(new HandleError(400, 'contact is required!'));
            }
            const existedOrder = await OrderModel.findOne({
                userid,
                disabled: false
            }).populate('products');
            if (existedOrder) {
                if (action === 'find') {
                    return res.json(new HandleResponseJson(existedOrder));
                }
                return next(new HandleError(404, 'order existed!'));
            }
            const productPrices = [];
            for (let id of products) {
                const product = await ProductModel.findOne({ _id: id });
                productPrices.push(product.price);
            }
            const METHODS = [
                {
                    name: 'Momo',
                    value: 'momo',
                    discount: 0.025
                },
                {
                    name: 'VISA',
                    value: 'visa',
                    discount: 0.005
                },
                {
                    name: 'DEBIT CARD',
                    value: 'debit_card',
                    discount: 0.01
                }
            ];
            await OrderModel.create({
                userid,
                address,
                contact,
                products,
                quantities,
                method,
                total:
                    productPrices.reduce(
                        (sum, price, index) => sum + price * quantities[index],
                        0
                    ) -
                    productPrices.reduce(
                        (sum, price, index) => sum + price * quantities[index],
                        0
                    ) *
                        METHODS.find(
                            (paymentMethod) => paymentMethod.value === method
                        ).discount
            });
            const createdOrder = await OrderModel.findOne({
                userid,
                disabled: false
            }).populate('products');
            return res.json(new HandleResponseJson(createdOrder));
        } catch (error) {
            console.log(error);
            next(new HandleError());
        }
    }
};

export default orderController;
