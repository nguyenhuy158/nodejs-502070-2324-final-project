const express = require("express");
const router = express.Router();
const productCategoryApiController = require("../controllers/productCategoryApiController.js");

router
    .get("/",
        productCategoryApiController.getApiProductCategories)
    .post("/",
        productCategoryApiController.postApiProductCategory)
    .get("/:id",
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.getApiProductCategory)
    .put("/:id",
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.putApiProductCategory
    )
    .delete("/:id",
        productCategoryApiController.checkAndParseObjectId,
        productCategoryApiController.deleteApiProductCategoryById);

module.exports = router;