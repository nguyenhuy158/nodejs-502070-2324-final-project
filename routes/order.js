const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

router
    .get("/", orderController.getOrders)
    .get(/^\/([0-9a-fA-F]{24})$/, orderController.checkOrderIdAndParseObjectId, orderController.getOrder);

module.exports = router;