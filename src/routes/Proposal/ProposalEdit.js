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
  Tree,
  Menu,
  message,
  Dropdown,
  Cascader,
  Radio,
  Select,
  Upload
} from 'antd';
import { notification } from 'antd';
import PageHeader from '../../components/PageHeader';
import styles from './Common.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option
const { TextArea } = Input;
@connect(({ proposalList, userSetting, flow, loading }) => ({
  proposalList,
  userSetting,
  flow,
  loading: loading.effects['proposalList/fetchCurrent'],
}))
@Form.create()
export default class ProposalEdit extends React.Component {

  state = {
    teamName: ''
  }

  componentDidMount() {
    this.getProjectList();
    this.getFlowList();
  }

  // 查询项目列表
  getProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getProjectList',
      payload: {
        isDelete: 'NO',
        pageNum:1,
        pageSize:100
      },
    });
  };

  // 查询流程模板
  getFlowList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/fetchAllFlows',
      payload: {
        pageNum:1,
        pageSize:100
      },
    });
  };

  handleChange = value => {
    console.log(value);
    console.log(this.props);
    this.setState({
      teamName: value.label
    })
  }

  //submit
  onSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    this.props.form.validateFields((err, value) => {
      console.log(value);
      if (!err) {
        const reg = new RegExp("^[A-Za-z0-9]+$");
        if (!reg.test(value.no)) {
          notification.error({
            message: '提案编号仅支持英文、数字',
          });
          return;
        }
        value.teamName = this.state.teamName;
        value.teamId = value.teamId.key;
        if (value.processAttachmentList) {
          value.processAttachmentList = value.processAttachmentList.fileList.map((item) => {
            return { url: item.response[0].url }
          });
        }
        dispatch({
          type: 'proposalList/addPorposal',
          payload: value,
          callback: res => {
            if (res.message === 'success') {
              window.location.href = '/proposal/list'
            }
          },
        });
      }
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    //上传配置
    const uploadProps = {
      //  action: '//jsonplaceholder.typicode.com/posts/',
      name: 'file',
      action: '/file/upload',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
    };

    // 项目组options
    const TeamOption = data => {
      return data.map(item => {
        return <Option value={item.id}>{item.name}</Option>;
      });
    };

    // 流程模板options
    const TemplateOption = data => {
      return data.map(item => {
        return <Option value={item.id}>{item.name}</Option>;
      });
    };

    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '提案管理',
      },
      {
        title: '新增提案'
      },
    ];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList}/>
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form onSubmit={this.onSubmit}>
                <Row>
                  <Col span={12}>
                    <FormItem label='提案编号:'>
                      {
                        getFieldDecorator('no', {
                          rules: [
                            {
                              required: true,
                              message: '请输入提案编号'
                            },
                          ]
                        })
                          (
                          <Input placeholder='请输入提案编号' style={{ width: 400, height: 40 }} />
                          )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='提案名称:'>
                      {
                        getFieldDecorator('name', {
                          rules: [
                            {
                              required: true,
                              message: '请输入提案名称'
                            }
                          ]
                        })
                          (
                          <Input placeholder='请输入提案名称' style={{ width: 400, height: 40 }} />
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='申请类型'>
                      {
                        getFieldDecorator('category', {
                          rules: [
                            {
                              required: true,
                              message: '请选择申请类型'
                            }
                          ]
                        })
                          (
                          <RadioGroup>
                            <Radio value='DOMESTIC'>国内专利</Radio>
                            <Radio value='INTERNATIONAL'>国外专利</Radio>
                          </RadioGroup>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='专利类型'>
                      {
                        getFieldDecorator('patentType', {
                          rules: [
                            {
                              required: true,
                              message: '请选择专利类型'
                            }
                          ]
                        })
                          (
                          <RadioGroup>
                            <Radio value='APPEARANCE'>外观专利</Radio>
                            <Radio value='UTILITY'>实用新型专利</Radio>
                            <Radio value='INVENTION'>发明专利</Radio>
                          </RadioGroup>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem label='申请人:'>
                      {
                        getFieldDecorator('pa', {
                          rules: [
                            {
                              required: true,
                              message: '请输入申请人'
                            },
                          ]
                        })
                          (
                          <Input placeholder='如为职务发明请填写单位名称：多个以“；”隔开' style={{ width: 400, height: 40 }} />
                          )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='发明人:'>
                      {
                        getFieldDecorator('pin', {
                          rules: [
                            {
                              required: true,
                              message: '请输入发明人'
                            }
                          ]
                        })
                          (
                          <Input placeholder='多个以“；”隔开、按实际排序填写' style={{ width: 400, height: 40 }} />
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='项目来源'>
                      {
                        getFieldDecorator('source', {
                          rules: [
                            {
                              required: true,
                              message: '请选择项目来源'
                            }
                          ]
                        })
                          (
                          <RadioGroup>
                            <Radio value='SELF_MADE'>自拟课题</Radio>
                            <Radio value='PROJECT'>计划项目</Radio>
                            <Radio value='HORIZONTAL'>横向课题</Radio>
                            <Radio value='OTHER'>其他</Radio>
                          </RadioGroup>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='关联项目组'>
                      {
                        getFieldDecorator('teamId', {
                          rules: [
                            {
                              required: true,
                              message: '请选择关联项目组'
                            },
                          ],

                        })
                          (
                          <Select
                            labelInValue
                            placeholder='请选择项目组'
                            style={{ width: 400 }}
                            onChange={this.handleChange}

                          >
                            {TeamOption(this.props.userSetting.projectList)}
                          </Select>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='提案内容'>
                      {
                        getFieldDecorator('content', {
                          rules: [
                            {
                              required: true,
                              message: '请输入提案内容'
                            },
                          ],

                        })
                          (
                          <TextArea style={{ width: 980, height: 200 }} placeholder='请输入提案内容'>

                          </TextArea>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='其他信息'>
                      {
                        getFieldDecorator('remark', {
                          rules: [
                            {
                              required: false,
                            },
                          ],

                        })
                          (
                          <TextArea style={{ width: 980, height: 200 }} placeholder='请输入内容'>

                          </TextArea>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <FormItem label='选择模板'>
                      {
                        getFieldDecorator('tmplProcessId', {
                          rules: [
                            {
                              required: true,
                              message: '请选择模板'
                            },
                          ],

                        })
                          (
                          <Select
                            placeholder='请选择模板'
                            style={{ width: 400 }}
                          //onChange={this.handleChange}
                          >
                            {TemplateOption(this.props.flow.list)}
                            {/* <Option value={1}>模板1</Option>
                            <Option value={2}>模板2</Option>
                            <Option value={3}>模板3</Option> */}
                          </Select>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col >
                    <FormItem label='上传技术交流书' >
                      {
                        getFieldDecorator('processAttachmentList', {
                          //valuePropName: 'fileList',
                        })
                          (
                          <Upload {...uploadProps}>
                            <Button>
                              <Icon type="upload" /> 上传
                            </Button>
                          </Upload>
                          )
                      }
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Button type='primary' htmlType="submit">
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
