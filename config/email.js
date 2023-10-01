const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
    service: 'your-email-service',
    auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password',
    },
});

module.exports = transporter;
