const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
