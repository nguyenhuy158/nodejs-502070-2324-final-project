
const logger = require("../config/logger");

exports.clientErrorHandler = function (err, req, res, next) {
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    if (req.xhr) {
        res.status(404).send({ error: "Something failed!", message: err.message });
    } else {
        next(err);
    }
};

exports.errorNotFound = function (req, res, next) {
    logger.error(`${err.status || 400} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(404).render("pages/error/404");
};

exports.logErrors = function (err, req, res, next) {
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    next(err);
};

exports.serverErrorHandler = function (err, req, res, next) {
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(500).render("pages/error/500", { error: "Something failed!", message: err.message });
};

