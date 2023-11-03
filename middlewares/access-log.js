const { currentTime } = require("./format");


exports.logRequestDetails = (req, res, next) => {

    console.log(`[USERNAME] ${res.app.locals.user?.username}`);
    next();
};