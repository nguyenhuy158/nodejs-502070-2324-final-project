const express = require("express");
const router = express.Router();
const productCategoryApiController = require("../controllers/productCategoryApiController.js");

router
    .get("/",
        productCategoryApiController.getApiProductCategories)
    .post("/",
        productCategoryApiController.postApiProductCategory)
    .get(/^\/([0-9a-fA-F]{24})$/,
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.getApiProductCategory)
    .put(/^\/([0-9a-fA-F]{24})$/,
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.putApiProductCategory
    )
    .delete(/^\/([0-9a-fA-F]{24})$/,
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.deleteApiProductCategoryById);

module.exports = router;