require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const sassMiddleware = require("node-sass-middleware");

const path = require("path");

const router = require("./routes");
const config = require("./config/config");
const logger = require("./config/logger");
const moment = require("moment/moment");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

const User = require("./models/user");

const { connectDb } = require("./config/db");
const { cookieOptions, cloudinaryConfig } = require("./config/config");

const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require('connect-mongo');

const { v2: cloudinary } = require("cloudinary");
const { uploadImage } = require("./utils/utils");

// process.on("uncaughtException", (error) => {
//     winstonLogger.error("Uncaught Exception:", error);
//     process.exit(1);
// });
//
// process.on("unhandledRejection", (reason, promise) => {
//     winstonLogger.error("Unhandled Rejection:", reason);
// });

connectDb();

const app = express();
app.locals.moment = require("moment");
app.locals.title = process.env.APP_NAME;

app.use(require("cors")());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    // milliseconds * seconds * minutes * hours * days
    // 1000 * 60 * 60 * 24 * 10 = 10 days
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 10 },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    resave: true,
    saveUninitialized: true,
    name: 'techhut.sid',
    httpOnly: true,
    secure: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    const { method, originalUrl, xhr } = req;
    res.locals.message = req.flash();
    let fullUrl = process.env.NODE_ENV === 'production' ?
        `${req.protocol}://${req.get("host")}${req.originalUrl}` :
        `${req.originalUrl}`;

    logger.info(`[👻👻👻👻👻👻👻👻👻👻]`);

    logger.http(`[URL] ${fullUrl}`);
    logger.http(`[METHOD] ${method}`);
    logger.http(`[METHOD] ${originalUrl}`);
    logger.http(`[XHR] ${xhr}`);

    logger.http(`[USERNAME] ${res.app.locals.user?.username}`);
    logger.http(`[Session ID] ${req.sessionID}`);

    logger.http(`[FLASH] ${JSON.stringify(res.locals.message)}`);

    next();
});

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

app.listen(process.env.PORT || 8080, () => {
    console.log(`[LISTEN] Server is running on http://localhost:${process.env.PORT}`);
});
