const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const { validateResetPassword, validateLogin } = require('../middlewares/validation');

router
    .get("/login",
        authController.getLogin)
    .post("/login",
        validateLogin,
        authController.customAuthenticateCallback)

    .get("/email-confirm",
        authController.emailConfirm)

    .get("/reset-password",
        authController.getResetPassword)
    .post("/reset-password",
        validateResetPassword,
        authController.postResetPassword)

    .get("/logout", authController.logout);

module.exports = router;