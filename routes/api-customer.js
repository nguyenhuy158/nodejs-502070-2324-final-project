const express = require("express");
const router = express.Router();
const apiCustomerController = require("../controllers/api-customer-controller");


router
    .use((req, res, next) => {
        console.log(`🚀 🚀 file: apiCustomer.js:8 🚀 .use 🚀 req.params`, req.url);
        console.log(`🚀 🚀 file: apiCustomer.js:8 🚀 .use 🚀 req.params`, req.params);
        console.log(`🚀 🚀 file: apiCustomer.js:8 🚀 .use 🚀 req.params`, req.query);
        console.log(`🚀 🚀 file: apiCustomer.js:8 🚀 .use 🚀 req.params`, req.body);
        next();
    })
    .get("/",
        apiCustomerController.getApiCustomers)
    .post("/",
        apiCustomerController.postApiCustomer)
    .get(/^\/(0[0-9]{9})$/,
        apiCustomerController.checkAndCheckPhone,
        apiCustomerController.getApiCustomerByPhone)
    .get(/^\/([0-9a-fA-F]{24})$/,
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.getApiCustomer)
    .put(/^\/([0-9a-fA-F]{24})$/,
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.putApiCustomer
    )
    .delete(/^\/([0-9a-fA-F]{24})$/,
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.deleteApiCustomerById);

module.exports = router;