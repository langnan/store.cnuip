import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 登录
 * TODO: 参数传递方式需要修改
 * @param user
 * @returns {Object}
 */
export const login = user =>
  request('/api/user/v1/user/login', {
    method: 'POST',
    body: user,
  });
// 登出
export const logout = () => request('/api/user/v1/user/logout', { method: 'POST' });

// 当前用户
export const currentUser = () => request('/api/user/v1/user/current');

/**
 * 查找用户
 */
export async function query(params) {
  return request(`/api/user/v1/user/?${stringify(params)}`);
}

/**
 * 发送短信
 */
export async function queryVerifyCode(params) {
  return request(`/api/user/v1/verifycode/?${stringify(params)}`);
}

/**
 * 校验验证码
 */
export async function checkVerifyCode(params) {
  return request(`/api/user/v1/verifycode/check?${stringify(params)}`);
}

/**
 * 获取天弓token
 */
export async function getTiikongToken() {
  return request('/api/colligate/usertoken');
}
