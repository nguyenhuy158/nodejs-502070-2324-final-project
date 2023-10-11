const { currentTime } = require("./format");


exports.logRequestDetails = (req, res, next) => {
    const { method, url } = req;
    const accessTime = currentTime();
    console.log(`[ACCESS-LOG]\t${method}\t${url}\t\t\t[${accessTime}]`);
    next();
};