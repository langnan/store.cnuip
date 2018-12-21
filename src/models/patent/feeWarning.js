import { queryFeeWarning } from '../../services/patent';

export default {
  namespace: 'feeWarning',

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
      const response = yield call(queryFeeWarning, payload);
      const { result } = response;
      yield put({
        type: 'save',
        payload: result,
      });
      if (callback) callback(result);
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
