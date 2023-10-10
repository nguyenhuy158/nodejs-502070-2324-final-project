
exports.addFlashMessage = function (req, type, info = '', message = '') {
    req.session.flash = {
        type: type,
        info: info,
        message: message
    };
};
