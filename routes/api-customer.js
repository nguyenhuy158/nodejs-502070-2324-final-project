const express = require("express");
const router = express.Router();
const apiCustomerController = require("../controllers/api-customer-controller");


router
    .use((req, res, next) => {
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