import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { getDepartmentList,addDepartment,editDepartment ,getCurrentUser,deleteDepartment} from '../../services/system';

export default {
  namespace: 'department',

  state: {
    list: [],
    editObject:{
      name:'',
      id:'',
    },
    searchDepartmentList:[]
  },

  effects: {
    *fetchCurrent({ callback, payload }, { call, put }) {
      const userResponse = yield call(getCurrentUser);
      if (userResponse.code === 0) {
        const response = yield call(getDepartmentList);
        yield put({
          type: 'save',
          payload: {
            list:[
              {
                id: 0,
                name: userResponse.result.organizationName,
                children: response.result,
              }
            ],
            searchDepartmentList:[
              {
                id: 0,
                name: userResponse.result.organizationName,
                children: response.result,
              }
            ],
          },
        });
        if (callback) callback(response);
      } else {
        notification.error({
          message: '获取组织信息失败！',
        });
      }





    },
    *saveDepartment({callback,payload},{call,put}){
      const response=yield call(saveDepartment,payload);
      if(callback){
        callback(response);
      }
    },
    *addDepartment({callback,payload},{call,put}){
      const response=yield call(addDepartment,payload);
      if(response.message==='success'){
        notification.success({
          message:'新增部门成功'
        })
      }else{
        notification.error({
          message:'新增部门失败',
          description: response.detailMessage,
        })
      }
      if(callback){
        callback(response);
      }
    },
    *editDepartment({callback,payload},{call,put}){
      const response=yield call(editDepartment,payload);
      if(response.message==='success'){
        notification.success({
          message:'编辑部门成功'
        })
      }else{
        notification.error({
          message:'编辑部门失败',
          description: response.detailMessage,
        })
      }
      if(callback){
        callback(response);
      }
    },
    *deleteDepartment({callback,payload},{call,put}){
      const response=yield call(deleteDepartment,payload);
      if(JSON.parse(response).message==='success'){
        notification.success({
          message:'删除部门成功'
        })
        if(callback){
          callback(response);
        }
      }else{
        notification.error({
          message:'删除部门失败',
          description: JSON.parse(response).detailMessage,
        })
      }

    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    editDepartment(state,{payload}){
      return{
        ...state,
        editObject:payload
      }
    },
    search(state, { payload }) {
      return {
        ...state,
        searchDepartmentList: state.list.filter(p => p.name.indexOf(payload.query) >= 0),
        
      };
    },
  }
};
