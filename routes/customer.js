const express            = require("express");
const router             = express.Router();
const customerController = require("../controllers/customerController");


router
    .get("", customerController.get);

module.exports = router;