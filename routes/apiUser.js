const express = require("express");
const router = express.Router();
const userApiController = require("../controllers/userApiController");
const { upload } = require("../config/upload");
const { validateCreateAccount } = require('../middlewares/validation');

router
    .use((req, res, next) => {
        console.log(`🚀 --------------------------------------------🚀`);
        console.log(`🚀 🚀 file: apiUser.js:9 🚀 .use 🚀 req`, req.body);
        console.log(`🚀 --------------------------------------------🚀`);

        next();
    })
    .get("/", userApiController.getApiUsers)
    .post("/",
        validateCreateAccount,
        userApiController.postApiUser)
    .get("/:id",
        userApiController.checkAndParseObjectId,
        userApiController.getApiUser)
    .put("/:id",
        userApiController.checkAndParseObjectId,
        userApiController.putApiUser
    )
    .delete("/:id",
        userApiController.checkAndParseObjectId,
        userApiController.deleteApiUserById)
    .get("/resent/:id",
        userApiController.checkAndParseObjectId,
        userApiController.getApiResentMail)
    .get("/sent/:id",
        userApiController.checkAndParseObjectId,
        userApiController.getApiSentMail)
    .put("/:id/lock",
        userApiController.checkAndParseObjectId,
        userApiController.putApiLockAccount)
    .put("/:id/unlock",
        userApiController.checkAndParseObjectId,
        userApiController.putApiUnLockAccount);


module.exports = router;