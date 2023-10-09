
function addFlashMessage(req, type, info = '', message = '') {
    req.session.flash = {
        type: type,
        info: info,
        message: message
    };
}

module.exports = {
    addFlashMessage,
};
