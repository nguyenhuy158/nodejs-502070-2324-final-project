exports.logErrors = function (err, req, res, next) {
    console.error(err.stack);
    next(err);
};

exports.clientErrorHandler = function (err, req, res, next) {
    if (req.xhr) {
        // This is an AJAX request
        res.status(404).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
};

exports.errorHandler = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('pages/500', { error: err });
};

exports.errorNotFound = function (req, res, next) {
    res.status(404).render('pages/404');
};