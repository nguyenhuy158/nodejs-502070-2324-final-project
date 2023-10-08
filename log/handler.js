const PORT = process.env.PORT;
const winstonLogger = require('../config/logger')

exports.listen = () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
};

exports.morganLog = (req, res) => {
    winstonLogger.info('hihi');

    let log;
    try {
        log = require('fs').readFileSync('access.log', 'utf8');
    } catch (error) {
        log = null;
    } finally {
        res.render('pages/log', { log });
    }
};