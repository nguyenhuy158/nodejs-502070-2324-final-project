const { currentTime } = require("./format");


exports.logRequestDetails = (req, res, next) => {
    const { method, originalUrl, xhr } = req;
    const accessTime = currentTime();
    console.log(`[ACCESS-LOG]\t${method}\t[${accessTime}]\t${originalUrl}`);
    console.log(`[ACCESS-LOG]\t${method}\t[${accessTime}]\txhr: ${xhr}`);
    console.log(`[USER] ${res.app.locals.user?.username}`)
    next();
};