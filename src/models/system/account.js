import { routerRedux } from 'dva/router';
import { getCurrentAccount, saveAccount } from '../../services/system.js';

export default {
  namespace: 'account',

  state: {
    detail: {},
  },

  effects: {
    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(getCurrentAccount);
      console.log(response);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          detail: result,
        },
      });
      if (callback) callback(response);
    },
    *saveAccount({ payload, callback }, { call, put }) {
      const response = yield call(saveAccount, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
