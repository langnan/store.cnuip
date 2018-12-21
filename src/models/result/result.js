import { notification } from 'antd';
import {
  getResultList,
  updateResult,
  getResultDetail,
  deleteResult,
  getProjectList,
  getLabelList,
  addResult,
  getCurrentUser,
} from '../../services/system';

export default {
  namespace: 'result',

  state: {
    result: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    resultDetail: {
      patentResultImageList: [],
      patentResultAttachmentList: [],
    },
    editObject: {},
    visible: false,
    resultId: 0,
    teamId: 0,
    teamList: [],
    labelList: [],
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(
        getResultList,
        Object.assign({ pageSize: 10, pageNum: 1 }, payload)
      );
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            result: {
              list: response.result.list,
              pagination: {
                total: response.result.total,
                pageSize: response.result.pageSize,
                current: response.result.pageNum,
              },
            },
          },
        });
      } else {
        notification.error({
          message: '请求科技成果列表出错！',
          description: response.message,
        });
      }
    },
    *getCurrentUser({ payload, callback }, { call, put }) {
      const response = yield call(getCurrentUser);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            currentUser: response.result,
          },
        });
      }
      if(callback) callback(response);
    },
    *getResultDetail({ payload }, { call, put }) {
      const response = yield call(getResultDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            resultDetail: response.result,
            editObject: {
              labels: response.result.labelValueList,
            },
          },
        });
      } else {
        notification.error({
          message: '请求科技成果详情出错！',
          description: response.message,
        });
      }
    },
    *saveResult({ payload, callback }, { call, put }) {
      let response;
      if (payload.result.id) {
        response = yield call(updateResult, payload.result);
      } else {
        response = yield call(addResult, payload.result);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.list,
        });
        notification.success({
          message: `${payload.result.id ? '编辑' : '新增'}科技成果成功！`,
        });
      } else {
        notification.error({
          message: `${payload.result.id ? '编辑' : '新增'}科技成果失败！`,
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
    *deleteResult({ payload, callback }, { call, put }) {
      let response = yield call(deleteResult, payload.id);
      response = JSON.parse(response);
      if (response.code === 0) {
        notification.success({
          message: '删除专利成果成功！',
        });
      } else {
        notification.error({
          message: '删除专利成果失败！',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
    *getExtraInfo({ payload, callback }, { call, put }) {
      const teamResponse = yield call(getProjectList, payload);
      const labelResponse = yield call(getLabelList, payload);
      if (teamResponse.code === 0 && labelResponse.code === 0) {
        yield put({
          type: 'save',
          payload: {
            teamList: teamResponse.result.list,
            labelList: labelResponse.result.list,
          },
        });
      } else {
        notification.error({
          message: '获取项目组和成果标签失败！',
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
    resetResult(state, { payload }) {
      return {
        ...state,
        resultDetail: payload,
      };
    },
    resetLabel(state, { payload }) {
      return {
        ...state,
        editObject: payload,
      };
    },
    showModal(state, { visible, resultId }) {
      return {
        ...state,
        visible,
        resultId,
      };
    },
  },
};
