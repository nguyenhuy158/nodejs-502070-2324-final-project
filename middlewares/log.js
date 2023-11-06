
exports.logRequestDetails = (req, res, next) => {
    console.log(`[USERNAME] ${res.app.locals.user?.username}`);
    next();
};

exports.morganLog = (req, res) => {
    let log;
    try {
        log = require("fs").readFileSync("access.log", "utf8");
    } catch (error) {
        log = null;
    } finally {
        res.render("pages/log", { log });
    }
};