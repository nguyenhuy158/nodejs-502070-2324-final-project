
module.exports = {
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DB_URL || 'mongodb://localhost/techhut',
        username: process.env.DB_USERNAME || 'user',
        password: process.env.DB_PASSWORD || 'password',
    },
    email: {
        service: process.env.EMAIL_SERVICE,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};
