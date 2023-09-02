import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
const Schema = mongoose.Schema;
const productSchema = new Schema(
    {
        name: { type: String },
        price: { type: Number },
        oldPrice: { type: Number, default: 0 },
        image: { type: String },
        unit: { type: String },
        description: { type: String },
        quantity: { type: Number },
        details: { type: String },
        dimensions: [Number],
        onSale: { type: Boolean, default: false },
        category: {
            type: String,
            enum: ['Coffee mugs', 'Premium', 'Tea mugs', 'Others'],
        },
        slug: { type: String, unique: true },
    },
    {
        timestamps: true,
        collection: 'products',
    }
);

productSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=_id%>-<%=name%>' });

const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;
