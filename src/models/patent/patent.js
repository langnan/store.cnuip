import { notification } from 'antd';
import { getValueList } from '../../services/patent';

export default {
  namespace: 'patent',

  state: {
    result: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      proposal: {},
    },
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(
        getValueList,
        Object.assign({ pageSize: 10, pageNum: 1 }, payload)
      );
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            result: response.result,
          },
        });
      } else {
        notification.error({
          message: '请求价值分析列表出错！',
          description: response.message,
        });
      }
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
