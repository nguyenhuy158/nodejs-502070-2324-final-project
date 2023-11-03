const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { upload } = require("../config/upload");

router
    .get("/", userController.getApiUsers);

module.exports = router;