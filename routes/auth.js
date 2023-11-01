const express                        = require("express");
const router                         = express.Router();
const authController                 = require("../controllers/authController");
const passport                       = require("passport");
const { passportAuthenticateConfig } = require("../config/config");
const {
          query,
          body,
          param,
          validationResult
      }                              = require("express-validator");

router
    .get("/login", authController.get)
    .get("/email-confirm", authController.emailConfirm)
    .get("/password-reset", authController.passwordResetGet)
    .post("/password-reset",          authController.passwordReset)
    .post("/login", passport.authenticate("local", passportAuthenticateConfig))
    .get("/logout", authController.logout);


module.exports = router;