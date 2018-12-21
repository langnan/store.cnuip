// import { routerRedux } from 'dva/router'
import { notification } from 'antd';
import {
  addLabelValue,
  editLabelValue,
  deleteLabelValue,
  getLabelValueList,
} from '../../services/system';

export default {
  namespace: 'labelValue',
  state: {
    list: [],
    labelId: 0,
    searchValue: [],
    showEdit: false,
    labelValue: {},
    editObject: {},
    visible: false,
  },
  effects: {
    *getAll({ payload }, { call, put }) {
      const response = yield call(getLabelValueList, payload);
      yield put({
        type: 'save',
        payload: {
          searchValue: response.result,
        },
      });
    },
    *saveLabelValue({ payload, callback }, { call, put }) {
      let response;
      if (payload.labelValue.id) {
        response = yield call(editLabelValue, payload.labelValue);
      } else {
        response = yield call(addLabelValue, payload.labelValue);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.list,
        });
        notification.success({
          message: `${payload.labelValue.id ? '编辑' : '新增'}标签值成功！`,
        });
      } else {
        notification.error({
          message: `${payload.labelValue.id ? '编辑' : '新增'}标签值失败！`,
          description: response.message,
        });
      }
      if (callback) callback(response);
    },

    *deleteLabelValue({ payload, callback }, { call, put }) {
      let response = yield call(deleteLabelValue, payload.id);
      response = JSON.parse(response);
      if (response.code === 0) {
        notification.success({
          message: '删除标签值成功！',
        });
      } else {
        notification.error({
          message: '删除标签值失败！',
          description: response.message,
        });
      }
      if (callback) callback(response);
    },
  },
  reducers: {
    search(state, { payload }) {
      return {
        ...state,
        searchValue: state.searchValue.filter(p => p.value.indexOf(payload.query) >= 0),
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setEditObject(state, { payload, flag }) {
      return {
        ...state,
        editObject: payload,
        showEdit: flag,
      };
    },
    showModal(state, { visible }) {
      return {
        ...state,
        visible,
      };
    },
  },
};
