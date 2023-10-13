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
app.use(config.cookieSessionConfig);


app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(sassMiddleware(config.sassOptions));
app.use("/public", express.static(path.join(__dirname, "public"), config.staticOptions));
app.use(express.static(path.join(__dirname, "public"), config.staticOptions));

app.use(router);

app.listen(process.env.PORT || 8080, logger.listen);