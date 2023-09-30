require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const connectDb = require('./server/config/db');
const User = require('./models/userModel');

const app = express();
app.locals.moment = require('moment');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database-name';
const app_name = process.env.APP_NAME;


connectDb();

function insertUser() {
    const a = true;
    log
    User.insertMany(
        {
            email: "123",
            username: "view123123123123",
            fullName: "123123123123",
            role: "admin",
            password: "123123123123",
            password_confirm: "123123123123",
        }
    );
}

// Sử dụng Pug làm template engine
app.set(' engine', 'pug');

// Sử dụng các tệp tĩnh từ thư mục public
app.use(express.static('public'));

// Định nghĩa tuyến đường chính
app.get('/', (req, res) => {
    // insertUser();
    res.render('index', { title: 'Home', app_name });
});

// Khởi động máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
