const express = require("express");
const router = express.Router();
const apiCartController = require("../controllers/apiCartController");


router
    .get("/",
        apiCartController.getApiCarts)
    // .post("/",
    //     apiCartController.postApiCart)
    .get(/^\/([0-9a-fA-F]{24})$/,
        apiCartController.checkAndParseObjectId,
        apiCartController.getApiCart)
    .get("/current",
        apiCartController.checkCurrentLoginUser,
        apiCartController.getApiCartByCurrentLoginUser)
    .put("/:id/:productId/:quantity",
        apiCartController.checkAndParseObjectId,
        apiCartController.checkProductIdAndParseObjectId,
        apiCartController.checkQuantity,
        apiCartController.putApiCart
    )
    .put("/:id/clear",
        apiCartController.checkAndParseObjectId,
        apiCartController.clearApiCartById
    )
    .delete(/^\/([0-9a-fA-F]{24})$/,
        apiCartController.checkAndParseObjectId,
        apiCartController.deleteApiCartById);

module.exports = router;