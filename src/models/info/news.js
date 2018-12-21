import { queryNews, getNewsDetail } from '../../services/info';

export default {
  namespace: 'news',

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
      const response = yield call(queryNews, payload);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          list: result.list,
          pagination: {
            total: result.total,
            pageSize: result.pageSize,
            current: result.pageNum,
          },
        },
      });
      if (callback) callback(result);
    },
    *getNewsDetail({ payload, callback }, { call, put }) {
      const response = yield call(getNewsDetail, payload);
      console.log(response);
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
