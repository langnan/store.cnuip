// import { routerRedux } from 'dva/router'
import { notification } from 'antd';
import { getLabelList, addLabel, editLabel, deleteLabel } from '../../services/system';

export default {
  namespace: 'label',
  state: {
    list: [],
    searchValue: [],
    showEdit: false,
    label: {},
    editObject: {},
    visible: false,
  },
  effects: {
    *getAll({ payload }, { call, put }) {
      const response = yield call(getLabelList, { isDelete: 'NO', pageSize: 0, pageNum: 0 });
      yield put({
        type: 'save',
        payload: {
          searchValue: response.result.list,
        },
      });
    },
    *saveLabel({ payload, callback }, { call, put }) {
      let response;
      if (payload.label.id) {
        response = yield call(editLabel, payload.label);
      } else {
        response = yield call(addLabel, payload.label);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.list,
        });
        notification.success({
          message: `${payload.label.id ? '编辑' : '新增'}成果标签成功！`,
        });
      } else {
        notification.error({
          message: `${payload.label.id ? '编辑' : '新增'}成果标签失败！`,
          description: response.message,
        });
      }
      if (callback) callback(response);
    },

    *deleteLabel({ payload, callback }, { call, put }) {
      let response = yield call(deleteLabel, payload.id);
      response = JSON.parse(response);
      if (response.code === 0) {
        notification.success({
          message: '删除成果标签成功！',
        });
      } else {
        notification.error({
          message: '删除成果标签失败！',
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
        searchValue: state.searchValue.filter(p => p.name.indexOf(payload.query) >= 0),
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
