/**
 * ProposalList
 * User: Ray丶X
 * CreatedAt: 2018/8/30 13:53
 */
import { notification } from 'antd';
import {
  getEditorProposalList,
  changeProposalUserState,
  addProcessRequisition,
  getProposalDetail,
  changeProposalState,
  AddProposal,
} from '../../services/proposal';

import { getCurrentUser, getUserList } from '../../services/system';

export default {
  namespace: 'proposalList',

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
    currentUser: {},
    allUser: {
      list: [],
    },
    files: [],
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(
        getEditorProposalList,
        Object.assign({ pageSize: 10, pageNum: 1 }, payload)
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
          message: '请求提案列表出错！',
          description: response.message,
        });
      }
    },
    *getCurrentUser({ payload }, { call, put }) {
      const response = yield call(getCurrentUser);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            currentUser: response.result,
          },
        });
        if (response.result.roles[0].name === 'ROLE_ADMIN') {
          yield put({
            type: 'getUserList',
            payload: {
              pageSize: 0,
              pageNum: 0,
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              allUser: {
                list: [],
              },
            },
          });
        }
      }
    },
    *getUserList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            allUser: response.result,
          },
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
    *getPorposalDetail({ payload }, { call, put }) {
      const response = yield call(getProposalDetail, payload);
      if (response.code === 0) {
        if (
          response.result.processTaskVoList &&
          response.result.processTaskVoList.length
        ) {
          response.result.processTaskVoList.forEach((ele, index) => {
            const element = ele;
            if (ele.processTaskDepartmentVoList && ele.processTaskDepartmentVoList.length) {
              ele.processTaskDepartmentVoList.forEach(el => {
                if (el.processTaskUserList && el.processTaskUserList.length) {
                  el.processTaskUserList.forEach(e => {
                    if (e.isExamined === 'NO') {
                      element.isExamined = 'NO';
                      element.stopIndex = index;
                      response.result.processTaskVoList.splice(
                        index + 1,
                        response.result.processTaskVoList.length
                      );
                    }
                  });
                }
              });
            }
          });
        }
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
    *addPorposal({ payload, callback }, { call, put }) {
      const response = yield call(AddProposal, payload);
      if (response.message === 'success') {
        notification.success({
          message: '添加提案详情成功！',
          description: response.message,
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '添加提案详情出错！',
          description: response.message,
        });
      }
    },
    *addProcessRequisition({ payload, callback }, { call, put }) {
      const response = yield call(addProcessRequisition, payload);
      if (response.code === 0) {
        notification.success({
          message: '上传申请书成功！',
        });
      } else {
        notification.error({
          message: '上传申请书出错！',
          description: response.message,
        });
      }
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
