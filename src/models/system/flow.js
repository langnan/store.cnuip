import { routerRedux } from 'dva/router';
import {
  getAllFlows,
  getFlowDetail,
  saveFlow,
  deleteFlow,
  getDepartmentArray,
  getLevelList,
} from '../../services/system.js';

const flowTypeMap = {
  NORMAL: '普通',
  AND: '会签',
  OR: '或签',
};

export { flowTypeMap };

function treeToFlatList(tree) {
  const departmentList = [];
  function traverse(treeData) {
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node.children) {
        const children = [...node.children];
        traverse(children);
      }
      delete node.children;
      departmentList.push(node);
    }
  }
  traverse(tree);
  return departmentList;
}

export default {
  namespace: 'flow',

  state: {
    list: [],
    searchList: [],
    allLevels: [],
    allDepartments: [],
    levelSearchList: [],
    departmentSearchList: [],
  },

  effects: {
    *fetchAllFlows({ payload, callback }, { call, put }) {
      const response = yield call(getAllFlows);
      yield put({
        type: 'save',
        payload: {
          list: response.result,
          searchList: response.result,
        },
      });
      if (callback) callback(response);
    },
    *saveFlow({ payload, callback }, { call, put }) {
      const response = yield call(saveFlow, payload);
      if (callback) callback(response);
    },
    *getFlowDetail({ payload, callback }, { call, put }) {
      const response = yield call(getFlowDetail, payload);
      if (callback) callback(response);
    },
    *getDepartmentArray({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentArray, payload);
      const { result } = response;
      if (result) {
        const departmentList = result;
        console.log(departmentList);
        yield put({
          type: 'save',
          payload: {
            allDepartments: departmentList,
            departmentSearchList: departmentList,
          },
        });
      }
      if (callback) callback(response);
    },
    *getLevels({ callback, payload }, { call, put }) {
      const response = yield call(getLevelList, { isDelete: 'NO', pageNum: 0, pageSize: 0 });
      const { result } = response;
      yield put({
        type: 'save',
        payload: {
          allLevels: result.list,
          levelSearchList: result.list,
        },
      });
      if (callback) callback(response);
    },
    *deleteFlow({ payload, callback }, { call, put }) {
      const response = yield call(deleteFlow, payload);
      if (callback) callback(JSON.parse(response));
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    searchFlow(state, { payload }) {
      return {
        ...state,
        searchList: state.list.filter(f => f.name.indexOf(payload.query) >= 0),
      };
    },
    searchLevel(state, { payload }) {
      return {
        ...state,
        levelSearchList: state.allLevels.filter(d => d.name.indexOf(payload.query) >= 0),
      };
    },
    searchDepartment(state, { payload }) {
      return {
        ...state,
        departmentSearchList: state.allDepartments.filter(d => d.name.indexOf(payload.query) >= 0),
      };
    },
  },
};
