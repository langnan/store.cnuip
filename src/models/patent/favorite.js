import { queryFavorite, deleteFavorite } from '../../services/patent';

export default {
  namespace: 'favorite',

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
      const response = yield call(queryFavorite, payload);
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
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteFavorite, payload);
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
