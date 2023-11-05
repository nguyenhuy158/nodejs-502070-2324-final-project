const express = require("express");
const router = express.Router();
const apiCustomerController = require("../controllers/apiCustomerController");


router
    .get("/",
        apiCustomerController.getApiCustomers)
    .post("/",
        apiCustomerController.postApiCustomer)
    .get("/:id",
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.getApiCustomer)
    .get("/:phone",
        apiCustomerController.checkAndCheckPhone,
        apiCustomerController.getApiCustomerByPhone)
    .put("/:id",
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.putApiCustomer
    )
    .delete("/:id",
        apiCustomerController.checkAndParseObjectId,
        apiCustomerController.deleteApiCustomerById);

module.exports = router;