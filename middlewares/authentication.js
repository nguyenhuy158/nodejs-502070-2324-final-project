const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.updateCurrentUser = async (req, res, next) => {
    if (req.user) {
        req.app.locals.user = req.user;
    }
    next();
};