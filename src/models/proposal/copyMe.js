import { notification } from 'antd';
import { getProcessUserList, getCopyMeList, getProposalDetail } from '../../services/proposal';
import { getCurrentUser, getUserList } from '../../services/system';

export default {
  namespace: 'copyMe',

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
    dateRange: [],
    proposalDetail: {},
    allUser: [],
  },

  effects: {
    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(
        getCopyMeList,
        payload
        // Object.assign({ pageSize: 10, pageNum: 1 }, payload)
      );
      if (response.code === 0) {
        const { result } = response;
        yield put({
          type: 'save',
          payload: {
            result: {
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
        notification.error({
          message: '请求抄送提案列表出错！',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },

    *getProcessUserList({ payload }, { call, put }) {
      const response = yield call(getProcessUserList, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            allUser: response.result,
          },
        });
      }
    },

    *getPorposalDetail({ payload }, { call, put }) {
      const response = yield call(getProposalDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            proposalDetail: response.result,
          },
        });
      } else {
        notification.error({
          message: '请求提案详情出错！',
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
