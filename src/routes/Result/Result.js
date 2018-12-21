import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Divider,
  Row,
  Col,
  DatePicker,
  Table,
  Modal,
} from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from '../Proposal/Common.less';

const FormItem = Form.Item;
const { Option } = Select;
const maturityList = [
  {
    id: 1,
    type: null,
    value: '全部',
  },
  {
    id: 2,
    type: 'SAMPLE',
    value: '已有样品',
  },
  {
    id: 3,
    type: 'SMALL_TEST',
    value: '通过小试',
  },
  {
    id: 4,
    type: 'PILOT_TEST',
    value: '通过中试',
  },
  {
    id: 5,
    type: 'BATCH_PRODUCTION',
    value: '可以量产',
  },
];

@connect(({ result, loading }) => ({
  result,
  loading: loading.effects['result/fetchCurrent'],
}))
@Form.create()
export default class Result extends React.Component {
  componentDidMount() {
    this.getResultList();
    this.getCurrentUser();
  }

  getResultList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/fetchCurrent',
    });
  };

  getCurrentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/getCurrentUser',
    });
  };

  filterMaturity = text => {
    let val = '';
    maturityList.forEach(n => {
      if (n.type === text) {
        val = n.value;
      }
    });
    return val;
  };

  // 查询
  handleSubmit = p => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.likeMode = 'ALL';
      if (!err) {
        // form.resetFields();
        dispatch({
          type: 'result/fetchCurrent',
          payload: {
            ...values,
            ...p,
          },
        });
      }
    });
  };

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/showModal',
      visible: true,
      resultId: id,
    });
  };

  handleOk = e => {
    e.preventDefault();
    const {
      dispatch,
      result: { resultId },
    } = this.props;
    this.handleCancel();
    dispatch({
      type: 'result/deleteResult',
      payload: {
        id: resultId,
      },
      callback: res => {
        if (res.code === 0) {
          this.getResultList();
        }
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/showModal',
      visible: false,
    });
  };

  render() {
    const {
      result,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { currentUser } = result;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '科技成果',
        href: '/proposal/',
      },
      {
        title: '成果列表',
      },
    ];
    const columns = [
      {
        title: '编号',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '成果名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '关联项目组',
        dataIndex: 'teamName',
        key: 'teamName',
      },
      {
        title: '成果摘要',
        dataIndex: 'introduction',
        key: 'introduction',
        render: text => <div className={styles.textOverflow}>{text}</div>,
      },
      {
        title: '成熟度',
        dataIndex: 'maturity',
        key: 'maturity',
        render: text => <div>{this.filterMaturity(text)}</div>,
      },
      {
        title: '添加人',
        key: 'editorName',
        dataIndex: 'editorName',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`/result/detail/${record.id}`}>查看</Link>&nbsp;&nbsp;&nbsp;&nbsp;
            {currentUser &&
              record.editorId === currentUser.id && (
                <Link to={`/result/edit/${record.id}`}>编辑&nbsp;&nbsp;&nbsp;&nbsp;</Link>
              )}
            {currentUser &&
              record.editorId === currentUser.id && (
                <a onClick={() => this.showModal(record.id)}>删除</a>
              )}
          </span>
        ),
      },
    ];

    return (
      <div>
        <Modal
          title="提示"
          visible={result.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>确定要删除吗？</p>
        </Modal>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form>
                <Row>
                  <Col span={6}>
                    <FormItem label="成果编号">
                      {getFieldDecorator('no', {})(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="small"
                          placeholder="成果编号"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="成果名称">
                      {getFieldDecorator('title', {})(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="small"
                          placeholder="成果名称"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="成熟度">
                      {getFieldDecorator('maturity', {})(
                        <Select style={{ width: 250, height: 40 }} onChange={this.handleChange}>
                          {maturityList.map(n => {
                            return (
                              <Option key={n.id} value={n.type}>
                                {n.value}
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
                          this.handleSubmit();
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
                dataSource={result.result.list}
                pagination={{
                  ...result.result.pagination,
                  showQuickJumper: true,
                }}
                onChange={pagination => {
                  this.handleSubmit({
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
