import React from 'react';
import { List, Button, Modal, Icon, Row, Col, message as AlertMsg } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { FaTrashAlt } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';

import styles from './Message.less';

const { confirm } = Modal;

@connect(({ message, user, loading }) => ({
  message,
  user,
  loading: loading.effects['message/fetch'],
}))
export default class Messages extends React.Component {
  state = {
    multiSelect: false,
    selectedMsgs: [],
  };

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      callback: current => {
        dispatch({
          type: 'message/fetch',
          payload: params,
        });
      },
    });
  };

  deleteMessages = msgs => {
    if (!msgs || msgs.length <= 0) {
      AlertMsg.warn('请选择需要删除的消息');
      return;
    }
    confirm({
      title: `确认删除系统消息吗`,
      content: `删除内容后不可恢复`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'message/deleteMessages',
          payload: msgs.map(m => ({
            from_client: m.from,
            msgId: m['msg-id'],
            timestamp: m.timestamp,
          })),
          callback: res => {
            this.fetchMessages();
            this.setState({
              multiSelect: false,
            });
          },
        });
      },
    });
  };

  toggleMultiSelect = flag => {
    this.setState({
      multiSelect: flag,
    });
  };

  toggleMsgSelection = msg => {
    const { selectedMsgs } = this.state;
    const selectedMsg = selectedMsgs.find(m => m['msg-id'] === msg['msg-id']);
    if (selectedMsg) {
      const index = selectedMsgs.indexOf(selectedMsg);
      this.setState(state => {
        return {
          selectedMsgs: [
            ...state.selectedMsgs.slice(0, index),
            ...state.selectedMsgs.slice(index + 1),
          ],
        };
      });
    } else {
      this.setState(state => {
        return {
          selectedMsgs: [...state.selectedMsgs, msg],
        };
      });
    }
  };

  render() {
    const { message, loading } = this.props;
    const { multiSelect, selectedMsgs } = this.state;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利咨讯',
      },
      {
        title: '系统通知',
      },
    ];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <div className={styles.topActions}>
          {multiSelect ? (
            <Button
              onClick={() => {
                this.deleteMessages(selectedMsgs);
              }}
              style={{ backgroundColor: '#f3f3fb' }}
            >
              删除
            </Button>
          ) : (
            <span
              onClick={() => {
                this.toggleMultiSelect(true);
              }}
            >
              <FaTrashAlt />
              <span>批量删除</span>
            </span>
          )}
        </div>
        <List
          loading={loading}
          className={styles.messageList}
          itemLayout="vertical"
          size="large"
          // pagination={{
          //   onChange: page => {
          //     this.fetchMessages({ pageNum: page });
          //   },
          //   ...message.data.pagination,
          //   showQuickJumper: true,
          // }}
          pagination={false}
          dataSource={message.data.list}
          renderItem={item => {
            const isSelected = selectedMsgs.find(m => m['msg-id'] === item['msg-id']);
            const msgData = JSON.parse(item.data);
            return (
              <div className={styles.itemContent} key={item['msg-id']}>
                <Row type="flex" align="middle">
                  <Col span={22}>
                    <p className={styles.messageDate}>
                      {moment(item.timestamp).format('YYYY-MM-DD hh:mm:ss')}
                    </p>
                    <p className={styles.messageDetail}>{msgData.title || msgData._lctext}</p>
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    {multiSelect ? (
                      <Icon
                        type="check-circle"
                        theme={isSelected ? 'filled' : 'outlined'}
                        style={{ fontSize: '22px', color: '#3b77e3' }}
                        onClick={() => {
                          this.toggleMsgSelection(item);
                        }}
                      />
                    ) : (
                      <Button
                        className={styles.deleteBtn}
                        onClick={() => {
                          this.deleteMessages([item]);
                        }}
                      >
                        删除
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            );
          }}
        />
      </div>
    );
  }
}
