import OrderModel from '../models/orderModel.js';
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
                return await OrderModel.find({}).skip(+skip).limit(+limit);
            }
            return await OrderModel.find({
                userid,
            })
                .skip(+skip)
                .limit(+limit);
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
                userid,
                disabled: false,
            });
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
            const { userid, address, contact, products } = req.body;
            if (!userid) {
                next(new HandleError(400, 'userid is required!'));
            }
            if (!address) {
                next(new HandleError(400, 'address is required!'));
            }
            if (!contact) {
                next(new HandleError(400, 'contact is required!'));
            }

            const createdOrder = await OrderModel.create({
                userid,
                address,
                contact,
            });
            return res.json(new HandleResponseJson(createdOrder));
        } catch (error) {
            console.log(error);
            next(new HandleError());
        }
    },
};

export default orderController;
