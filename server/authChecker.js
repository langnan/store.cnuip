/**
 * authChecker
 * created by 熊玮 at 2018/8/24
 */

/**
 * 权限检查
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
  // if (req.app.get('env') === 'development') {
  //   return next();
  // }
  const ignoredUrls = [
    '/api/console/v1/org/all',
    '/api/user/v1/verifycode/',
    '/api/user/v1/verifycode/check',
    '/api/console/v1/org/province/organization',
    '/api/user/v1/user/login',
    '/api/user/v1/user/logout',
    // '/api/user/v1/user/register',
    '/api/user/v1/user/forgetpwd',
  ];
  const { baseUrl } = req;
  const shouldIgnore = ignoredUrls.some(url => baseUrl.indexOf(url) === -1);
  if (shouldIgnore) {
    return next();
  }
  // TODO: 细化权限验证
  if (!req.session || !req.session.user) {
    res.status(401);
    res.json({
      code: 401,
      message: 'Unauthorized!',
    });
  } else {
    next();
  }
};
