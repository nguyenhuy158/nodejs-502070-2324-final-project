const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const { validateResetPassword, validateLogin } = require('../middlewares/validation');

router
    .post("/email-confirm",
        authController.emailConfirm)
    .get("/email-confirm",
        authController.getEmailConfirm)

    .get("/login",
        authController.getLogin)
    .post("/login",
        validateLogin,
        authController.customAuthenticateCallback)

    .get("/reset-password",
        authController.getResetPassword)
    .post("/reset-password",
        validateResetPassword,
        authController.postResetPassword)

    .get("/logout", authController.logout);

module.exports = router;