import dotenv from 'dotenv';
dotenv.config();
import connectToMongodb from './db/connect.js';
import ProductModel from './models/productModel.js';

const MATERIALS = {
    COFFEE_MUGS: 'Coffee mugs',
    OTHERS: 'Others',
    PREMIUM: 'Premium',
    TEA_MUGS: 'Tea mugs'
};
const products = [
    {
        name: 'Red Love Cup',
        price: 25000,
        oldPrice: 37000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_3_hja8hs.jpg',
        unit: 'VND',
        onsale: true,
        quantity: 100,
        quantityInCart: 0,
        details:
            'Id cupiditate cum sequi eum neque dolorem dicta quisquam non. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti. Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',
        description:
            'Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti. Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus.'
    },
    {
        name: 'black tea cup',
        price: 15000,
        oldPrice: 29000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_4_dio4nn.jpg',
        unit: 'VND',
        onsale: true,
        quantity: 100,
        quantityInCart: 0,
        description:
            'Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti.',
        details:
            'Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'B&W Essentials Mug',
        price: 19000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_5_uypwqj.jpg',
        unit: 'VND',
        slug: 'bw-essentials-mug',
        quantityInCart: 0,
        description:
            'Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates.',
        details:
            'Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'Winter Style Mug',
        price: 25000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_6_zahx0w.jpg',
        unit: 'VND',
        slug: 'winter-style-mug',
        quantityInCart: 0,
        description: 'Ducimus est ut neque sunt eum iusto. Consequatur quia.',
        details:
            'Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'Ceramic Tea',
        price: 46000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_7_mu8vjm.jpg',
        unit: 'VND',
        slug: 'ceramic-tea',
        quantityInCart: 0,
        details:
            'Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',
        description:
            'Id cupiditate cum sequi eum neque dolorem dicta quisquam non. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates.'
    },
    {
        name: 'No Handle Bar Cup',
        price: 34000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632525/cofee-style/product_images/pic_8_znquem.jpg',
        unit: 'VND',
        slug: 'no-handle-bar-cup',
        quantityInCart: 0,
        description:
            'Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti.',
        details:
            'Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'Espresso Cup by Mugs.co',
        price: 25000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632525/cofee-style/product_images/pic_9_difec0.jpg',
        unit: 'VND',
        slug: 'espresso-cup-by-mugsco',
        quantityInCart: 0,
        details:
            'Aut dicta iusto neque ea voluptates. Id cupiditate cum sequi eum neque dolorem dicta quisquam non. Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti. Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',
        description: 'A et quia qui quia. Sunt tempore est sit facilis.'
    },
    {
        name: 'Pink Premium Ceramic',
        price: 99000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_1_c19p13.jpg',
        unit: 'VND',
        slug: 'pink-premium-ceramic',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Aut dicta iusto neque ea voluptates. Id cupiditate cum sequi eum neque dolorem dicta quisquam non. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',
        description:
            'A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'Summer Designer Cup',
        price: 29000,
        quantity: 1000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632525/cofee-style/product_images/pic_10_fldk0i.jpg',
        unit: 'VND',
        slug: 'summer-designer-cup',
        quantityInCart: 0,
        details:
            'A et quia qui quia. Sunt tempore est sit facilis. Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti. Reprehenderit quisquam omnis omnis velit commodi. Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',
        description:
            'Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti.'
    },
    {
        name: 'Golden Designers Mug',
        price: 50000,
        oldPrice: 69000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632524/cofee-style/product_images/pic_2_qmf5sh.jpg',
        unit: 'VND',
        onsale: true,
        slug: 'golden-designers-mug',
        quantity: 100,
        quantityInCart: 0,
        details: `Y'all ready for this? Get your 30oz powder coated tumblers laser etched with our limited edition designs! Stainless Steel Tumblers retain Heat & Cold - not like those junk plastic ones you see elsewhere. The tumbler is double wall vacuum insulated with a 24 hour retention ratingHolds a MASSIVE 30 ounces of hot or cold liquids! Tumbler and Lid are BPA Free - Drink in good health!`,
        description:
            'The most versatile furniture system ever created. Designed to fit your life. The most versatile furniture system ever created. Designed to fit your life.'
    },
    {
        name: 'Basic White Mug',
        price: 15000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632526/cofee-style/product_images/pic_18_emxdzq.jpg',
        unit: 'VND',
        slug: 'basic-white-mug',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Aut dicta iusto neque ea voluptates. Id cupiditate cum sequi eum neque dolorem dicta quisquam non. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',

        description:
            'Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto.'
    },
    {
        name: 'Aroma Art Coffee Mug',
        price: 39000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632527/cofee-style/product_images/pic_19_xmuqxq.jpg',
        unit: 'VND',
        slug: 'aroma-art-coffee-mug',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Three local "Czech" style brews available - a lager, a dark and a red (which is a mixture of the other two). The red was my pick of the three. The Golden Mug is a bit of a barn on a reasonably busy street in Dighomi, but has views over the river ... and what looks like a beer garden for warmer weather. The food was standard Georgian fare - okay, but nothing too adventerous - and too much of it fried for my taste. However, the beer makes the trip worthwhile.',

        description:
            'Three local "Czech" style brews available - a lager, a dark and a red (which is a mixture of the other two). The red was my pick of the three.'
    },
    {
        name: 'Blue Premium Mug',
        price: 99000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632527/cofee-style/product_images/pic_20_ofgdov.jpg',
        unit: 'VND',
        slug: 'blue-premium-mug',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',

        description:
            'Amet suscipit omnis eum necessitatibus quos doloribus. Ut placeat et corrupti.'
    },
    {
        name: 'White Ceramic',
        price: 29000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632528/cofee-style/product_images/pic_21_kajszr.jpg',
        unit: 'VND',
        slug: 'white-ceramic',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Animi quaerat sed repellendus. Perspiciatis rerum commodi dolore consequatur voluptates accusantium velit. Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',

        description:
            'Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    },
    {
        name: 'White Mug Essential',
        price: 19000,
        image: 'https://res.cloudinary.com/ninhnam/image/upload/v1693632528/cofee-style/product_images/pic_22_vsfka2.jpg',
        unit: 'VND',
        slug: 'white-mug-essential',
        quantity: 100,
        quantityInCart: 0,
        details:
            'Quas vel perferendis accusantium eum cum voluptates libero doloribus voluptates. A et quia qui quia. Sunt tempore est sit facilis. Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.',

        description:
            'Ducimus est ut neque sunt eum iusto. Consequatur quia occaecati enim omnis repudiandae labore.'
    }
];

connectToMongodb();
ProductModel.insertMany(products)
    .then(() => {
        console.log('Sản phẩm VNDã VNDược tạo thành công.');
    })
    .catch((error) => {
        console.error('VNDã xảy ra lỗi khi tạo sản phẩm:', error);
    });
