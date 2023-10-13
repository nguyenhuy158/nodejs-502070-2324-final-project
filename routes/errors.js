const express = require("express");
const errorController = require("../controllers/errorController");
const router = express.Router();

router
    .use(errorController.logErrors)
    .use(errorController.clientErrorHandler)
    .use(errorController.errorNotFound)
    .use(errorController.serverErrorHandler);

module.exports = router;