const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.updateCurrentUser = async (req, res, next) => {
    console.log("=>(authentication.js:7) req.app.locals.id", req.app.locals.id);
    if (req.app.locals.id) {
        const id = req.app.locals.id;
        const currentUser = await User.findById(id);
        console.log("=>(authentication.js:10) currentUser", currentUser);
        if (currentUser) req.app.locals.user = currentUser;
        console.log("=>(authentication.js:11) !currentUser", !currentUser);
    }
    next();
};

exports.verifyToken = (req, res, next) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    
    if (!token) {
        return res.redirect("/login");
    }
    
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
        
        if (err) {
            return res.redirect("/login");
        }
        
        console.log("=>(authentication.js:34) decoded", decoded);
        console.log("=>(authentication.js:34) req.app.locals.id", req.app.locals.id);
        req.app.locals.id = decoded.id;
        console.log("=>(authentication.js:35) req.app.locals.id", req.app.locals.id);
        next();
    });
};