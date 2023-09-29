const bootstrap = require('bootstrap');
console.log("🚀 ~ file: app.js:2 ~ bootstrap:", bootstrap);

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/database-name';


// Sử dụng Pug làm template engine
app.set('view engine', 'pug');

// Sử dụng các tệp tĩnh từ thư mục public
app.use(express.static('public'));

// Định nghĩa tuyến đường chính
app.get('/', (req, res) => {
    res.render('index', { title: 'My Node App' });
});

// Khởi động máy chủ
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

