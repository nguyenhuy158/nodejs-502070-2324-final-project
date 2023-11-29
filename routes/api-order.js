const express = require("express");
const router = express.Router();
const apiOrderController = require("../controllers/api-order-controller");


router
    .get("/",
        apiOrderController.getApiOrders);
// .post("/",
//     apiOrderController.postApiCustomer)
// .get(/^\/(0[0-9]{9})$/,
//     apiOrderController.checkAndCheckPhone,
//     apiOrderController.getApiCustomerByPhone)
// .get(/^\/([0-9a-fA-F]{24})$/,
//     apiOrderController.checkAndParseObjectId,
//     apiOrderController.getApiCustomer)
// .put(/^\/([0-9a-fA-F]{24})$/,
//     apiOrderController.checkAndParseObjectId,
//     apiOrderController.putApiCustomer
// )
// .delete(/^\/([0-9a-fA-F]{24})$/,
//     apiOrderController.checkAndParseObjectId,
//     apiOrderController.deleteApiCustomerById);

module.exports = router;