import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Select,
  Input,
  Row,
  Col,
  Button,
  DatePicker,
  Form,
  Modal,
  Table,
  Upload,
  Icon,
  message,
  notification,
} from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from './Common.less';

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

@connect(({ proposalList, loading }) => ({
  proposalList,
  loading: loading.effects['proposalList/fetchCurrent'],
}))
@Form.create()
export default class ProposalList extends React.Component {
  state = {
    visible: false,
    pId: undefined,
    s: undefined,
    upVisible: false,
    ppId: undefined,
  };

  componentDidMount() {
    this.getProposalList();
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      pId: undefined,
    });
  };

  handleUpCancel = () => {
    const { dispatch } = this.props;
    this.setState({
      upVisible: false,
      ppId: undefined,
    });
    dispatch({
      type: 'proposalList/save',
      payload: {
        files: [],
      },
    });
  };

  handleOk = () => {
    const { pId, s } = this.state;
    this.changeState(pId, s);
    this.handleCancel();
    this.setState({
      pId: undefined,
      s: undefined,
    });
  };

  handleUpOk = () => {
    const { ppId } = this.state;
    const { proposalList: { files }, dispatch } = this.props;
    if(!files.length) {
      notification.warning({
        message: '请添加申请书！',
      })
      return;
    }
    dispatch({
      type: 'proposalList/addProcessRequisition',
      payload: files,
      callback: res => {
        if(res.code === 0) {
          this.handleUpCancel();
        }
      },
    })
  };

  showModal = (id, st) => {
    this.setState({
      pId: id,
      visible: true,
      s: st,
    });
  };

  showUpModal = (id) => {
    this.setState({
      ppId: id,
      upVisible: true,
    });
  };

  getProposalList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'proposalList/getCurrentUser',
    });
    dispatch({
      type: 'proposalList/fetchCurrent',
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

  doQuery = p => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time.length) {
        fieldsValue.createdTimeFrom = moment(fieldsValue.time[0]).format('YYYY-MM-DD');
        fieldsValue.createdTimeTo = moment(fieldsValue.time[1]).format('YYYY-MM-DD');
      }
      delete fieldsValue.time;
      delete fieldsValue.file;
      dispatch({
        type: 'proposalList/fetchCurrent',
        payload: {
          ...fieldsValue,
          ...p,
        },
      });
    });
  };

  changeState = (i, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'proposalList/changeProposalState',
      payload: {
        proposal: {
          state: e,
          id: i,
        },
      },
      callback: res => {
        if (res.code === 0) {
          this.doQuery({});
        }
      },
    });
  };

  render() {
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
        title: '提案列表',
      },
    ];
    const { proposalList, loading, form, dispatch } = this.props;
    const { ppId } = this.state;
    const { currentUser, allUser, files } = proposalList;
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
        title: '专利类型',
        dataIndex: 'category',
        key: 'category',
        render: text => <div>{this.filterCategory(text)}</div>,
      },
      {
        title: '提案内容',
        key: 'content',
        dataIndex: 'content',
        render: text => <div className={styles.textOverflow}>{text}</div>,
      },
      {
        title: '进度',
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
            {record.editorId === currentUser.id &&
              (record.state === 'EXAMINING') && (
                <a
                  onClick={() => {
                    this.showModal(record.id, 'CLOSED');
                  }}
                >
                  关闭申请&nbsp;&nbsp;&nbsp;
                </a>
              )}
            <Link to={`/proposal/detail/${record.id}`}>查看</Link>
            {record.state === 'FINISHED' && currentUser.id !== 1 && <a onClick={() => {this.showUpModal(record.id)}}>&nbsp;&nbsp;&nbsp;上传申请书</a>}
          </span>
        ),
      },
    ];
    const { visible, upVisible } = this.state;
    const { getFieldDecorator } = form;
    // 上传配置
    const uploadProps = {
      name: 'file',
      action: '/file/upload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onSuccess(res) {
        res[0].id = parseInt(Math.random() * 1000, 10);
        res[0].processId = ppId;
        res[0].uid = res[0].id;
        files.push(res[0]);
        dispatch({
          type: 'proposalList/save',
          payload: {
            files,
          },
        });
      },
      onRemove(res) {
        files.forEach((ele, i) => {
          if(ele.name === res.name) {
            files.splice(i, 1);
          }
        })
        dispatch({
          type: 'proposalList/save',
          payload: {
            files,
          },
        });
      },
    };

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
                          {allUser.list.map((ele, i) => {
                            return (
                              <Option key={ele.id} value={ele.id}>
                                {ele.realName}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="提案编号">
                      {getFieldDecorator('no', {
                        initialValue: '',
                      })(
                        <Input
                          style={{ width: 250, height: 40 }}
                          size="large"
                          placeholder="请输入提案编号"
                        />
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
                </Row>
                <Row>
                  <Col span={6}>
                    <FormItem label="进度">
                      {getFieldDecorator('state', {
                        initialValue: '',
                      })(
                        <Select
                          initialValue=""
                          style={{ width: 250, height: 40 }}
                          onChange={this.handleChange}
                        >
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
                        onClick={() => this.doQuery({})}
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
                pagination={{
                  ...proposalList.result.pagination,
                  showQuickJumper: true,
                }}
                dataSource={proposalList.result.list}
                onChange={pagination => {
                  this.doQuery({
                    pageNum: pagination.current,
                  });
                }}
              />
            </div>
          </Col>
        </Row>
        <Modal title="提示" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>是否关闭该申请?</p>
        </Modal>
        <Modal title="上传申请书" visible={upVisible} onOk={this.handleUpOk} onCancel={this.handleUpCancel}>
          <Form>
            <Row>
              <Col span={24}>
                {getFieldDecorator('file', {
                  initialValue: files,
                })(
                  <Upload fileList={files} {...uploadProps}>
                    <Button>
                      <Icon type="upload" /> 上传申请书
                    </Button>
                  </Upload>
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
