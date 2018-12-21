import { resetPwd } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { checkVerifyCode, queryVerifyCode } from '../services/user';
import { notification } from 'antd';

export default {
  namespace: 'forgetPwd',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(resetPwd, payload);
      if (response.code === 0) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '重置密码失败: ',
          description: response.message,
        });
      }
    },
    *queryVerifyCode({ payload, callback }, { call, put }) {
      const response = yield call(queryVerifyCode, payload);
      if (response.code !== 0) {
        notification.error({
          message: '短信发送失败',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
    *checkVerifyCode({ payload, callback }, { call, put }) {
      const response = yield call(checkVerifyCode, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('ROLE_NORMAL');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
