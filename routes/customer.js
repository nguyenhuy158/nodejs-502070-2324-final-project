const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer-controller");

router
    .get("/", customerController.getCustomers)
    .get(/^\/([0-9a-fA-F]{24})$/,
        customerController.checkAndParseObjectId,
        customerController.getCustomerWithPurchase)
    .get(/^\/([0-9a-fA-F]{24})\/purchase$/,
        customerController.checkAndParseObjectId,
        customerController.getCustomerWithPurchase);

module.exports = router;