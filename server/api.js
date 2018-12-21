/**
 * api
 * created by 熊玮 at 2018/8/24
 */

const createError = require('http-errors');
let request = require('request');
const serviceConfig = require('./config').service;
const logger = require('./logger').getLogger('service');

request = request.defaults({ json: true });

module.exports = (req, res, next) => {
  let { service } = req.params;
  let subPath = req.params[0];
  let module;
  if (Object.keys(serviceConfig).indexOf(service) >= 0) {
    const index = subPath.indexOf('/');
    module = subPath.substring(0, index);
    subPath = subPath.substring(index + 1);
  } else {
    module = service;
    service = 'store';
  }
  logger.info('service:', service, 'module:', module, 'apiPath:', subPath);
  const serviceInfo = serviceConfig[service];
  if (!serviceInfo) {
    // 请求接口不在可提供的服务模块范围内
    return next(createError(500, 'Service Not Found!'));
  }
  const actService = serviceInfo.services[module];
  if (!actService) {
    // 请求接口不在可提供的服务模块范围内
    return next(createError(500, 'Service Not Found!'));
  }
  const qs = Object.assign({}, req.query);
  if (module === 'user') {
    if (subPath === 'v1/user/logout') {
      // 不需要调用接口
      return req.session.destroy(() => {
        res.json({
          code: 0,
          message: 'success',
        });
      });
    }
    if (subPath === 'v1/user/current') {
      /**
      // 不需要调用接口
      return res.json({
        code: 0,
        message: 'success',
        result: req.session.user,
      });
       */
      if (req.session.user) {
        // 调用v1/user/detail
        subPath = 'v1/user/detail';
        qs.id = req.session.user.id;
      } else {
        return res.json({
          code: 0,
          message: 'success',
        });
      }
    }
  }
  const apiPath = `${serviceInfo.host}/${actService}/${subPath}`;
  const proxyRequest = {
    method: req.method,
    uri: apiPath,
    qs,
    headers: {},
  };
  if (req.body) {
    proxyRequest.body = req.body;
  }
  const { user } = req.session;
  if (user) {
    proxyRequest.headers['X-Request-UserId'] = user.id;
    proxyRequest.headers['X-Request-SiteId'] = 1;
    proxyRequest.headers['X-Request-RoleType'] = '';
    proxyRequest.headers['X-Request-UserName'] = encodeURIComponent(user.username);
    if (user.organizationId) {
      proxyRequest.headers['X-Request-OrganizationId'] = user.organizationId;
    }
    if (user.organizationName) {
      proxyRequest.headers['X-Request-OrganizationName'] = encodeURIComponent(
        user.organizationName
      );
    }
  }
  proxyRequest.headers['X-Request-Ip'] = req.ip.replace(/::ffff:/, '');
  proxyRequest.headers['X-Request-Platform'] = 'web';
  proxyRequest.headers['X-Request-Version'] = '1.0';
  request(proxyRequest, (err, response, body) => {
    logger.info('invoke service:', proxyRequest, body);
    if (err) {
      next(err);
    } else if (typeof body.status !== 'undefined') {
      const status = body.error === 'Not Found' ? 404 : 500;
      const serr = createError(status);
      serr.message = body.message;
      next(serr);
    } else {
      if (service === 'store' && module === 'user' && subPath === 'v1/user/login') {
        req.session.user = body.result;
      }
      res.json(body);
    }
  });
};
