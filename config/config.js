
const cookieSession = require("cookie-session");


module.exports = {
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DB_URL || 'mongodb://localhost/techhut',
        username: process.env.DB_USERNAME || 'user',
        password: process.env.DB_PASSWORD || 'password',
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: process.env.EMAIL_SERVICE,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    },
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    cookieSessinonConfig: cookieSession({
        name: process.env.COOKIE_NAME,
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true,
    })
};
