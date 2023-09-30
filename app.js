require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/routes');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const router = require('./routes/routes');
const mongoose = require('mongoose');
const connectDb = require('./server/config/db');
const User = require('./models/userModel');
const errorHandler = require('./error/handler');
const logger = require('./log/handler');
const { insertUser } = require('./controllers/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.moment = require('moment');

connectDb();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.use('', router);

app.use('/user', userRouter);

app.use('/products', productRouter);

app.use(errorHandler.logErrors);
app.use(errorHandler.errorNotFound);
app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

app.listen(process.env.PORT || 3000, logger.listen);
