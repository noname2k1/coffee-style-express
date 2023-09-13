import CartModel from '../models/cartModel.js';
import HandleError from '../utils/HandleError.js';
import HandleResponseJson from '../utils/HandleResponseJson.js';
const cartController = {
    // [GET] '/carts'
    index: async (req, res) => {
        return res.json({
            success: true,
            data: await CartModel.find({})
        });
    },
    // [GET] '/carts/:userid'
    show: async (req, res, next) => {
        const userid = req.params.userid;
        console.log(userid);
        try {
            if (!userid) {
                next(new HandleError(400, 'userid required!'));
            }
            const existedCart = await CartModel.findOne({
                userid
            });
            // console.log(existedCart);
            if (!existedCart)
                next(new HandleError(404, "Cart doesn't existed!"));
            return res.json(new HandleResponseJson(existedCart));
        } catch (error) {
            next(error);
        }
    },
    // [POST] '/carts'
    new: async (req, res, next) => {
        const userid = req.body.userid;
        try {
            if (!userid) {
                next(new HandleError(400, 'userid required!'));
            }
            const existedCart = await CartModel.findOne({
                userid
            });
            // console.log(existedCart);
            if (existedCart) next(new HandleError(400, 'Cart existed!'));
            const createCart = await CartModel.create({
                userid
            });
            return res.json(new HandleResponseJson(createCart));
        } catch (error) {
            next(error);
        }
    },
    // [PATCH] '/carts/:userid'
    update: async (req, res, next) => {
        const userid = req.params.userid;
        const products = req.body.products;
        try {
            if (!userid) {
                next(new HandleError(400, 'userid required!'));
            }
            if (!products) {
                next(new HandleError(404, 'products required!'));
            }
            const existedCart = await CartModel.findOne({
                userid
            });
            // console.log(existedCart);
            if (!existedCart) {
                const newCart = await CartModel.create({
                    userid,
                    products
                });
                return res.json(new HandleResponseJson(newCart));
            }
            const updatedCart = await CartModel.findOneAndUpdate(
                {
                    userid
                },
                {
                    products
                },
                {
                    new: true
                }
            );
            return res.json(new HandleResponseJson(updatedCart));
        } catch (error) {
            next(error);
        }
    }
    // [DEL] '/carts/:userid'
    // delete: async (req, res, next) => {},
};

export default cartController;
