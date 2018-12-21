import React from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Row,
  Col,
  Button,
  Icon,
  Spin,
  Form,
  Modal,
  Menu,
  message,
  Dropdown,
  Select,
  Table,
  Badge,
} from 'antd';
import styles from './Transaction.less';
import { Link } from 'dva/router';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ transaction, user, loading }) => ({
  transaction,
  user,
  //loading: loading.effects['post/fetchCurrentDepartment'],
}))
@Form.create()
export default class extends React.Component {
  state = {};
  componentDidMount() {
    this.getTransactionList();
  }

  getTransactionList = query => {
    const { dispatch, form } = this.props;
    console.log(query);
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        var params = {
          ...value,
          pageSize: (query && query.pageSize) || 10,
          pageNum: (query && query.pageNum) || 1,
        };
        console.log('-参数-');
        console.log(params);
        dispatch({
          type: 'transaction/fetchCurrent',
          payload: params,
          callback: res => {
            console.log('dsfsdf');
            console.log(this.props);
            console.log(this.props.user.currentUser.roles[0].name != 'ROLE_ADMIN');
          },
        });
      }
    });
  };

  updateTransactionState = record => {
    const { dispatch } = this.props;
    var params = {
      remoteId: record.id,
      state: 'CANCELLED',
    };
    console.log(record);
    dispatch({
      type: 'transaction/updateTranscationState',
      payload: params,
      callback: res => {
        this.getTransactionList();
      },
    });
  };

  render() {
    const { transaction, loading, form } = this.props;
    //  面包屑
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利交易',
      },
      {
        title: '委托交易',
      },
    ];

    const NestedTable = () => {
      const expandedRowRender = (transaction, index) => {
        console.log('------');
        console.log(transaction);
        console.log(index);
        console.log('------');
        const columns = [
          {
            title: '专利申请号',
            dataIndex: 'an',
            key: 'an',
          },
          {
            title: '专利名称',
            dataIndex: 'ti',
            key: 'ti',
          },
          {
            title: '专利类型',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => {
              var type = '';
              if (text === 'INVENTION') {
                type = '发明专利';
              } else if (text === 'APPEARANCE') {
                type = '外观专利';
              } else if (text === 'UTILITY') {
                type = '实用新型专利';
              }
              return <span>{type}</span>;
            },
          },
          {
            title: '权利人',
            dataIndex: 'pa',
            key: 'pa',
          },
          {
            title: '发明人',
            dataIndex: 'pin',
            key: 'pin',
          },
          {
            title: '委托价格',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => {
              return <span>¥{text}</span>;
            },
          },
        ];

        return (
          <Table
            columns={columns}
            dataSource={transaction.authorizePatentList}
            pagination={false}
            onRow={record => {
              console.log(record);
            }}
          />
        );
      };

      const columns = [
        {
          title: '委托编号',
          dataIndex: 'no',
          key: 'no',
        },
        {
          title: '委托人',
          dataIndex: 'realName',
          key: 'realName',
        },
        {
          title: '委托期限',
          dataIndex: 'endTime',
          key: 'endTime',
          render: (text, record, index) => {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          },
        },
        {
          title: '委托时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          render: (text, record, index) => {
            return <span>{moment(text).format('YYYY-MM-DD')}</span>;
          },
        },
        {
          title: '委托状态',
          dataIndex: 'state',
          key: 'state',
          render: (text, record, index) => {
            if (text === 'EXAMINED') {
              return <span>审核通过</span>;
            } else if (text === 'EXAMINING') {
              return <span>待审核</span>;
            } else if (text === 'UNEXAMINED') {
              return <span>审核不通过</span>;
            } else if (text === 'CANCELLED') {
              return <span>已取消</span>;
            }
          },
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          render: (text, record, index) => {
            if (
              (record.state === 'ADOPT' || record.state === 'EXAMINING') &&
              this.props.user.currentUser.roles[0].name != 'ROLE_ADMIN'
            ) {
              return (
                <span>
                  <Link to={`/transaction/detail/${record.id}`}>查看详情</Link>&nbsp;&nbsp;
                  <a onClick={() => this.updateTransactionState(record)}>取消委托</a>
                </span>
              );
            } else {
              return <Link to={`/transaction/detail/${record.id}`}>查看详情</Link>;
            }
          },
        },
      ];

      return (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={this.props.transaction.result.list}
          pagination={{
            ...this.props.transaction.result.pagination,
            onChange: (page, pageSize) => {
              this.getTransactionList({
                pageNum: page,
                pageSize: pageSize,
              });
            },
          }}
        />
      );
    };

    const { getFieldDecorator } = form;
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form>
                <Row>
                  <Col span={5} style={{ marginRight: 20 }}>
                    <FormItem>
                      <p>委托编号:</p>
                      {getFieldDecorator('no', {
                        initialValue: '',
                      })(<Input span={6} style={{ height: 40 }} size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={5} style={{ marginRight: 20 }}>
                    <FormItem>
                      <p>专利名称:</p>
                      {getFieldDecorator('ti', {
                        initialValue: '',
                      })(<Input span={6} style={{ height: 40 }} size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={5} style={{ marginRight: 20 }}>
                    <FormItem>
                      <p>委托人:</p>
                      {getFieldDecorator('realName', {
                        initialValue: '',
                      })(<Input span={6} style={{ height: 40 }} size="large" />)}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem>
                      <p>委托状态:</p>
                      {getFieldDecorator('state', {
                        initialValue: '',
                      })(
                        <Select
                          placeholder="请选择委托状态"
                          //style={{ width: 400 }}
                          //  onChange={this.handleChange}
                        >
                          <Option value={''}>全部</Option>
                          <Option value={'EXAMINED'}>审核通过</Option>
                          <Option value={'EXAMINING'}>待审核</Option>
                          <Option value={'UNEXAMINED'}>审核不通过</Option>
                          <Option value={'CANCELLED'}>已取消</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  style={{ marginRight: 15, textAlign: 'center', width: 90, height: 40 }}
                  onClick={this.getTransactionList}
                >
                  查询
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <div className={styles.topSearch}>
              <NestedTable />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
