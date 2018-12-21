import React from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Button, Icon, Spin, Form, message, Modal } from 'antd';
import PageHeader from '../../components/PageHeader';
import SelectableTag from '../../components/SelectableTag';
import LevelDrawer from '../../components/Drawers/LevelDrawer';
import UserDrawer from '../../components/Drawers/UserDrawer';
import FlowNodes from '../../components/FlowNodes';
import NodeItems from '../../components/FlowNodes/NodeItems';
import { flowTypeMap } from '../../models/system/flow';
import styles from './Flow.less';

const { Search } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;

@connect(({ flow, loading, user }) => ({
  flow,
  loading: loading.effects['flow/fetchAllFlows'],
  submitting: loading.effects['flow/saveFlow'],
  deleting: loading.effects['flow/deleteFlow'],
  currentUser: user.currentUser,
}))
@Form.create()
export default class extends React.Component {
  newNodeKey = 0;

  state = {
    editingFlow: {}, // 被编辑的流程模版
    editingNode: {}, // 被编辑的流程节点
    levelDrawerVisible: false,
    userDrawerVisible: false,
  };

  componentDidMount() {
    this.getFlows();
  }

  /**
   * 增加模版的节点
   */
  onAddFlowNodeClick = () => {
    const { editingFlow } = this.state;
    this.newNodeKey = this.newNodeKey - 1;
    this.setState({
      editingFlow: {
        ...editingFlow,
        tmplProcessTaskList: [
          ...(editingFlow.tmplProcessTaskList || []),
          {
            key: this.newNodeKey,
          },
        ],
      },
    });
  };

  onAddNodeItemClick = node => {
    this.toggleLevelDrawer(true);
    this.setState({
      editingNode: node,
    });
  };

  /**
   * 选中审核权限和部门回调
   */
  onLevelDrawerSubmit = (originNode, editedNode) => {
    const { editingFlow, editingNode } = this.state;

    const beforeNodes = editingFlow.tmplProcessTaskList;
    let afterNodes = [];
    if (beforeNodes.some(n => n.id === editingNode.id)) {
      // 修改
      const editingNodeIndex = beforeNodes.indexOf(originNode);
      afterNodes = [
        ...beforeNodes.slice(0, editingNodeIndex),
        editedNode,
        ...beforeNodes.slice(editingNodeIndex + 1),
      ];
    } else {
      // 新增
      afterNodes = [...beforeNodes, editedNode];
    }
    this.setState({
      editingFlow: {
        ...editingFlow,
        tmplProcessTaskList: afterNodes,
      },
      editingNode: editedNode,
    });
    this.toggleLevelDrawer(false);
  };

  /**
   * 选中抄送人回调
   */
  onUserDrawerSubmit = selectedUsers => {
    const { editingFlow } = this.state;
    this.setState({
      editingFlow: {
        ...editingFlow,
        tmplProcessPersonList: selectedUsers.map(u => ({
          personId: u.id,
          personName: u.realName,
          tmplProcessId: editingFlow.id,
        })),
      },
    });
    this.toggleUserDrawer(false);
  };

  getFlows = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/fetchAllFlows',
    });
  };

  editFlow = flow => {
    const { dispatch, form } = this.props;
    form.resetFields();
    if (flow.id) {
      dispatch({
        type: 'flow/getFlowDetail',
        payload: {
          flowId: flow.id,
        },
        callback: res => {
          if (res.code === 0) {
            this.setState({
              editingFlow: {
                ...res.result,
                tmplProcessTaskList: res.result.tmplProcessTaskList.sort((a, b) => a.no - b.no),
              },
            });
          } else {
            message.error(`获取流程模版详情失败：${res.detailMessage}`);
          }
        },
      });
    } else {
      this.setState({
        editingFlow: {},
      });
    }
  };

  toggleLevelDrawer = visible => {
    const { editingFlow } = this.state;
    if (visible && !editingFlow.type) {
      message.warn('请先选择流程类型');
      return;
    }
    this.setState({
      levelDrawerVisible: visible,
    });
  };

  toggleUserDrawer = visible => {
    this.setState({
      userDrawerVisible: visible,
    });
  };

  refreshPage = () => {
    const { form } = this.props;
    this.getFlows();
    form.resetFields();
    this.setState({
      editingFlow: {},
    });
  };

  saveFlow = e => {
    e.preventDefault();
    const { form, dispatch, currentUser, flow } = this.props;
    const { editingFlow } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const { type } = fieldsValue;
      if (type.length === 1 && !type[0]) {
        message.warn('请选择流程类型');
        return;
      }
      const flowName = fieldsValue.name;
      if (!editingFlow.id && flow.list.some(f => f.name === flowName)) {
        message.warn('同名流程模版已存在，请重新命名');
        return;
      }
      if (!editingFlow.tmplProcessTaskList || editingFlow.tmplProcessTaskList.length <= 0) {
        message.warn('请至少配置一个流程节点');
        return;
      }
      const hasEmptyNodes = editingFlow.tmplProcessTaskList.some(
        n => !n.tmplProcessTaskDepartmentVoList || n.tmplProcessTaskDepartmentVoList.length <= 0
      );
      if (hasEmptyNodes) {
        message.warn('请选择流程节点中的审核权限和部门');
        return;
      }
      // if (!editingFlow.tmplProcessPersonList || editingFlow.tmplProcessPersonList.length <= 0) {
      //   message.warn('请至少配置一个抄送人');
      //   return;
      // }
      const params = {
        ...editingFlow,
        tmplProcessTaskList: editingFlow.tmplProcessTaskList.map((node, index) => ({
          ...node,
          no: index,
          name: `${flowName}-节点${index}`,
        })),
        type: fieldsValue.type[0],
        name: flowName,
        editorId: currentUser.id,
        editorName: currentUser.username,
        organizationId: currentUser.organizationId,
        tmplProcessPersonList: editingFlow.tmplProcessPersonList || [],
      };
      dispatch({
        type: 'flow/saveFlow',
        payload: params,
        callback: res => {
          if (res.code === 0) {
            message.success('流程保存成功', 1, () => {
              this.refreshPage();
            });
          } else {
            message.error(`流程保存失败：${res.message}`);
          }
        },
      });
    });
  };

  deleteFlow = () => {
    const { editingFlow } = this.state;
    const { dispatch } = this.props;

    confirm({
      title: `确认删除流程模版【${editingFlow.name}】`,
      content: `删除内容后不可恢复`,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'flow/deleteFlow',
          payload: {
            flowId: editingFlow.id,
          },
          callback: res => {
            if (res.code === 0) {
              message.success(`删除流程模版成功`, 1, () => {
                this.refreshPage();
              });
            } else {
              message.error(`删除流程模版失败：${res.message}`);
            }
          },
        });
      },
    });
  };

  searchFlow = query => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/searchFlow',
      payload: {
        query,
      },
    });
  };

  render() {
    const { flow, loading, submitting, deleting, form, currentUser } = this.props;
    const { getFieldDecorator } = form;
    const { editingFlow, editingNode, levelDrawerVisible, userDrawerVisible } = this.state;
    const selectedUsers = editingFlow.tmplProcessPersonList
      ? editingFlow.tmplProcessPersonList.map(p => ({
          id: p.personId,
          realName: p.personName,
        }))
      : [];
    const isEditing = editingFlow && editingFlow.id;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '系统管理',
        href: '/system',
      },
      {
        title: '流程设置',
      },
    ];
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    };
    console.log(editingFlow);
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <LevelDrawer
          visible={levelDrawerVisible}
          editingNode={editingNode}
          onClose={() => this.toggleLevelDrawer(false)}
          onSubmit={this.onLevelDrawerSubmit}
          onlyOneDepartment={editingFlow.type === 'NORMAL'}
        />
        <UserDrawer
          key={`${editingFlow.id}-${selectedUsers.length}`}
          visible={userDrawerVisible}
          selectedUsers={selectedUsers}
          onClose={() => this.toggleUserDrawer(false)}
          onSubmit={this.onUserDrawerSubmit}
        />
        <Row>
          <Col sm={6}>
            <div className={styles.left}>
              <div>
                <Search
                  className={styles.search}
                  placeholder="请输入流程名称查询"
                  onSearch={this.searchFlow}
                />
              </div>
              {loading && <Spin className={styles.loader} size="large" />}
              <ul className={styles.flowList}>
                {flow.searchList &&
                  flow.searchList.map(d => (
                    <div className={styles.flow} key={d.id}>
                      <span title={d.name} style={{ cursor: 'pointer' }}>
                        {d.name.length > 14 ? `${d.name.slice(0, 14)}...` : d.name}
                      </span>
                      <a
                        onClick={() => {
                          this.editFlow(d, true);
                        }}
                        className={styles.editIcon}
                      >
                        <Icon type="edit" />
                      </a>
                    </div>
                  ))}
              </ul>
              <div className={styles.leftBtns}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.editFlow({});
                  }}
                  className={styles.leftBtn}
                >
                  新增流程
                </Button>
              </div>
            </div>
          </Col>
          <Col sm={18} id="right">
            <div className={styles.right}>
              <Form onSubmit={this.saveFlow}>
                {editingFlow.id ? (
                  <FormItem {...formItemLayout} label="流程类型">
                    {getFieldDecorator('type', {
                      initialValue: editingFlow ? [editingFlow.type] : [],
                      rules: [
                        {
                          required: true,
                          message: '请选择流程类型',
                        },
                      ],
                    })(
                      <SelectableTag
                        key={editingFlow.id || Math.random()}
                        dataSource={[
                          { name: flowTypeMap[editingFlow.type], value: editingFlow.type },
                        ]}
                        disabled
                      />
                    )}
                  </FormItem>
                ) : (
                  <FormItem {...formItemLayout} label="流程类型">
                    {getFieldDecorator('type', {
                      initialValue: editingFlow ? [editingFlow.type] : [],
                      rules: [
                        {
                          required: true,
                          message: '请选择流程类型',
                        },
                      ],
                    })(
                      <SelectableTag
                        key={editingFlow.id || Math.random()}
                        dataSource={[
                          { name: '普通', value: 'NORMAL' },
                          { name: '会签', value: 'AND' },
                          { name: '或签', value: 'OR' },
                        ]}
                        onChange={value => {
                          const type = value[0];
                          if (type === 'NORMAL') {
                            this.setState(state => {
                              return {
                                editingFlow: {
                                  ...state.editingFlow,
                                  type,
                                  tmplProcessTaskList: [],
                                },
                              };
                            });
                          } else {
                            this.setState(state => {
                              return {
                                editingFlow: {
                                  ...state.editingFlow,
                                  type,
                                },
                              };
                            });
                          }
                        }}
                      />
                    )}
                  </FormItem>
                )}
                <FormItem {...formItemLayout} label="流程名称">
                  {getFieldDecorator('name', {
                    initialValue: (editingFlow && editingFlow.name) || '',
                    rules: [
                      {
                        required: true,
                        message: '请输入流程名称',
                      },
                    ],
                  })(<Input style={{ width: '360px' }} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="流程配置">
                  {getFieldDecorator('nodes', {
                    initialValue: editingFlow && editingFlow.tmplProcessTaskList,
                    valuePropName: 'nodes',
                  })(
                    <FlowNodes
                      onAddNodeClick={this.onAddFlowNodeClick}
                      onAddItemClick={this.onAddNodeItemClick}
                      onCloseBtnClick={(item, node, metadata) => {
                        this.setState(state => {
                          const { nodeIndex } = metadata;
                          const targetNode = state.editingFlow.tmplProcessTaskList[nodeIndex];
                          const updatedTargetNode = {
                            ...targetNode,
                            tmplProcessTaskDepartmentVoList: targetNode.tmplProcessTaskDepartmentVoList.filter(
                              i => i.departmentId !== item.departmentId
                            ),
                          };
                          const nodes = [...state.editingFlow.tmplProcessTaskList];
                          nodes.splice(nodeIndex, 1, updatedTargetNode);
                          return {
                            editingFlow: {
                              ...state.editingFlow,
                              tmplProcessTaskList: nodes,
                            },
                          };
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择抄送人">
                  {getFieldDecorator('nodes', {
                    initialValue: selectedUsers,
                  })(
                    <NodeItems
                      nameForKey="id"
                      nameForText="realName"
                      onAddItemClick={() => this.toggleUserDrawer(true)}
                      onCloseBtnClick={(item, node) => {
                        this.setState(state => {
                          const targetNode = state.editingFlow.tmplProcessPersonList;
                          return {
                            editingFlow: {
                              ...state.editingFlow,
                              tmplProcessPersonList: targetNode.filter(i => i.personId !== item.id),
                            },
                          };
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem>
                  <hr />
                  <Button
                    type="primary"
                    className={styles.bottomBtn}
                    htmlType="submit"
                    loading={submitting}
                  >
                    {isEditing ? '确认修改' : '确认新增'}
                  </Button>
                  {isEditing && (
                    <Button
                      type="primary"
                      className={styles.bottomBtn}
                      loading={deleting}
                      onClick={this.deleteFlow}
                    >
                      删除流程
                    </Button>
                  )}
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
