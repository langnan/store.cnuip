/**
 * config
 * created by 熊玮 at 2018/8/24
 */

const path = require('path');

module.exports = {
  // log4js
  log4js: {
    pm2: true,
    appenders: {
      out: {
        type: 'stdout',
      },
      file: {
        type: 'file',
        filename: path.join(__dirname, '../logs', 'store2.log'),
        maxLogSize: 10240000,
        numBackups: 10,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ['out', 'file'],
        level: 'trace',
      },
    },
  },

  // redis配置
  redis: {
    // host: '116.62.238.209',
    host: 'localhost',
    port: 6379,
    // password: 'cnuip@2018',
    no_ready_check: true,
    db: 1,
    prefix: 'store2-portal-session-',
  },

  // upyun
  upyun: {
    serverPrefix: 'https://image.cnuip.com',
    bucketName: 'bucket-cnuip',
    operator: 'cnuipadmin',
    password: 'CA2203!A',
    maxFieldsSize: 100 * 1024 * 1024, // 上传大小限制100M
  },

  // service配置
  service: {
    store: {
      host: 'http://58.213.198.77:10010',
      services: ['console', 'user', 'process', 'colligate', 'result', 'authorize', 'patent'].reduce(
        (s, e) => {
          s[e] = `store2-service-${e}`;
          return s;
        },
        {}
      ),
    },
    cnuip: {
      host: 'http://58.213.198.77:28',
      services: ['console', 'user', 'goods', 'article', 'order', 'shop', 'fen'].reduce((s, e) => {
        s[e] = `cnuip2-mservice-${e}`;
        return s;
      }, {}),
    },
  },
};
