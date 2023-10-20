const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const { faker } = require("@faker-js/faker");
const moment = require("moment");


async function add(req, res, next) {
    const categories = await ProductCategory.find().sort({ name: 1 });
    res.render("pages/products/form", { categories });
};

async function create(req, res, next) {
    const categories = await ProductCategory.find().sort({ name: 1 });
    
    const {
        barcode,
        productName,
        importPrice,
        retailPrice,
        imageUrls,
        category,
        creationDate,
        lastUpdateDate,
    } = req.body;
    
    let product = {
        barcode,
        productName,
        importPrice,
        retailPrice,
        imageUrls,
        category,
        creationDate,
        lastUpdateDate,
    };
    
    try {
        await (new Product({
            barcode,
            productName,
            importPrice,
            retailPrice, imageUrls: imageUrls.split("\n"),
            category,
            creationDate,
            lastUpdateDate,
        })).save();
        req.flash("info", `Add product successfully: ${productName}`);
        res.redirect("/products");
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((e) => e.message);
            console.log("=>(productController.js:64) errors", errors);
            
            req.flash("info", errors);
            res.render("pages/products/form", { product, categories });
        } else {
            console.error("Error:", error);
            next(error);
        }
    }
};

async function createV1(req, res, next) {
    const categories = await ProductCategory.find().sort({ name: 1 });
    
    const productId = req.params.id;
    const {
        barcode,
        productName,
        importPrice,
        retailPrice,
        imageUrls,
        category,
        creationDate,
        lastUpdateDate,
    } = req.body;
    
    let product;
    
    try {
        
        if (productId) {
            // Editing an existing product
            product = await Product.findByIdAndUpdate(
                productId,
                {
                    barcode,
                    productName,
                    importPrice,
                    retailPrice, imageUrls: imageUrls.split("\n"), // Split image URLs by line breaks
                    category,
                    creationDate,
                    lastUpdateDate,
                },
                { new: true }
            );
        } else {
            // Creating a new product
            product = new Product({
                barcode,
                productName,
                importPrice,
                retailPrice, imageUrls: imageUrls.split("\n"), // Split image URLs by line breaks
                category,
                creationDate,
                lastUpdateDate,
            });
            await product.save();
        }
        
        res.redirect("/products"); // Redirect to the product list page after submission
    } catch (error) {
        if (error.name === "ValidationError") {
            // Handle validation errors and send them to the view
            const errors = Object.values(error.errors).map((e) => e.message);
            console.log("=>(productController.js:64) errors", errors);
            
            req.flash("info", errors);
            res.render("pages/products/form", { product, categories });
        } else {
            // Handle other errors
            console.error("Error:", error);
            next(error);
        }
    }
};

async function edit(req, res, next) {
    try {
        const categories = await ProductCategory.find().sort({ name: 1 });
        
        const id = req.params.id;
        
        const product = await Product.findById({ _id: id });
        
        res.render("pages/products/form", { product, categories });
    } catch (error) {
        console.error("Error fetching products:", error);
        next(error);
    }
};

async function get(req, res, next) {
    
    try {
        const id = req.params.id;
        
        const product = await Product.findById({ _id: id });
        res.render("pages/products/detail", { product });
    } catch (error) {
        console.error("Error fetching products:", error);
        next(error);
    }
};


async function gets(req, res, next) {
    const perPage = parseInt(req.query.perPage) || 10;
    let page = parseInt(req.query.page) || 1;
    
    try {
        
        // const products = await Product
        //     .aggregate([{ $sort: { creationDate: -1 } }])
        //     .skip(perPage * page - perPage)
        //     .limit(perPage)
        //     .exec();
        const products = await Product.find()
            .sort({ creationDate: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .populate("category")
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
        res.render("pages/products/list", { ...output, navLink: process.env.NAVBAR_PRODUCT });
        
    } catch (error) {
        console.error("Error fetching products:", error);
        next(error);
    }
};

async function seedDatabaseV1() {
    const products = [];
    const phoneCategory = await ProductCategory.findOne({ name: "Phone" });
    const accessoriesCategory = await ProductCategory.findOne({ name: "Accessories" });
    
    for (let i = 0; i < 50; i++) {
        const product = {
            barcode: faker.string.uuid(),
            productName: faker.commerce.productName(),
            importPrice: faker.number.int({ min: 1000, max: 10000 }),
            retailPrice: faker.number.int({ min: 1000, max: 10000 }),
            imageUrls: [faker.image.url(), faker.image.url(), faker.image.url()],
            category: faker.helpers.arrayElements([phoneCategory, accessoriesCategory])[0],
            creationDate: faker.date.past(),
            lastUpdateDate: faker.date.recent(),
        };
        products.push(product);
    }
    
    try {
        await Product.insertMany(products);
        console.log("Sample products inserted successfully.");
    } catch (err) {
        console.error("Error inserting sample products:", err);
    } finally {
    }
};


module.exports = {
    create,
    add,
    add,
    edit,
    get,
    gets, seedDatabase: seedDatabaseV1,
};