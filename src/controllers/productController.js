import ProductModel from '../models/productModel.js';
import HandleError from '../utils/HandleError.js';
import HandleResponseJson from '../utils/HandleResponseJson.js';

const productController = {
    // [GET] `/api/v1/products?skip=${skip}&limit=${limit}&name=${name}&category=${category}`
    index: async (req, res) => {
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 0;
        const name = req.query.name ?? '';
        const material = req.query.material ?? '';
        const color = req.query.color ?? '';
        const characteristic = req.query.characteristic ?? '';
        const brand = req.query.brand ?? 'none';
        const diameter = req.query.diameter ?? 0;
        const height = req.query.height ?? 0;
        const random = req.query['random'] ?? ''; //mark: [slug]*[randomsize]
        if (name) {
            const products = await ProductModel.find({
                name: { $regex: new RegExp(name, 'i') }
            })
                .skip(+skip)
                .limit(+limit);
            return res.json(new HandleResponseJson(products));
        }
        if (random) {
            const [slug, randomSize] = random.split('*');
            const count = await ProductModel.count();
            const randomNum = Math.floor(Math.random() * count);
            const products = await ProductModel.find({
                slug: { $ne: slug }
            })
                .skip(randomNum)
                .limit(randomSize);
            if (products.length === +randomSize) {
                return res.json(new HandleResponseJson(products));
            } else {
                const newLimit = +randomSize - products.length;
                const bonusProducts = await ProductModel.find({
                    slug: { $ne: slug }
                })
                    .skip(0)
                    .limit(newLimit);
                return res.json(
                    new HandleResponseJson([...products, ...bonusProducts])
                );
            }
        }

        let pageCount;

        if (
            material ||
            color ||
            characteristic ||
            brand ||
            diameter ||
            height
        ) {
            let query = {};
            if (material) query['material'] = material;
            if (color) query['color'] = color;
            if (characteristic) {
                const characteristics = characteristic
                    .split(',')
                    .reduce((acc, curr) => {
                        acc[curr] = true;
                        return acc;
                    }, {});
                query = { ...query, ...characteristics };
            }
            if (brand) query['brand'] = brand;
            if (diameter) query['diameter'] = diameter;
            if (height) query['height'] = height;
            const products = await ProductModel.find({ ...query })
                .skip(+skip)
                .limit(+limit);
            const countDocuments = await ProductModel.countDocuments({
                ...query
            });
            if (limit) {
                pageCount = Math.ceil(countDocuments / limit);
            } else {
                pageCount = 0;
            }
            return res.json(new HandleResponseJson(products, pageCount));
        }
        const products = await ProductModel.find({}).skip(+skip).limit(+limit);
        const countDocuments = await ProductModel.countDocuments();
        if (limit) {
            pageCount = Math.ceil(countDocuments / limit);
        } else {
            pageCount = 0;
        }
        if (!products) next(new HandleError());
        return res.json(new HandleResponseJson(products, pageCount));
    },
    // [GET] '/api/v1/products/:slug'
    show: async (req, res, next) => {
        const slug = req.params.slug;
        try {
            const existedProduct = await ProductModel.findOne({
                slug
            });
            // console.log(existedCart);
            if (!existedProduct)
                next(new HandleError(404, "Product doesn't existed!"));
            return res.json(new HandleResponseJson(existedProduct));
        } catch (error) {
            next(error);
        }
    },
    // [GET] '/api/v1/products/show-many/:ids' (use for get product from cart)
    showMore: async (req, res, next) => {
        const ids = req.params.ids;
        // console.log(ids);
        const idsConverted = ids
            .split(',')
            .map((idQuantity) => {
                const [id] = idQuantity.split('*');
                return id;
            })
            .slice(0, ids.split(',').length - 1);
        const quantities = ids
            .split(',')
            .map((idQuantity) => {
                const [, quantity] = idQuantity.split('*');
                return quantity;
            })
            .slice(0, ids.split(',').length - 1);
        const diameters = ids
            .split(',')
            .map((idQuantity) => {
                const [, , diameter] = idQuantity.split('*');
                return diameter;
            })
            .slice(0, ids.split(',').length - 1);
        const heights = ids
            .split(',')
            .map((idQuantity) => {
                const [, , , height] = idQuantity.split('*');
                return height;
            })
            .slice(0, ids.split(',').length - 1);
        try {
            let products = [];
            // console.log(idsConverted);
            for (let id of idsConverted) {
                const product = await ProductModel.findOne({
                    _id: id
                });
                products.push(product);
            }
            // console.log(existedCart);
            if (!products)
                next(new HandleError(404, "Products doesn't existed!"));
            const productsCoverted = products.map((product, index) => {
                return {
                    ...product._doc,
                    quantityInCart: quantities[index],
                    size: {
                        diameter: diameters[index],
                        height: heights[index]
                    }
                };
            });
            return res.json(new HandleResponseJson(productsCoverted));
        } catch (error) {
            next(error);
        }
    }
    // new: async (req, res, next) => {},
    // update: async (req, res, next) => {},
    // delete: async (req, res, next) => {},
};

export default productController;
