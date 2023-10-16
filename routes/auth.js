const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

router
    .get("/login", authController.get)
    .get("/email-confirm", authController.emailConfirm)
    .post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true,
        failureMessage: "Invalid username or password.",
        successMessage: "Logged in successfully.",
    }))
    .get("/logout", authController.logout)


module.exports = router;