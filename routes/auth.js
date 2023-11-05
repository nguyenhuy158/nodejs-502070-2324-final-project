const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const { passportAuthenticateConfig } = require("../config/config");
const { validatePasswordReset, validateLogin } = require('../middlewares/validation');

router
    .get("/login",
        authController.get)
    .get("/email-confirm",
        authController.emailConfirm)
    .get("/password-reset",
        authController.getPasswordReset)
    .post("/password-reset",
        validatePasswordReset,
        authController.postPasswordReset)
    .post("/login",
        validateLogin,
        passport.authenticate("local", passportAuthenticateConfig))
    .get("/logout", authController.logout);

module.exports = router;