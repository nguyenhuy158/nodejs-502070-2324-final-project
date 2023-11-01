require("dotenv")
    .config();
const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const connectDb = require("./middlewares/server/config/db");
const logger = require("./middlewares/handler");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");
const config = require("./config/config");
const winstonLogger = require("./config/logger");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user");
const moment = require("moment/moment");
// const flash = require("./middlewares/flash");
const bcrypt = require("bcryptjs");
const {
          cookieOptions,
          cloudinaryConfig
      }    = require("./config/config");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const { v2: cloudinary } = require("cloudinary");
const { uploadImage }    = require("./middlewares/utils");

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
                                       secret           : "keyboard cat",
                                       resave           : false,
                                       saveUninitialized: false
                                   }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    console.log("|||||||||===============================new request===============================|||||||||");
    res.locals.message = req.flash();
    console.log("=>(app.js:51) req.flash()", req.flash());
    console.log("=>(app.js:52) res.locals.message", res.locals.message);
    next();
});

app.use(connectDb);
cloudinary.config(cloudinaryConfig);
// console.log("=>(app.js:65) cloudinary.config()", cloudinary.config());
// uploadImage("C:\\Users\\ADMIN\\Desktop\\nodejs-502070-2324-final-project\\public\\favicon.ico");

passport.use(new LocalStrategy(async function (username, password, done) {
    try {
        const user = await User.findOne({ username: username });
        
        if (!user) {
            return done(null, false, { message: "Incorrect username." });
        }
        
        if (user.token) {
            return done(null, false, {
                message: "Please login by clicking on the link in your email"
            });
        }
        
        const isPasswordValid = await user.validPassword(password);
        
        if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user, { message: "Login successfully." });
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(sassMiddleware(config.sassOptions));
app.use("/public", express.static(path.join(__dirname, "public"), config.staticOptions));
app.use(express.static(path.join(__dirname, "public"), config.staticOptions));

app.use(router);

app.listen(process.env.PORT || 8080, logger.listen);