import { routerRedux } from 'dva/router';
import { query as queryUsers, currentUser, getTiikongToken } from '../services/user';

export default {
  namespace: 'user',

  state: {
    users: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const params = payload || {};
      if (!params.pageNum) {
        params.pageNum = 1;
      }
      params.pageSize = 10;
      const response = yield call(queryUsers, params);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          users: {
            list: result.list,
            pagination: {
              total: result.total,
              pageSize: result.pageSize,
              current: result.pageNum,
            },
          },
        },
      });
      if (callback) callback(response);
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(currentUser);
      if (response.code === 0 && response.result) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.result,
        });
        if (callback) callback(response.result);
      } else {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          })
        );
      }
    },
    *getTiikongToken({ callback, payload }, { call, put }) {
      const response = yield call(getTiikongToken);
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
