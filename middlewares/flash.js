exports.flashMiddleWare = (req, res, next) => {
    req.session.flashMessages = req.session.flashMessages || [];
    req.flash = (type, message) => {
        req.session.flashMessages.push({ type, message });
    };
    res.locals.getFlashMessages = () => {
        console.log("[FLASH] flash clean");
        const messages = req.session.flashMessages;
        console.log("=>(flash.js:19) req.session.flashMessages", req.session.flashMessages);
        req.session.flashMessages = [];
        return messages;
    };
    next();
};
