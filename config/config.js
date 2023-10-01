
module.exports = {
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DB_URL || 'mongodb://localhost/techhut',
        username: process.env.DB_USERNAME || 'user',
        password: process.env.DB_PASSWORD || 'password',
    },
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};
