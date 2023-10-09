const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { transporter } = require('../config/email');
const flash = require('../utils/flash')

exports.createUser = function (req, res, next) {

    const newData = req.body;
    // dataModel.addData(newData);
    // res.status(201).json(newData);
};

exports.register = function (req, res, next) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user == null) { //Kiểm tra xem email đã được sử dụng chưa
            bcrypt.hash(req.body.password, 10, function (err, hash) { //Mã hóa mật khẩu trước khi lưu vào db
                if (err) { return next(err); }
                const user = new User(req.body);
                user.role = ['salespeople']; //sau khi register thì role auto là customer
                user.password = hash;
                user.password_confirm = hash;
                user.save((err, result) => {
                    if (err) { return res.json({ err }); }
                    res.json({ user: result });
                });
            });
        } else {
            res.json({ err: 'Email has been used' });
        }
    });
};

exports.createAccount = async (req, res, next) => {
    const { fullName, email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            flash.addFlashMessage(req, 'error', 'Email already exists', 'Please use a different email address.');
            return res.redirect('/user/create-account');
        }

        const token = generateToken();
        const tokenExpiration = new Date(Date.now() + 1 * 60 * 1000);

        const salesperson = new User({
            fullName,
            email,
            token,
            tokenExpiration
        });

        await salesperson.save();
        await sendEmail(email, token);

        flash.addFlashMessage(req, 'success', 'Account created successfully: ', 'Please check your email for further instructions.');
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

function generateToken() {
    const length = 64;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

async function sendEmail(email, token) {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Sales System Account Creation',
        text: `Dear Salesperson,
                An account has been created for you in the Sales System. To log in, please click the following link within 1 minute: http://localhost:${process.env.PORT}/login?token=${token}
                Best regards,
                Administrator`,
    };

    await transporter.sendMail(mailOptions);
}

exports.login = async (req, res, next) => {
    const { token } = req.query;

    try {
        const salesperson = await User.findOne({ token });

        if (!salesperson || salesperson.tokenExpiration < Date.now()) {
            flash.addFlashMessage(req, 'warning', '', 'Please login by clicking on the link in your email.');
            return res.redirect('/login');
        }

        res.render('pages/auth/form', { token });
    } catch (error) {
        flash.addFlashMessage(req, 'warning', '', 'An error occurred while logging in.');
        next(error);
    }
};

exports.loginSubmit = async (req, res, next) => {
    const { token, password } = req.body;

    try {
        const salesperson = await User.findOne({ token });

        if (!salesperson || salesperson.tokenExpiration < Date.now()) {
            flash.addFlashMessage(req, 'warning', '', 'Please login by clicking on the link in your email.');
            return res.redirect('/login');
        }

        salesperson.password = password;
        salesperson.token = undefined;
        salesperson.tokenExpiration = undefined;
        await salesperson.save();

        flash.addFlashMessage(req, 'sucess', 'Password updated.', 'You can now log in using your credentials.');
        res.redirect('/login');
    } catch (error) {
        flash.addFlashMessage(req, 'warning', '', 'An error occurred while logging in.');
        next(error);
    }
};;