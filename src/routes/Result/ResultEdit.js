import React from 'react';
import { routerRedux } from 'dva/router';
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
  Tree,
  Menu,
  message,
  Dropdown,
  Cascader,
  Radio,
  Select,
  Upload,
  notification,
} from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from '../Proposal/Common.less';
import PictureWall from '../../components/Upload/PicturesWall';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const maturityList = [
  {
    id: 1,
    type: 'SAMPLE',
    value: '已有样品',
  },
  {
    id: 2,
    type: 'SMALL_TEST',
    value: '通过小试',
  },
  {
    id: 3,
    type: 'PILOT_TEST',
    value: '通过中试',
  },
  {
    id: 4,
    type: 'BATCH_PRODUCTION',
    value: '可以量产',
  },
];

@connect(({ result }) => ({
  result,
}))
@Form.create()
export default class ResultEdit extends React.Component {
  componentDidMount() {
    this.getCurrentDetail();
    this.getExtraInfo();
  }

  getCurrentDetail = () => {
    const { dispatch, match, form } = this.props;
    if (match.params.id) {
      dispatch({
        type: 'result/getResultDetail',
        payload: {
          resultId: match.params.id,
        },
      });
    } else {
      dispatch({
        type: 'result/resetResult',
        payload: {
          patentResultImageList: [],
          patentResultAttachmentList: [],
        },
      });
      dispatch({
        type: 'result/resetLabel',
        payload: {
          labels: [],
        },
      });
      form.resetFields();
    }
  };

  getExtraInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/getExtraInfo',
      payload: {
        isDelete: 'NO',
      },
    });
  };

  // 确定选择成果标签
  handleAddLabel = () => {
    const {
      dispatch,
      result: { labelList, editObject },
    } = this.props;
    let hasExist = false;
    if (!editObject.labels) {
      editObject.labels = [];
    }
    editObject.labels.forEach(e => {
      if (e.id === editObject.labelId) {
        hasExist = true;
      }
    });
    if (hasExist) {
      notification.warn({
        message: '已选过该成果标签,请选择其它成果标签！',
      });
    } else {
      labelList.forEach(e => {
        e.labelValueList.forEach(item => {
          if (item.id === editObject.labelId) {
            editObject.labels.push(item);
          }
        });
      });
      dispatch({
        type: 'result/save',
        payload: {
          editObject,
        },
      });
    }
  };

  handleChangeLabel = (key, obj) => {
    const {
      dispatch,
      result: { editObject },
    } = this.props;
    if (!obj[1]) {
      editObject.label = [];
    } else {
      editObject.labelId = obj[1].id;
      editObject.label = key;
    }
    dispatch({
      type: 'result/save',
      payload: {
        editObject,
      },
    });
  };

  // 成果标签列表
  getLabelCascader = (data, id) => {
    const option = [];
    data.forEach(item => {
      if (item.labelValueList) {
        option.push({
          value: item.name,
          label: item.name,
          id: 1000 + item.id,
          children: this.getLabelCascader(item.labelValueList, id),
        });
      } else {
        option.push({
          value: item.value,
          label: item.value,
          id: item.id,
        });
      }
    });
    return option;
  };

  // submit
  onSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      result,
      result: { resultDetail },
    } = this.props;
    form.validateFields((err, value) => {
      const imgList = [];
      if (err) {
        return;
      }
      if (value.imageUrl.length > 0) {
        value.imageUrl.forEach((item, i) => {
          let img;
          if (item.response) {
            img = {
              url: item.response[0].url,
            };
          } else {
            img = {
              url: item.url,
            };
          }
          imgList.push(img);
        });
        value.patentResultImageList = imgList;
      }
      value.imageUrl = imgList[0] ? imgList[0].url : null;
      if (result.patentResultAttachmentList) {
        value.patentResultAttachmentList = result.patentResultAttachmentList;
      }
      value.id = resultDetail.id;
      value.teamId = result.teamId;
      value.labelValueList = result.editObject.labels;
      dispatch({
        type: 'result/saveResult',
        payload: {
          result: value,
        },
        callback: res => {
          if (res.code === 0) {
            dispatch(
              routerRedux.push({
                pathname: '/result/list',
              })
            );
          }
        },
      });
    });
  };

  handleChange = (i, v) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'result/save',
      payload: {
        teamId: v.key,
      },
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

  // 删除成果标签
  handleDeleteLabel = index => {
    const {
      dispatch,
      result: { editObject },
    } = this.props;
    editObject.labels.splice(index, 1);
    dispatch({
      type: 'result/save',
      payload: {
        editObject,
      },
    });
  };

  render() {
    const {
      form,
      result,
      dispatch,
      result: {
        teamList,
        labelList,
        resultDetail,
        resultDetail: { patentResultImageList, patentResultAttachmentList },
      },
    } = this.props;
    if (patentResultImageList) {
      patentResultImageList.forEach(item => {
        item.uid = item.id;
      });
    }
    if (patentResultAttachmentList.length) {
      patentResultAttachmentList.forEach(item => {
        item.uid = item.id;
        item.name = item.url.substring(item.url.lastIndexOf('/') + 1);
      });
    }
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
        patentResultAttachmentList.push(res[0]);
        result.patentResultAttachmentList = patentResultAttachmentList;
        dispatch({
          type: 'result/save',
          payload: {
            result,
          },
        });
      },
      onRemove(res) {
        const index = patentResultAttachmentList.indexOf(res);
        if (index > -1) {
          patentResultAttachmentList.splice(index, 1);
        }
        result.patentResultAttachmentList = patentResultAttachmentList;
        dispatch({
          type: 'result/save',
          payload: {
            result,
          },
        });
      },
    };

    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '科技成果',
      },
      {
        title: '新增成果',
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
                  <Col span={24}>
                    <FormItem label="成果编号:">
                      {getFieldDecorator('no', {
                        initialValue: resultDetail.no,
                        rules: [
                          {
                            required: true,
                            message: '请输入成果编号',
                          },
                          {
                            pattern: /^[A-Za-z0-9]+$/,
                            message: '成果编号是由数字或数字组成！',
                          },
                        ],
                      })(<Input placeholder="请输入成果编号" style={{ width: 400, height: 40 }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="成果名称:">
                      {getFieldDecorator('title', {
                        initialValue: resultDetail.title,
                        rules: [
                          {
                            required: true,
                            message: '请输入成果名称',
                          },
                        ],
                      })(<Input placeholder="请输入成果名称" style={{ width: 400, height: 40 }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="成熟度">
                      {getFieldDecorator('maturity', {
                        initialValue: resultDetail.maturity,
                      })(
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
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="关联项目组">
                      {getFieldDecorator('teamName', {
                        initialValue: resultDetail.teamName,
                      })(
                        <Select style={{ width: 250, height: 40 }} onChange={this.handleChange}>
                          {teamList.map(n => {
                            return (
                              <Option key={n.id} value={n.name}>
                                {n.name}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="成果图片:">
                      {getFieldDecorator('imageUrl', {
                        initialValue: patentResultImageList || [],
                        rules: [
                          {
                            required: true,
                            message: '请选择要上传的图片',
                          },
                        ],
                        valuePropName: 'fileList',
                      })(<PictureWall maxCount={5} uploadTip="上传" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="成果摘要">
                      {getFieldDecorator('introduction', {
                        initialValue: resultDetail.introduction,
                      })(
                        <TextArea
                          style={{ width: 980, height: 200 }}
                          placeholder="请输入成果摘要"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="成果内容">
                      {getFieldDecorator('content', {
                        initialValue: resultDetail.content,
                      })(
                        <TextArea
                          style={{ width: 980, height: 200 }}
                          placeholder="请输入成果内容"
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="专利情况">
                      {getFieldDecorator('patentContent', {
                        initialValue: resultDetail.patentContent,
                      })(
                        <TextArea style={{ width: 980, height: 200 }} placeholder="请输入专利情况">
                          dagaa
                        </TextArea>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="上传附件" style={{ width: 980 }}>
                      {getFieldDecorator('file', {
                        initialValue: patentResultAttachmentList,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Upload fileList={patentResultAttachmentList} {...uploadProps}>
                          <Button>
                            <Icon type="upload" /> 上传文件
                          </Button>
                        </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <FormItem label="成果标签:">
                      <Cascader
                        style={{ width: 250, height: 40 }}
                        options={this.getLabelCascader(labelList, result.editObject.labelId)}
                        placeholder="请选择成果标签"
                        value={result.editObject.label}
                        expandTrigger="hover"
                        changeOnSelect
                        allowClear
                        onChange={(key, obj) => {
                          this.handleChangeLabel(key, obj);
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={this.handleAddLabel}
                      style={{
                        width: 59,
                        height: 40,
                        backgroundColor: '#f3f3fb',
                        fontSize: 25,
                        marginTop: 39,
                      }}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
                <Row span={24}>
                  <FormItem label="已添加成果标签:">
                    {result.editObject &&
                      result.editObject.labels &&
                      result.editObject.labels.map((e, i) => {
                        return (
                          <Col key={e.id} span={4}>
                            <div className={styles.renderLabels}>
                              {e.value}
                              <a
                                onClick={() => {
                                  this.handleDeleteLabel(i);
                                }}
                              >
                                <Icon type="close" style={{ fontSize: 14 }} />
                              </a>
                            </div>
                          </Col>
                        );
                      })}
                  </FormItem>
                </Row>
                <Row>
                  <Col span={24}>
                    <Button type="primary" onClick={this.onSubmit}>
                      提交
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
