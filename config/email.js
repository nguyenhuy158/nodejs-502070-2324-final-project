const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.username,
        pass: config.email.password,
    },
});

module.exports = {
    transporter
};
