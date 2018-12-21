import { Realtime, Event } from 'leancloud-realtime';
import { stringify } from 'qs';
import { notification } from 'antd';
import request from '../utils/request';
import store from '../index';

const realtime = new Realtime({
  appId: 'eLLCgl8EnhMEsGzUlzOP9wpE-gzGzoHsz',
  appKey: 'hAEDbW1c66PFL3V6RMQVVcM7',
  region: 'cn',
});

let clientId;
let convType;

export default {
  init: (userId, platformId) => {
    clientId = `${platformId}${userId}`;
    convType = platformId === 20 ? 'TREASURE' : 'BAG';
    realtime
      .createIMClient(clientId)
      .then(client => {
        console.log(`IM Client(${clientId}) Online`);
        client.on(Event.MESSAGE, (message, conversation) => {
          console.log(`Message received: ${message}`);
          notification.info({
            message: '收到一条系统消息',
            description: message.text,
          });
          const { dispatch } = store;
          dispatch({
            type: 'message/fetch',
          });
        });
        return client
          .getQuery()
          .equalTo('sys', true)
          .find();
      })
      .then(convs => {
        const convName = platformId === 20 ? 'Treasure Conversation' : 'Bag Conversation';
        const conv = convs && convs.find(c => c._attributes.name === convName);
        if (conv) {
          return conv.subscribe();
        }
      })
      .then(res => {
        console.log('subscribe success');
      })
      .catch(console.error);
  },
};

/**
 * 获取系统消息
 * @param {*} payload
 */
export async function querySystemMessage(payload) {
  return request(`/api/colligate/v1/push/messages?clientId=${clientId}&convType=${convType}`);
}

/**
 * 删除系统消息
 * @param {*} payload
 * @param {*} body
 */
export async function deleteSystemMessage(payload) {
  return request(`/api/colligate/v1/push/?clientId=${clientId}&convType=${convType}`, {
    method: 'DELETE',
    body: payload,
  });
}

/**
 * 订阅leancloud
 * @param {*} payload
 */
export async function subscribeClient() {
  return request(`/api/colligate/v1/push/subscriber?clientId=${clientId}&convType=${convType}`, {
    method: 'POST',
  });
}
