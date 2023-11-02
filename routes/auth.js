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
    .post("/password-reset", authController.passwordReset)
    .post("/login",
          body("username")
              .trim()
              .notEmpty()
              .withMessage("Username cannot be empty!"),
          body("password")
              .trim()
              .notEmpty()
              .withMessage("Password cannot be empty!")
              .isLength({ min: 2 })
              .withMessage("Password must have at least 6 characters!"),
          (req, res, next) => {
              const result = validationResult(req);
              console.log(`=>(auth.js:33) result`, result);
              if (result.errors.length === 0) {
                  next();
              } else {
                  req.flash("success", result.errors[0].msg);
                  res.redirect("/login");
              }
          },
          passport.authenticate("local", passportAuthenticateConfig))
    .get("/logout", authController.logout);


module.exports = router;