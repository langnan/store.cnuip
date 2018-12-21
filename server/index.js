/**
 * index.js
 * created by 熊玮 at 2018/8/24
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = require('./config');
const logger = require('./logger');
const file = require('./file');

// log
logger.configure(config.log4js);

const app = express();

app.use(logger.connectLogger(logger.getLogger('file'), { level: logger.levels.DEBUG }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// session
app.use(
  session({
    name: 'store2.sid',
    secret: 'store2.sid.secret',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore(config.redis),
  })
);

// cors
app.use(cors());
// upload
app.use('/file/upload', file.upload);
// api
app.use('/api/:service/*', require('./authChecker'), require('./api'));
// index
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  logger.getLogger('error').error(err);

  // error
  const status = err.status || 500;
  res.status(status);
  res.json({
    code: status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : {},
  });
});

module.exports = app;
