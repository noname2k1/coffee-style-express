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
        onsale: { type: Boolean, default: false },
        material: {
            type: String,
            enum: ['ceramic', 'glass', 'crystal', 'metal'],
            default: 'ceramic'
        },
        brand: { type: String, default: 'none' },
        slug: { type: String, unique: true },
        color: { type: String, default: 'white' },
        handler: { type: Boolean, default: true },
        diameter: { type: [Number], default: [8, 10, 12] },
        height: { type: [Number], default: [10, 12, 15] },
        pattern: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        collection: 'products'
    }
);

productSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=_id%>-<%=name%>' });

const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;
