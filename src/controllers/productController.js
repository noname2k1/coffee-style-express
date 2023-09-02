import ProductModel from '../models/productModel.js';
import HandleError from '../utils/HandleError.js';
import HandleResponseJson from '../utils/HandleResponseJson.js';

const productController = {
    // [GET] `/api/v1/products?skip=${skip}&limit=${limit}&name=${name}&category=${category}`
    index: async (req, res) => {
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 0;
        const name = req.query.name ?? '';
        const category = req.query.category ?? '';
        const random = req.query['random'] ?? ''; //mark: [slug]*[randomsize]
        if (name) {
            const products = await ProductModel.find({
                name: { $regex: new RegExp(name, 'i') },
            })
                .skip(+skip)
                .limit(+limit);
            return res.json(new HandleResponseJson(products));
        }
        if (category) {
            const products = await ProductModel.find({
                category: { $regex: new RegExp(category, 'i') },
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
                slug: { $ne: slug },
            })
                .skip(randomNum)
                .limit(randomSize);
            if (products.length === +randomSize) {
                return res.json(new HandleResponseJson(products));
            } else {
                const newLimit = +randomSize - products.length;
                const bonusProducts = await ProductModel.find({
                    slug: { $ne: slug },
                })
                    .skip(0)
                    .limit(newLimit);
                return res.json(
                    new HandleResponseJson([...products, ...bonusProducts])
                );
            }
        }
        const products = await ProductModel.find({}).skip(+skip).limit(+limit);
        if (!products) next(new HandleError());
        return res.json(new HandleResponseJson(products));
    },
    // [GET] '/api/v1/products/:slug'
    show: async (req, res, next) => {
        const slug = req.params.slug;
        try {
            const existedProduct = await ProductModel.findOne({
                slug,
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
        const idsConverted = ids
            .split(',')
            .map((idQuantity) => {
                const [id, quantity] = idQuantity.split('*');
                return id;
            })
            .slice(0, ids.split(',').length - 1);
        const quantities = ids
            .split(',')
            .map((idQuantity) => {
                const [id, quantity] = idQuantity.split('*');
                return quantity;
            })
            .slice(0, ids.split(',').length - 1);
        try {
            const products = await ProductModel.find({
                _id: {
                    $in: idsConverted,
                },
            });
            // console.log(existedCart);
            if (!products)
                next(new HandleError(404, "Products doesn't existed!"));
            const productsCoverted = products.map((product, index) => {
                return {
                    ...product._doc,
                    quantityInCart: quantities[index],
                };
            });
            return res.json(new HandleResponseJson(productsCoverted));
        } catch (error) {
            next(error);
        }
    },
    // new: async (req, res, next) => {},
    // update: async (req, res, next) => {},
    // delete: async (req, res, next) => {},
};

export default productController;
