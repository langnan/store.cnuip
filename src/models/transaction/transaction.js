import {routerRedux} from 'dva/router';
import {notification} from 'antd';
import { getTransactionList ,addTransactionList ,getTranscationDetail ,updateTranscationState} from '../../services/transaction';

export default {
    namespace:'transaction',
    state:{
      result: {
        list: [],
        pagination: {
          total: 0,
          pageSize: 10,
          current: 1,
        },
        proposal: {},
      },
      transactionDetail:{}
    },
    effects:{
      *fetchCurrent({ payload , callback}, { call, put }) {
        console.log(payload);
        const params = { ...payload };
        params.pageSize = (payload && payload.pageSize) || 10;
        params.pageNum = (payload && payload.pageNum) || 1;
        const response = yield call(
          getTransactionList,
          payload
        );
        if (response.message === 'success') {
          console.log("dfjklsdjfjsdfkjsdkfds");
          console.log(response);
          yield put({
            type: 'save',
            payload: {
              result:{
                list: response.result.list,
                pagination: {
                  pageSize: response.result.pageSize,
                  current: response.result.pageNum,
                  total:response.result.total
                },
              }
            },
          });
          if (callback) callback(response);
        } else {
          notification.error({
            message: '请求提案列表出错！',
            description: response.message,
          });
        }
      },

      *add({ payload ,callback }, { call, put }) {
        console.log(payload);
        const response = yield call(
          addTransactionList,
          payload
        );
        if (response.message === 'success') {
          notification.success({
            message: '新增委托成功!',
          });
          if (callback) callback(response);
        } else {
          notification.error({
            message: '新增委托失败！',
            description: response.message,
          });
        }
      },
      *getTranscationDetail({ payload }, { call, put }) {
        console.log('开始查询详情');
        const response = yield call(getTranscationDetail, payload);
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              transactionDetail: response.result,
            },
          });
        } else {
          notification.error({
            message: '请求委托详情出错！',
            description: response.message,
          });
        }
      },
      *updateTranscationState({ payload , callback}, { call, put }) {
        console.log('改变委托状态');
        const response = yield call(updateTranscationState, payload);
        if (response.message === 'success') {
          notification.success({
            message: '取消委托成功！',
          });
          if (callback) callback(response);
        } else {
          notification.error({
            message: '取消委托出错！',
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
}