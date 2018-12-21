import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Icon, Input, Button, Select, Divider, Row, Col, DatePicker, Table, Tag } from 'antd';
import moment from 'moment';
import PageHeader from '../../components/PageHeader';
import styles from './Common.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const patentTypeList = [
  {
    type: 'INVENTION',
    value: '发明专利',
  },
  {
    type: 'APPEARANCE',
    value: '外观专利',
  },
  {
    type: 'UTILITY',
    value: '实用新型',
  },
];

@connect(({ copyMe, loading }) => ({
  copyMe,
  loading: loading.effects['copyMe/fetchCurrent'],
}))
@Form.create()
export default class CopyMe extends React.Component {
  componentDidMount() {
    this.getProposalList();
    this.getProcessUserList();
  }

  getProcessUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'copyMe/getProcessUserList',
    });
  };

  getProposalList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'copyMe/fetchCurrent',
      payload: {
        state: '',
        pageSize: 0,
        pageNum: 0,
      },
    });
  };

  filterPatentType = text => {
    let val = '';
    patentTypeList.forEach(n => {
      if (n.type === text) {
        val = n.value;
      }
    });
    return val;
  };

  // filterPeopleList = text => {
  //   let peopleVal = '';
  //   peopleList.forEach(n => {
  //     if (n.type === text) {
  //       peopleVal = n.value;
  //     }
  //   });
  //   return peopleVal;
  // };

  // 查询

  searchList = p => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time.length) {
        fieldsValue.createdTimeFrom = moment(fieldsValue.time[0]).format('x');
        fieldsValue.createdTimeTo = moment(fieldsValue.time[1]).format('x');
      }
      delete fieldsValue.time;
      dispatch({
        type: 'copyMe/fetchCurrent',
        payload: {
          ...fieldsValue,
          ...p,
        },
      });
    });
  };

  render() {
    const { copyMe, loading, form } = this.props;
    const { allUser } = copyMe;
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
        title: '抄送给我',
      },
    ];

    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
        key: 'no',
        render: text => <span>{text}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '专利类型',
        dataIndex: 'patentType',
        key: 'patentType',
        render: text => <div>{this.filterPatentType(text)}</div>,
      },
      {
        title: '提案内容',
        key: 'content',
        dataIndex: 'content',
        render: text => <div className={styles.textOverflow}>{text}</div>,
      },
      {
        title: '提案人',
        key: 'editorId',
        dataIndex: 'editorName',
        // render: text => <div>{this.filterPeopleList(text)}</div>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/proposal/detail/${record.id}`}>查看</Link>
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
                            return (
                              <Option key={ele.editorId} value={ele.editorId}>
                                {ele.editorName}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="提案名称">
                      {getFieldDecorator('name', {
                        initialValue: '',
                      })(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="large"
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
                  <Col span={6} className={styles.btn}>
                    <FormItem>
                      <Button
                        style={{ width: 90, height: 40 }}
                        type="primary"
                        onClick={() => {
                          this.searchList();
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
                dataSource={copyMe.result.list}
                pagination={{
                  ...copyMe.result.pagination,
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
      </div>
    );
  }
}
