import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getALLOrganizations } from '../services/console';
import { checkVerifyCode, queryVerifyCode } from '../services/user';
import { notification } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    organizations: [],
  },

  effects: {
    *fetchOrganizations({ _ }, { call, put }) {
      const response = yield call(getALLOrganizations);
      yield put({
        type: 'changeOrganizations',
        payload: response.result,
      });
    },
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if (response.code === 0) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      } else {
        notification.error({
          message: '注册失败: ',
          description: response.message,
        });
      }
      if (callback) callback(response);
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
    changeOrganizations(state, { payload }) {
      return {
        ...state,
        organizations: payload,
      };
    },
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
