const log4js = require('log4js');

const config = require('../config/config');

// base log config
const logConfig = {
    appenders: {
        console: {type: 'stdout'},
    },
    categories: {
        default: {
            appenders: ['console', 'file'],
            level: 'debug'
        }
    }
};
// add additional or overwrite existing streams
for (let [name, logger] of Object.entries(config.logging.streams)) {
    logConfig.appenders[name] = logger;
}
// add additional or overwrite existing loggers
for (let [name, logger] of Object.entries(config.logging.loggers)) {
    logConfig.categories[name] = {
        appenders: logger.streams,
        level: logger.level
    }
}

log4js.configure(logConfig);
module.exports = {
    get: (name) => log4js.getLogger(name)
};