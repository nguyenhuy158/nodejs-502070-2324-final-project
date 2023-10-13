const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authentication");

router
    // .get("/register", authController.getRegister)
    // .post("/register", authController.createUser)
    .get("/login", authController.get)
    .post("/login", authController.checkUser)
    .get("/logout", authController.logout)
    .use(verifyToken)
    .get("/change-password", authController.changePassword)
    .post("/change-password", authController.postChangePassword)
    // .use(authController.checkAuth);

module.exports = router;