import { routerRedux } from 'dva/router';
import { getLevelList, saveLevel, deleteLevel } from '../../services/system';

export default {
  namespace: 'level',

  state: {
    result: {},
    searchResult: [],
    showEdit: false,
    editObject: {},
    visible: false,
  },

  effects: {
    *fetchCurrent({ callback, payload }, { call, put }) {
      const response = yield call(getLevelList, { isDelete: 'NO', pageNum: 0, pageSize: 0 });
      yield put({
        type: 'save',
        payload: {
          result: response.result,
          searchResult: response.result.list,
        },
      });
      if (callback) callback(response);
    },
    *saveLevel({ payload, callback }, { call, put }) {
      const response = yield call(saveLevel, payload);
      if (callback) callback(response);
    },
    *deleteLevel({ payload, callback }, { call, put }) {
      const response = yield call(deleteLevel, payload.id);
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
    search(state, { payload }) {
      const { query } = payload;
      return {
        ...state,
        result: {
          list: state.result.list.filter(i => i.name.indexOf(query) >= 0),
        },
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
