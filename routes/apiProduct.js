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
    .get("/:id",
        productApiController.checkAndParseObjectId,
        productApiController.getApiProduct)
    .put("/:id",
        productApiController.checkAndParseObjectId,
        productApiController.putApiProduct
    )
    .delete("/:id",
        productApiController.checkAndParseObjectId,
        productApiController.deleteApiProductById);

module.exports = router;