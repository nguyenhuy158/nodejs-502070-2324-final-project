const express = require('express');
const app = express();
// const bootstrap = require('bootstrap');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database-name';
const app_name = process.env.APP_NAME 


// Sử dụng Pug làm template engine
app.set('view engine', 'pug');

// Sử dụng các tệp tĩnh từ thư mục public
app.use(express.static('public'));

// Định nghĩa tuyến đường chính
app.get('/', (req, res) => {
    res.render('index', { app_name });
});

// Khởi động máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

