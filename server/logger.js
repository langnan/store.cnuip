/**
 * logger.js
 * created by 熊玮 at 2018/8/24
 */

const log4js = require('log4js');

module.exports = {

  levels: log4js.levels,

  configure: (config) => log4js.configure(config),

  getLogger: (category) => log4js.getLogger(category),

  connectLogger: (logger, options) => log4js.connectLogger(logger, options),

};
