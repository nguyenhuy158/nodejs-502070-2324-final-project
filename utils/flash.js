
function addFlashMessage(req, type, text) {
    if (!req.session.flash_messages) {
        req.session.flash_messages = [];
    }

    req.session.flash_messages.push({ type, text });
}

module.exports = {
    addFlashMessage,
};
