const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authentication");
const passport = require("passport");
const User = require("../models/userModel");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

// app.use(cookieParser());
// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.use("local", new LocalStrategy({
//         usernameField: "username",
//         passwordField: "password",
//         // passReqToCallback: true,
//         // session: false
//     },
//     async function (username, password, done) {
//         try {
//             const user = await User.findOne({ username: username }).select("+password");
//
//             if (!user) {
//                 return done(null, false);
//             }
//             if (!(await bcrypt.compare(password, user.password))) {
//                 return done(null, false);
//             }
//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

router
    // .get("/register", authController.getRegister)
    // .post("/register", authController.createUser)
    .get("/login", authController.get)
    // .post("/login", authController.checkUser)
    .post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function (req, res) {
        res.redirect("/");
    })
    // .post("/login", passport.authenticate("local", {
    //     successRedirect: "/",
    //     failureRedirect: "/login"
    // }))
    .get("/logout", authController.logout)
    .use(verifyToken)
    .get("/change-password", authController.changePassword)
    .post("/change-password", authController.postChangePassword);
// .use(authController.checkAuth);

module.exports = router;