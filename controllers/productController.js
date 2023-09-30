const Product = require('../models/productModel');
const { faker } = require('@faker-js/faker');


exports.get = async (req, res, next) => {

    try {
        const id = req.params.id;

        const product = await Product.findById({ _id: id });
        console.log("🚀 ~ file: productController.js:11 ~ exports.get= ~ product:", product);
        res.render('pages/products/detail', { product });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};


exports.gets = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10;
    let page = parseInt(req.query.page) || 1;

    try {

        const products = await Product
            .aggregate([{ $sort: { creationDate: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Product.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const output = {
            products,
            current: page,
            count,
            perPage,
            nextPage: hasNextPage ? nextPage : null
        };
        res.render('pages/products/list', output);

        // console.log("🚀 ~ file: productController.js:25 ~ exports.gets= ~ output:", output);
        console.log("🚀 ~ file: productController.js:7 ~ exports.gets= ~ products:", products.length);
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

exports.seedDatabase = async function () {
    const products = [];

    // Generate 50 sample products
    for (let i = 0; i < 50; i++) {
        const product = {
            barcode: faker.string.uuid(),
            productName: faker.commerce.productName(),
            importPrice: faker.number.int({ min: 1000, max: 10000 }),
            retailPrice: faker.number.int({ min: 1000, max: 10000 }),
            imageUrls: [faker.image.url()],
            category: faker.helpers.arrayElements(['phone', 'accessories'])[0],
            creationDate: faker.date.past(),
            lastUpdateDate: faker.date.recent(),
        };
        products.push(product);
    }

    console.log("🚀 ~ file: productController.js:19 ~ product:", products[0]);

    try {
        // Insert the generated products into the database
        await Product.insertMany(products);
        console.log('Sample products inserted successfully.');
    } catch (err) {
        console.error('Error inserting sample products:', err);
    } finally {
    }
};
