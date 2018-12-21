import { notification } from 'antd';
import {
  getProcessUserList,
  getProposalList,
  getProposalDetail,
  changeProposalUserState,
  changeProposalState,
  AddProposal,
} from '../../services/proposal';

import { getCurrentUser, getUserList } from '../../services/system';

export default {
  namespace: 'myAudit',

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
        getProposalList,
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
          message: '请求审核提案列表出错！',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },

    // *getCurrentUser({ payload }, { call, put }) {
    //   const response = yield call(getCurrentUser);
    //   if (response.code === 0) {
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         currentUser: response.result,
    //       },
    //     });
    //     if (response.result.roles[0].name === 'ROLE_ADMIN') {
    //       yield put({
    //         type: 'getProcessUserList',
    //         payload: {
    //           pageSize: 0,
    //           pageNum: 0,
    //         },
    //       });
    //     } else {
    //       yield put({
    //         type: 'save',
    //         payload: {
    //           allUser: {
    //             list: [],
    //           },
    //         },
    //       });
    //     }
    //   }
    // },

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

    *changeProposalUserState({ payload, callback }, { call, put }) {
      const response = yield call(changeProposalUserState, payload.proposal);
      if (response.code === 0) {
        notification.success({
          message: '审核提案成功！',
        });
      } else {
        notification.error({
          message: '审核提案失败！',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
  },

  *changeProposalState({ payload, callback }, { call, put }) {
    const response = yield call(changeProposalState, payload.proposal);
    if (response.code === 0) {
      notification.success({
        message: '已成功关闭该申请！',
      });
    } else {
      notification.error({
        message: '关闭该申请失败！',
        description: response.message,
      });
    }
    if (callback) callback(response);
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
