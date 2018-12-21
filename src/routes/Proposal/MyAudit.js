import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Select, Input, Row, Col, Button, DatePicker, Form, Modal, Table } from 'antd';
import PageHeader from '../../components/PageHeader';

import styles from './Common.less';

const newStateList = [
  {
    id: 1,
    isExamined: 'YES',
    value: '审核通过',
    color: '#ff6101',
  },
  {
    id: 2,
    isExamined: 'NO',
    value: '审核未通过',
    color: '#ff6101',
  },
  {
    id: 3,
    isExamined: 'NONE',
    value: '未审核',
    color: 'normal',
  },
];
const stateList = [
  {
    id: 1,
    type: 'EXAMINING',
    value: '待审核',
    color: '#ff6101',
  },
  {
    id: 2,
    type: 'RUNNING',
    value: '审核中',
    color: '#ff6101',
  },
  {
    id: 3,
    type: 'FINISHED',
    value: '已完成',
    color: 'normal',
  },
  {
    id: 4,
    type: 'CLOSED',
    value: '已关闭',
    color: 'normal',
  },
  {
    id: 5,
    type: 'UNEXAMINED',
    value: '审核不通过',
    color: '#ff0101',
  },
  {
    id: 6,
    type: '',
    value: '全部',
    color: '#ff0101',
  },
];
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ myAudit, user, loading }) => ({
  myAudit,
  user,
  loading: loading.effects['myAudit/fetchCurrent'],
}))
@Form.create()
export default class extends React.Component {
  state = {
    modalVisible: false,
    modalText: '',
    confirmLoading: false,
    currentProposal: undefined,
  };

  componentDidMount() {
    this.getProposalList();
    this.getProcessUserList();
  }

  getProcessUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myAudit/getProcessUserList',
    });
  };

  getProposalList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myAudit/fetchCurrent',
      payload: {
        state: '',
        pageSize: 0,
        pageNum: 0,
      },
    });
  };

  filterState = text => {
    let state = '';
    stateList.forEach(ele => {
      if (ele.type === text) {
        state = ele.value;
      }
    });
    return state;
  };

  filterNewState = text => {
    let newState = '';
    newStateList.forEach(ele => {
      if (ele.isExamined === text) {
        newState = ele.value;
      }
    });
    return newState;
  };

  filterColor = text => {
    let color1 = '';
    stateList.forEach(ele => {
      if (ele.type === text) {
        const { color } = ele;
        color1 = color;
      }
    });
    return color1;
  };

  filterNewColor = text => {
    let color2 = '';
    newStateList.forEach(ele => {
      if (ele.isExamined === text) {
        const { color } = ele;
        color2 = color;
      }
    });
    return color2;
  };

  // 查询
  searchList = val => {
    const { form, dispatch, myAudit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (values.time.length) {
        values.createdTimeFrom = moment(values.time[0]).format('x');
        values.createdTimeTo = moment(values.time[1]).format('x');
      }
      delete values.time;
      if (!err) {
        // form.resetFields();
        dispatch({
          type: 'myAudit/fetchCurrent',
          payload: {
            ...values,
            ...val,
          },
        });
      }
    });
  };

  handleCheck = proposal => {
    this.setState({
      currentProposal: proposal,
      modalVisible: true,
      modalText: '提案审核',
    });
  };

  /**
   * 关闭模态框
   */
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false,
      currentProposal: undefined,
    });
  };

  // 提交审核状态
  handleOk = taskId => {
    const { form, user, myAudit } = this.props;
    const { currentProposal } = this.state;
    form.validateFields((err, values) => {
      const { isExamined, remark } = values;
      if (!err) {
        this.changeState(currentProposal.id, isExamined, remark, currentProposal.processTaskId);
      }
    });
  };

  /**
   * 更改审核状态
   */
  changeState = (id, e, mark, taskId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myAudit/changeProposalUserState',
      payload: {
        proposal: {
          isExamined: e,
          processId: id,
          remark: mark,
          processTaskId: taskId,
        },
      },
      callback: res => {
        if (res.code === 0) {
          this.handleModalCancel();
          this.getProposalList();
        }
      },
    });
  };

  renderProposalModal() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { currentProposal } = this.state;
    return (
      <Form onSubmit={this.handleModalConfirm}>
        <FormItem label="是否通过审核:">
          {getFieldDecorator('isExamined', {
            rules: [
              {
                required: true,
                message: '请选择一项',
              },
            ],
          })(
            <Select placeholder="是否通过审核" style={{ width: 163, height: 40 }}>
              <Option value="YES">是</Option>
              <Option value="NO">否</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="审核意见" {...this.formLayout}>
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '必须填写审核意见',
              },
            ],
          })(<textarea style={{ width: 400, height: 100 }} placeholder="请输入审核意见" />)}
        </FormItem>
      </Form>
    );
  }

  render() {
    const { user, myAudit, loading, form } = this.props;
    const { allUser } = myAudit;
    const { modalVisible, modalText, confirmLoading, currentProposal } = this.state;
    const { getFieldDecorator } = form;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '提案管理',
        href: '/proposal/',
      },
      {
        title: '由我审核',
      },
    ];

    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '提案人',
        key: 'editorId',
        dataIndex: 'editorName',
        // render:text => {text}
      },
      {
        title: '提案内容',
        key: 'content',
        dataIndex: 'content',
        render: val => (val.length > 10 ? `${val.slice(0, 10)}...` : val),
      },
      {
        title: '审核进度',
        key: 'state',
        dataIndex: 'state',
        render: text => (
          <div style={{ color: this.filterColor(text) }}>{this.filterState(text)}</div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/proposal/detail/${record.id}`}>查看</Link>&nbsp;&nbsp;&nbsp;
            {user.currentUser.username === 'admin' ||
            record.isExamined === 'YES' ||
            record.isExamined === 'NO' ||
            record.state === 'CLOSED' ? (
              ''
            ) : (
              <a onClick={() => this.handleCheck(record)}>审核</a>
            )}
          </span>
        ),
      },
    ];

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form>
                <Row>
                  <Col span={6}>
                    <FormItem label="提案人">
                      {getFieldDecorator('editorId')(
                        <Select
                          allowClear
                          placeholder="全部"
                          style={{ width: 250, height: 40 }}
                          onChange={this.handleChange}
                        >
                          {allUser.map((ele, i) => {
                            return <Option key={ele.editorId}>{ele.editorName}</Option>;
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="提案编号:">
                      {getFieldDecorator('no', {})(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="small"
                          placeholder="请输入提案编号"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="提案名称:">
                      {getFieldDecorator('name', {})(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="small"
                          placeholder="请输入提案名称"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="提案时间">
                      {getFieldDecorator('time', {
                        initialValue: '',
                      })(<RangePicker style={{ width: 250, height: 40 }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <FormItem label="审核状态">
                      {getFieldDecorator('state', {
                        initialValue: '',
                      })(
                        <Select style={{ width: 250, height: 40 }} initialValue="">
                          {stateList.map((ele, i) => {
                            return (
                              <Option key={ele.id} value={ele.type}>
                                {ele.value}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} className={styles.btn}>
                    <FormItem>
                      <Button
                        style={{ width: 90, height: 40 }}
                        type="primary"
                        onClick={() => {
                          this.searchList({});
                        }}
                      >
                        查询
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={styles.list}>
              <Table
                loading={loading}
                rowKey="id"
                columns={columns}
                dataSource={myAudit.result.list}
                pagination={{
                  ...myAudit.result.pagination,
                  showQuickJumper: true,
                }}
                onChange={pagination => {
                  this.searchList({
                    pageNum: pagination.current,
                  });
                }}
              />
            </div>
          </Col>
        </Row>
        {!!currentProposal && (
          <Modal
            title={modalText}
            visible={modalVisible}
            width={640}
            destroyOnClose
            maskClosable={false}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleModalCancel}
          >
            {this.renderProposalModal()}
          </Modal>
        )}
      </div>
    );
  }
}
