exports.requireRole = function (role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).redirect("/permission-denied");
        }
    };
};

exports.updateCurrentUser = async (req, res, next) => {
    if (req.user) {
        req.app.locals.user = req.user;
    }
    next();
};
