require("dotenv").config();
const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const connectDb = require("./server/config/db");
const logger = require("./log/handler");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");
const config = require("./config/config");
const winstonLogger = require("./config/logger");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/userModel");
const moment = require("moment/moment");
const flash = require("./middlewares/flash");
const bcrypt = require("bcryptjs");
const { cookieOptions } = require("./config/config");
const LocalStrategy = require("passport-local").Strategy;


// process.on("uncaughtException", (error) => {
//     winstonLogger.error("Uncaught Exception:", error);
//     process.exit(1);
// });
//
// process.on("unhandledRejection", (reason, promise) => {
//     winstonLogger.error("Unhandled Rejection:", reason);
// });


const app = express();
app.locals.moment = require("moment");
app.locals.title = process.env.APP_NAME;

app.use(require("cors")());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(config.cookieSessionConfig);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: "secrettt",
    resave: false,
    saveUninitialized: true,
}));

connectDb();

// const authUser = async (username, password, done) => {
//     console.log("=>(app.js:50) username", username);
//     console.log("=>(app.js:51) password", password);
//     const user = await User.findOne({ username }).select("+password");
//     if (user) {
//         if (!user.lockedStatus) {
//             if (user.token) {
//                 // if (moment(user.tokenExpiration).isBefore(moment())) {
//                 //     flash.addFlash(req, "warning", `You can ask the administrator's support to resend another email with another link.`);
//                 //     return res.redirect("/login");
//                 // } else {
//                 //     flash.addFlash(req, "warning", "Please login by clicking on the link in your email.");
//                 //     return res.redirect("/login");
//                 // }
//                 done(null, false);
//             } else if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user);
//             }
//         } else {
//             // return res.render("pages/auth/form", {
//             //     username,
//             //     password,
//             //     error: `You can contact the administrator's support unlock account link.`
//             // });
//             done(null, false);
//         }
//     }
// };
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(authUser));
// passport.serializeUser((user, done) => {
//     console.log(`--------> Serialize User`);
//     console.log(user);
//
//     done(null, user.id);
//
//     // Passport will pass the authenticated_user to serializeUser as "user"
//     // This is the USER object from the done() in auth function
//     // Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id},
//     // so that it is tied to the session object
//
// });
//
// passport.deserializeUser((id, done) => {
//     console.log("---------> Deserialize Id")
//     console.log(id)
//
//     done (null, {name: "Kyle", id: 123} )
//
// // This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
// // use the id to find the user in the DB and get the user object with user details
// // pass the USER object in the done() of the de-serializer
// // this USER object is attached to the "req.user", and can be used anywhere in the App.
//
// })


app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(sassMiddleware(config.sassOptions));
app.use("/public", express.static(path.join(__dirname, "public"), config.staticOptions));
app.use(express.static(path.join(__dirname, "public"), config.staticOptions));

app.use(router);

app.listen(process.env.PORT || 8080, logger.listen);