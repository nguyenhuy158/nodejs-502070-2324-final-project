const moment = require("moment");
const logger = require("../config/logger");

exports.formatTimestamp = function (timestamp) {
    try {        
        return moment(timestamp).format("HH:mm:ss DD/MM/YYYY");
    } catch (e) {
        logger.error(e);
        return moment().format("HH:mm:ss DD/MM/YYYY");
    }
};

