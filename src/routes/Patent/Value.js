// import React from 'react';

// export default class Value extends React.Component {
//   render() {
//     return <div>价值分析</div>;
//   }
// }

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Select, Input, Row, Col, Button, DatePicker, Form, Modal, Table } from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from './Value.less';
import { Link } from 'dva/router';
const categoryList = [
  {
    type: 'DOMESTIC',
    value: '国内专利',
  },
  {
    type: 'INTERNATIONAL',
    value: '国际专利',
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

@connect(({ patentList, loading }) => ({
  patentList,
  loading: loading.effects['patentList/fetchValue'],
}))
@Form.create()
export default class patentList extends React.Component {
  query = {};

  componentDidMount() {
    this.getValueList();
  }

  getValueList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/fetchValue',
      payload: {
        ...this.query,
        ...params,
      },
    });
  };

  filterCategory = text => {
    let value1 = '';
    categoryList.forEach(ele => {
      if (ele.type === text) {
        const { value } = ele;
        value1 = value;
      }
    });
    return value1;
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

  submitQuery = e => {
    e.preventDefault();
    console.log(this.props.patentList.valueData.list);
    const { dispatch, form } = this.props;
    const startTime = '';
    const endTime = '';
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time.length) {
        fieldsValue.createdTimeFrom = moment(fieldsValue.time[0]).format('YYYY-MM-DD');
        fieldsValue.createdTimeTo = moment(fieldsValue.time[1]).format('YYYY-MM-DD');
      }
      delete fieldsValue.time;
      console.log('-----');
      console.log(fieldsValue.key);
      console.log(fieldsValue.createdTimeFrom);
      console.log(fieldsValue.createdTimeFrom);
      this.getValueList({
        anOrTi: fieldsValue.key,
        startTime: fieldsValue.createdTimeFrom,
        endTime: fieldsValue.createdTimeTo,
      });
    });
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利管理',
        href: '/patent/list',
      },
      {
        title: '价值分析',
      },
    ];
    const columns = [
      {
        title: '申请号',
        dataIndex: 'an',
        key: 'an',
      },
      {
        title: '专利名称',
        dataIndex: 'ti',
        key: 'ti',
      },
      {
        title: '专利价值得分',
        dataIndex: 'patentValue',
        key: 'patentValue',
        render: (text, record, index) => {
          return <span>{(parseFloat(text) * 100).toFixed(2)}</span>;
        },
      },
      {
        title: '法律价值得分',
        key: 'legalValue',
        dataIndex: 'legalValue',
        render: (text, record, index) => {
          return <span>{(parseFloat(text) * 100).toFixed(2)}</span>;
        },
      },
      {
        title: '技术价值得分',
        key: 'technologicalValue',
        dataIndex: 'technologicalValue',
        render: (text, record, index) => {
          return <span>{(parseFloat(text)*100).toFixed(2)}</span>;
        },
      },
      {
        title: '经济价值得分',
        key: 'economicValue',
        dataIndex: 'economicValue',
        render: (text, record, index) => {
          return <span>{(parseFloat(text)*100).toFixed(2)}</span>;
        },
      },
      {
        title: '最新评估时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
        render: (text, record, index) => {
          return <span>{moment(text).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, index) => {
          return <Link to={`/patent/valueDetail/${record.an}`}>查看详情</Link>;
        },
      },
    ];
    const { patentList, loading, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form onSubmit={this.submitQuery}>
                <Row>
                  <Col span={6}>
                    <FormItem label="申请号/专利名称">
                      {getFieldDecorator('key', {
                        initialValue: '',
                      })(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="large"
                          placeholder="请输入申请号/专利名称"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="评估时间">
                      {getFieldDecorator('time', {
                        initialValue: '',
                      })(<RangePicker style={{ width: 250, height: 40 }} />)}
                    </FormItem>
                  </Col>
                  <Col span={6} className={styles.btn}>
                    <FormItem>
                      <Button style={{ width: 90, height: 40 }} type="primary" htmlType="submit">
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
                pagination={{
                  ...patentList.valueData.pagination,
                  showQuickJumper: true,
                }}
                dataSource={patentList.valueData.list}
                onChange={pagination => {
                  const { form } = this.props;
                  form.validateFieldsAndScroll((err, fieldsValue) => {
                    if (err) return;
                    if (fieldsValue.time.length) {
                      fieldsValue.createdTimeFrom = moment(fieldsValue.time[0]).format('YYYY-MM-DD')
                      fieldsValue.createdTimeTo = moment(fieldsValue.time[1]).format('YYYY-MM-DD')
                    }
                    //delete fieldsValue.time;
                    console.log('-----');
                    console.log(fieldsValue.key);
                    console.log(fieldsValue.createdTimeFrom);
                    console.log(fieldsValue.createdTimeFrom);
                    console.log(pagination.current);
                    this.getValueList({
                      anOrTi: fieldsValue.key,
                      startTime: fieldsValue.createdTimeFrom,
                      endTime: fieldsValue.createdTimeTo,
                      pageNum: pagination.current,
                    });
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
