import { queryConsultation, queryShop, replyConsultation, replyShop } from '../../services/info';

export default {
  namespace: 'consultation',

  state: {
    data: {
      list: [],
      shopList: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    queryOptions: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put, select }) {
      // const queryOptions = yield select(state => state.consultation.queryOptions);
      // const params = { ...payload, ...queryOptions, pageSize: 20 };
      const response = yield call(queryConsultation, payload);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          data: {
            shopList: [],
            list: result.result.list,
            pagination: {
              total: result.result.total,
              pageSize: result.result.pageSize,
              current: result.result.pageNum,
            },
          },
        },
      });
      if (callback) callback(result);
    },

    *fetchShop({ payload, callback }, { call, put, select }) {
      // const queryOptions = yield select(state => state.consultation.queryOptions);
      // const params = { ...payload, ...queryOptions, pageSize: 20 };
      const params = {
        pageSize: payload.pageSize,
        pageNum: payload.pageNum,
      };
      if (params.pageNum === 0) {
        params.pageNum = 1;
      }
      const response = yield call(queryShop, params);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          data: {
            list: [],
            shopList: result.result.list,
            pagination: {
              total: result.result.total,
              pageSize: result.result.pageSize,
              current: result.result.pageNum,
            },
          },
        },
      });
      if (callback) callback(result);
    },

    *replyConsultation({ payload, callback }, { call, put }) {
      const response = yield call(replyConsultation, payload);
      if (callback) callback(response);
    },
    *replyShop({ payload, callback }, { call, put }) {
      const response = yield call(replyShop, payload);
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

    setQueryOptions(state, { payload }) {
      return {
        ...state,
        queryOptions: {
          ...state.queryOptions,
          ...payload,
        },
      };
    },
  },
};
