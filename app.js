require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const userRouter = require('./routes/user');
const cors = require("cors");
const cookieSession = require("cookie-session");
const productRouter = require('./routes/product');
const router = require('./routes/routes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDb = require('./server/config/db');
const User = require('./models/userModel');
const errorHandler = require('./error/handler');
const logger = require('./log/handler');
const { insertUser } = require('./controllers/index');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const winstonLogger = require('./config/logger');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

process.on('uncaughtException', (error) => {
    winstonLogger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    winstonLogger.error('Unhandled Rejection:', reason);
});


const app = express();
const accessLogStream = require('fs').createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('tiny', { stream: accessLogStream }));
app.use((req, res, next) => {
    winstonLogger.info(`${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: process.env.COOKIE_NAME,
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true,
    })
);

app.locals.moment = require('moment');

connectDb();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(sassMiddleware({
    src: path.join('source', 'sass'),
    dest: path.join('public', 'css'),
    debug: true,
    outputStyle: 'compressed',
    force: true,
    root: __dirname,
    indentedSyntax: false,
    prefix: '/css'
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({ secret: process.env.SESSION_SECRECT_KEY, resave: false, saveUninitialized: true }));

app.use((req, res, next) => {
    res.locals.user = req.session.user;

    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.get('/log', logger.morganLog);

app.use('', authRoutes);

app.use('', router);

app.use('/users', userRouter);

app.use('/products', productRouter);

app.use(errorHandler.logErrors);
app.use(errorHandler.errorNotFound);
app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

app.listen(process.env.PORT || 8080, logger.listen);