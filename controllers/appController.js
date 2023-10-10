const winstonLogger = require('../config/logger');


exports.flashMiddleWare = (req, res, next) => {
    console.log('[app] flash clean');

    res.locals.user = req.session.user;

    res.locals.flash = req.session.flash;
    delete req.session.flash;

    next();
};

exports.winstonLog = (req, res, next) => {
    winstonLogger.info(`${req.method} ${req.url}`);
    next();
};