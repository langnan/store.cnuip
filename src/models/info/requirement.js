import {
  queryRequirement,
  getClassifies,
  getFirmTypes,
  getRequirementDetail,
  replyRequirement,
} from '../../services/info';

export default {
  namespace: 'requirement',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    queryOptions: {},
    classifies: [],
    firmTypes: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put, select }) {
      const queryOptions = yield select(state => state.requirement.queryOptions);
      const params = { ...payload, ...queryOptions, pageSize: 20 };
      const response = yield call(queryRequirement, params);
      if (response.code === 0 && response.result) {
        const { result } = response;
        yield put({
          type: 'save',
          payload: {
            data: {
              list: result.list,
              pagination: {
                total: result.total,
                pageSize: result.pageSize,
                current: result.pageNum,
              },
            },
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            data: {
              list: [],
              pagination: {
                total: 0,
                pageSize: params.pageSize,
                current: params.pageNum,
              },
            },
          },
        });
      }
      if (callback) callback(response);
    },
    *fetchClassifies({ payload, callback }, { call, put }) {
      const response = yield call(getClassifies, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            classifies: response.result || [],
          },
        });
      }
      if (callback) callback(response);
    },
    *fetchFirmTypes({ payload, callback }, { call, put }) {
      const response = yield call(getFirmTypes, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            firmTypes: response.result || [],
          },
        });
      }
      if (callback) callback(response);
    },
    *getRequirementDetail({ payload, callback }, { call, put }) {
      const response = yield call(getRequirementDetail, payload);
      if (callback) callback(response);
    },
    *replyRequirement({ payload, callback }, { call, put }) {
      const response = yield call(replyRequirement, payload);
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
