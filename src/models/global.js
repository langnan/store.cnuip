import { queryNotices } from '../services/api';
import { getAllRoleList } from '../services/system';
import { setRoles } from '../utils/authority';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    roles: [],
  },

  effects: {
    *fetchAllRoles({ callback, payload }, { call, put }) {
      const response = yield call(getAllRoleList, payload);
      if (response.code === 0) {
        const roles = response.result.list.map(r => r.name);
        yield put({
          type: 'save',
          payload: {
            roles,
          },
        });
        setRoles(roles);
      }
      if (callback) callback(response);
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
