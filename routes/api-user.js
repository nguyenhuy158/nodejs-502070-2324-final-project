const express = require("express");
const router = express.Router();
const userApiController = require("../controllers/api-user-controller");
const { validateCreateAccount } = require('../middlewares/validation');

router
    .get("/", userApiController.getApiUsers)
    .post("/",
        validateCreateAccount,
        userApiController.postApiUser)
    .get(/^\/([0-9a-fA-F]{24})$/,
        userApiController.checkAndParseObjectId,
        userApiController.getApiUser)
    .put(/^\/([0-9a-fA-F]{24})$/,
        userApiController.checkAndParseObjectId,
        userApiController.putApiUser
    )
    .delete(/^\/([0-9a-fA-F]{24})$/,
        userApiController.checkAndParseObjectId,
        userApiController.deleteApiUserById)
    .get(/^\/resent\/([0-9a-fA-F]{24})$/,
        userApiController.checkAndParseObjectId,
        userApiController.getApiResentMail)
    // .get("/sent/:id",
    //     userApiController.checkAndParseObjectId,
    //     userApiController.getApiSentMail)
    .put(/^\/([0-9a-fA-F]{24})\/lock$/,
        userApiController.checkAndParseObjectId,
        userApiController.putApiLockAccount)
    .put(/^\/([0-9a-fA-F]{24})\/unlock$/,
        userApiController.checkAndParseObjectId,
        userApiController.putApiUnLockAccount);


module.exports = router;