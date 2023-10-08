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


const app = express();
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

app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.flash_messages = req.session.flash_messages || [];
    req.session.flash_messages = [];
    next();
});


app.use('', authRoutes);

app.use('', router);

app.use('/user', userRouter);

app.use('/products', productRouter);

app.use(errorHandler.logErrors);
app.use(errorHandler.errorNotFound);
app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

app.listen(process.env.PORT || 8080, logger.listen);
