const express = require("express");
const router = express.Router();
const productApiController = require("../controllers/productApiController");
const { upload } = require("../config/upload");

router
    .get("/",
        productApiController.getApiProducts)
    .post("/",
        upload.array("imageUrls", 5),
        productApiController.postApiProduct)
    .get(/^\/([0-9a-fA-F]{24})$/,
        productApiController.checkAndParseObjectId,
        productApiController.getApiProduct)
    .put(/^\/([0-9a-fA-F]{24})$/,
        productApiController.checkAndParseObjectId,
        productApiController.putApiProduct
    )
    .delete(/^\/([0-9a-fA-F]{24})$/,
        productApiController.checkAndParseObjectId,
        productApiController.deleteApiProductById);

module.exports = router;