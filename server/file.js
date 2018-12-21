/**
 * upload
 * created by 熊玮 at 2018/9/12
 */

const Q = require('q');
const fs = require('fs');
const moment = require('moment');
const formidable = require('formidable');
const upyun = require('upyun');
const logger = require('./logger').getLogger('upyun');
const { upyun: upyunConfig } = require('./config');

const service = new upyun.Service(
  upyunConfig.bucketName,
  upyunConfig.operator,
  upyunConfig.password
);
const client = new upyun.Client(service);

/**
 * 处理文件上传
 * @param req
 * @param res
 * @param next
 */
exports.upload = (req, res, next) => {
  const { method } = req;
  if (method !== 'POST') {
    return res.json({
      code: 404,
      message: 'Request method not support!',
    });
  }

  const form = new formidable.IncomingForm();
  form.encoding = 'utf-8'; // 设置编辑
  form.keepExtensions = true; // 保留后缀
  form.maxFieldsSize = upyunConfig.maxFieldsSize; // 文件大小

  const { CKEditorFuncNum, dir } = req.query; // TODO：CKEditorFuncNum 参数用来兼容ckeditor的上传

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({
        code: -1,
        message: 'Upload Failed!',
        error: err.message,
      });
      return;
    }
    logger.debug('upload.files', files);
    logger.debug('upload.fields', fields);

    let parentDir = dir || `/store2/${moment().format('YYYY-MM-DD')}/${Date.now()}`;
    if (parentDir.endsWith('/')) {
      parentDir = parentDir.substring(0, parentDir.length - 1);
    }
    Q.allSettled(
      Object.values(files).map(file => {
        const path = `${parentDir}/${file.name}`;
        return client.putFile(path, fs.createReadStream(file.path));
      })
    )
      .then(results => {
        const fileList = Object.values(files).map((file, index) => {
          const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            status: 0,
          };
          const url = `${upyunConfig.serverPrefix}${parentDir}/${file.name}`;
          const uploadResult = results[index];
          if (uploadResult.state === 'fulfilled') {
            fileInfo.url = url;
          } else {
            fileInfo.status = -1;
          }
          return fileInfo;
        });
        res.json(fileList);
      })
      .catch(e => {
        res.status(503);
        res.json({
          code: -1,
          message: e.message,
        });
      });
  });
};
