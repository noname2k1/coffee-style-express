import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const cartSchema = new Schema(
    {
        userid: { type: String, unique: true, index: true },
        products: [{ type: String, populate: 'products', unique: true }],
    },
    {
        timestamps: true,
        collection: 'carts',
    }
);

const CartModel = mongoose.model('carts', cartSchema);

export default CartModel;
