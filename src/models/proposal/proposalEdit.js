import {addProposal} from '../../services/proposal'
export default {
    namespace:'proposalEdit',
    state:{},
    effects:{
        *addProposal({ payload, callback }, { call, put }) {
            const response = yield call(addProposal, payload);
            if (callback) callback(response);
          },
    },
    reducers:{
        
    }
}