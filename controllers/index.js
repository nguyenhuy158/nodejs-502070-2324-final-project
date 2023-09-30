const User = require('../models/userModel');

exports.insertUser = function () {
    const a = true;
    log;
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
};