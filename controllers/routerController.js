require("dotenv").config();
const { transporter } = require("../config/email");
const compiledFunction = require("pug").compileFile("./views/email/email-template.pug");
const productController = require("../controllers/productController");
const { faker } = require("@faker-js/faker");
const ProductCategory = require("../models/productCategory");
const Product = require("../models/product");
const Order = require("../models/order");
const Customer = require("../models/customer");
const User = require("../models/user");

const emailData = {
    username: "Tech Hut",
    password: "Tech Hut",
};

exports.checkFirstLogin = (req, res, next) => {
    const user = req.user;
    
    if (user && user.isFirstLogin) {
        return res.redirect("/change-password");
    }
    
    next();
};

exports.sentMail = (req, res) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: "quocanh01062002@gmail.com",
        subject: "TEST MESSAGE",
        html: compiledFunction(emailData)
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
        res.redirect("/");
    });
};

exports.home = (req, res) => {
    res.render("pages/home", { title: "Home", app_name: process.env.APP_NAME });
};

exports.about = (req, res) => {
    res.render("pages/about", { navLink: "About" });
};

exports.permissionDenied = (req, res) => {
    res.render("pages/permission-denied");
};

exports.randomProduct = (req, res) => {
    productController.seedDatabaseV1();
    res.redirect("/");
};

async function createSampleDataCustomer() {
    try {
        // Create Customers
        const customers = [];
        for (let i = 0; i < 10; i++) {
            const customer = new Customer({
                phone: faker.phone.number("#### ### ###"),
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
            });
            customers.push(customer);
        }
        await Customer.insertMany(customers);
        
        console.log("Sample customer data created successfully.");
    } catch (error) {
        console.error("Error creating sample customer data:", error);
    }
}

async function createSampleDataProduct() {
    try {
        // Create Product Categories
        const productCategories = await ProductCategory.find();
        
        // Create Products
        const products = [];
        for (let i = 0; i < 20; i++) {
            const product = new Product({
                barcode: faker.datatype.uuid(),
                productName: faker.commerce.productName(),
                importPrice: faker.datatype.number({ min: 1000, max: 1000000000 }),
                retailPrice: faker.datatype.number({ min: 1000, max: 2000000000 }),
                imageUrls: [faker.image.imageUrl()],
                category: productCategories[Math.floor(Math.random() * productCategories.length)],
                creationDate: faker.date.past(),
                lastUpdateDate: faker.date.recent(),
            });
            products.push(product);
        }
        await Product.insertMany(products);
        
        console.log("Sample product data created successfully.");
    } catch (error) {
        console.error("Error creating sample product data:", error);
    }
}

async function createSampleDataProductCategory() {
    try {
        // Create Product Categories
        const productCategories = [];
        for (let i = 0; i < 5; i++) {
            const category = new ProductCategory({
                name: faker.commerce.productName(), description: faker.lorem.sentence(),
            });
            productCategories.push(category);
        }
        await ProductCategory.insertMany(productCategories);
        
        console.log("Sample product category data created successfully.");
    } catch (error) {
        console.error("Error creating sample product category data:", error);
    }
}

async function createSampleDataOrder() {
    try {
        // Create Customers and Products
        const customers = await Customer.find();
        const products = await Product.find();
        
        // Create Orders
        const orders = [];
        for (let i = 0; i < 30; i++) {
            const order = new Order({
                customer: customers[Math.floor(Math.random() * customers.length)],
                products: products
                    .slice(faker.datatype.number({ min: 0, max: products.length - 1 }))
                    .map((product) => {
                        return {
                            product: product, unitPrice: 100
                        };
                    }),
                totalAmount: faker.datatype.number({ min: 10, max: 5000 }),
                givenAmount: faker.datatype.number({ min: 10, max: 6000 }),
                changeAmount: faker.datatype.number({ min: 0, max: 1000 }),
                purchaseDate: faker.date.recent(),
            });
            orders.push(order);
        }
        await Order.insertMany(orders);
        
        console.log("Sample order data created successfully.");
    } catch (error) {
        console.error("Error creating sample order data:", error);
    }
}

exports.createSampleData = async function (req, res, next) {
    await createSampleDataCustomer();
    await createSampleDataProductCategory();
    await createSampleDataProduct();
    await createSampleDataOrder();
    return res.redirect("/");
};

