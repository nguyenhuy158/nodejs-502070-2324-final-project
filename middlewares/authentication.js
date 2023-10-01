const passport = require('passport');

module.exports.initialize = passport.initialize();

module.exports.session = passport.session();

module.exports.authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Authentication failed' });
        req.login(user, (err) => {
            if (err) return next(err);
            return next();
        });
    })(req, res, next);
};
