// import { routerRedux } from 'dva/router'
import { notification } from 'antd';
import {
  getProjectList,
  addProjectName,
  editProjectName,
  deleteProjectName,
} from '../../services/system';

export default {
  namespace: 'projectSetting',
  state: {
    list: [],
    // searchValue: [],
    showEdit: false,
    project: {},
    editObject: {},
    visible: false,
  },
  effects: {
    *getAll({ payload }, { call, put }) {
      console.log(payload);
      const paramsData = {
        isDelete: 'NO',
        pageNum: payload.pageNum,
        name: payload.name,
        likeMode: payload.likeMode,
      };
      if (payload.pageNum === '') {
        delete paramsData.pageNum;
      }
      if (payload.name === '') {
        delete paramsData.name;
      }
      if (payload.likeMode === '') {
        delete paramsData.likeMode;
      }
      const response = yield call(getProjectList, paramsData);
      const { result } = response;
      const arr = response.result.list;
      yield put({
        type: 'save',
        payload: {
          list: arr,
          pagination: {
            pageSize: result.pageSize,
            current: result.pageNum,
            total: result.total,
          },
        },
      });
    },
    *saveProjectName({ payload, callback }, { call, put }) {
      let response;
      if (payload.project.id) {
        response = yield call(editProjectName, payload.project);
      } else {
        response = yield call(addProjectName, payload.project);
      }
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.list,
        });
        notification.success({
          message: `${payload.project.id ? '编辑' : '新增'}项目组成功！`,
        });
      } else {
        notification.error({
          message: `${payload.project.id ? '编辑' : '新增'}项目组失败！`,
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
