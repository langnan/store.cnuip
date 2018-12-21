import { querySystemMessage, subscribeClient, deleteSystemMessage } from '../../services/IM';

export default {
  namespace: 'message',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(querySystemMessage, payload);
      const { result } = response;
      console.log(result);
      yield put({
        type: 'save',
        payload: {
          list: result || [],
          pagination: {
            total: result.total || 0,
            pageSize: result.pageSize || 0,
            current: result.pageNum || 0,
          },
        },
      });
      if (callback) callback(result);
    },
    *subscribe({ payload, callback }, { call, put }) {
      const response = yield call(subscribeClient, payload);
      console.log(`subscribed: ${response}`);
      if (callback) callback(response);
    },
    *deleteMessages({ payload, callback }, { call, put }) {
      const response = yield call(deleteSystemMessage, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
