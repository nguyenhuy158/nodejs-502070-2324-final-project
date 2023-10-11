const { currentTime } = require("../utils/format");


exports.logRequestDetails = (req, res, next) => {
    const { method, url } = req;
    const accessTime = currentTime();
    console.log(`[ACCESS-LOG] ${method} ${url} [${accessTime}]`);
    next();
};