require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const router = require("./routes/routes");
const cookieParser = require("cookie-parser");
const connectDb = require("./server/config/db");
const errorHandler = require("./error/handler");
const logger = require("./log/handler");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");
const appController = require("./controllers/appController");
const config = require("./config/config");
const winstonLogger = require("./config/logger");
const { logRequestDetails } = require("./middlewares/access-log");
const { flashMiddleWare } = require("./middlewares/flash");

process.on("uncaughtException", (error) => {
    winstonLogger.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    winstonLogger.error("Unhandled Rejection:", reason);
});


const app = express();
app.use(logRequestDetails);

app.use(require("morgan")("tiny", { stream: require("fs").createWriteStream(path.join(__dirname, process.env.MORGAN_LOG), { flags: "a" }) }));
app.use(appController.winstonLog);

app.use(require("cors")());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(config.cookieSessinonConfig);

app.locals.moment = require("moment");

connectDb();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(sassMiddleware({
    src: path.join("source", "sass"),
    dest: path.join("public", "css"),
    debug: false,
    outputStyle: "compressed",
    force: true,
    root: __dirname,
    indentedSyntax: false,
    prefix: "/css"
}));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use(flashMiddleWare);

app.get("/log", logger.morganLog);

app.use("", authRoutes);

app.use("", router);

app.use("/users", userRouter);

app.use("/products", productRouter);

app.use(errorHandler.logErrors);
app.use(errorHandler.errorNotFound);
app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

app.listen(process.env.PORT || 8080, logger.listen);