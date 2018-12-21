import {
  queryPatent,
  getPatentDetail,
  getPatentSimilarity,
  getPatentQuoteList,
  queryValue,
  queryUseful,
  getValueDetail,
} from '../../services/patent';

const patentTypeMap = {
  SYXX: '实用新型',
  FMZL: '发明专利',
  FMSQ: '发明授权',
  WGZL: '外观设计',
};

const patentStatusMap = {
  在审: {
    color: '#ff6101',
  },
  有效: {
    color: '#3b77e3',
  },
  失效: {
    color: '#666666',
  },
  无效: {
    color: '#666666',
  },
  有效期满: {
    color: '#ff0101',
  },
  有效期届满: {
    color: '#ff0101',
  },
};

export { patentTypeMap, patentStatusMap };

export default {
  namespace: 'patentList',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    valueData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    usefulPatents: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    valueDetail: {
      evaluation: undefined,
      labels: undefined,
      patent: undefined,
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const params = { ...payload };
      params.pageSize = (payload && payload.pageSize) || 10;
      params.pageNum = (payload && payload.pageNum) || 1;
      const response = yield call(queryPatent, params);
      console.log(response);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          data: {
            list: result.list,
            pagination: {
              total: result.total,
              pageSize: params.pageSize,
              current: params.pageNum,
            },
          },
        },
      });
      if (callback) callback(response);
    },
    *getPatentDetail({ payload, callback }, { call, put }) {
      const response = yield call(getPatentDetail, payload);
      if (callback) callback(response);
    },
    *getValueDetail({ payload, callback }, { call, put }) {
      const response = yield call(getValueDetail, payload);
      yield put({
        type: 'save',
        payload: {
          valueDetail: {
            evaluation: response.result.evaluation,
            labels: response.result.labels,
            patent: response.result.patent,
          },
        },
      });
      if (callback) callback(response);
    },
    *getPatentSimilarity({ payload, callback }, { call, put }) {
      const response = yield call(getPatentSimilarity, payload);
      console.log(response);
      if (callback) callback(response);
    },
    *getPatentQuoteList({ payload, callback }, { call, put }) {
      const response = yield call(getPatentQuoteList, payload);
      console.log(response);
      if (callback) callback(response);
    },
    *fetchValue({ payload, callback }, { call, put }) {
      const params = { ...payload };
      params.pageSize = (payload && payload.pageSize) || 10;
      params.pageNum = (payload && payload.pageNum) || 1;
      const response = yield call(queryValue, params);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          valueData: {
            list: result.list,
            pagination: {
              total: result.total,
              pageSize: params.pageSize,
              current: params.pageNum,
            },
          },
        },
      });
      if (callback) callback(response);
    },
    *fetchUseful({ payload, callback }, { call, put }) {
      const params = { ...payload };
      params.pageSize = (payload && payload.pageSize) || 10;
      params.pageNum = (payload && payload.pageNum) || 1;
      const response = yield call(queryUseful, params);
      console.log(response);
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          usefulPatents: {
            list: result,
            pagination: {
              pageSize: params.pageSize,
              current: params.pageNum,
            },
          },
        },
      });
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
