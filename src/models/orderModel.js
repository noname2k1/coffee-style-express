import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const orderSchema = new Schema(
    {
        userid: { type: String, unique: true, index: true },
        address: { type: String },
        contact: { type: String },
        ispaid: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        method: { type: String, enum: ['momo', 'visa', 'debit_card'] },
        products: [{ type: String, populate: 'products' }],
    },
    {
        timestamps: true,
        collection: 'orders',
    }
);

const OrderModel = mongoose.model('orders', orderSchema);
export default OrderModel;
