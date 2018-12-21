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
} from 'antd';
import { notification } from 'antd';
import styles from './Post.less';

import PageHeader from '../../components/PageHeader';

import TreeMaker from '../../components/DepartmentTree';

const { Search } = Input;
const FormItem = Form.Item;
@connect(({ post, loading }) => ({
  post,
  loading: loading.effects['post/fetchCurrentDepartment'],
}))
@Form.create()
export default class extends React.Component {
  state = {
    visible: false,
    editDepartment: {
      name: '',
      id: '',
    }, // 岗位归属
    isEditPost: false, // 岗位编辑列表是否显示
    isSearchDepartment: false, // 部门搜索列表是否显示
    isSearchPost: false, // 岗位搜索列表是否显示
    editPost: {
      name: '',
      id: '',
    },
    isAddPost: true, // 是否处于新增岗位状态
    departmentListByQuery: [], // 部门的搜索结果
    selectDepartment: {
      name: '',
      id: '',
    }, //  选择的部门
    cascaderArr:[]
  };

  componentWillMount() { }

  componentDidMount() {
    this.getDepartmentList();
    //  this.getPostList();
  }

  // 获取部门数据
  getDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'post/fetchCurrentDepartment',
    });
  };

  // 获取岗位数据
  // getPostList = () => {
  //   const { dispatch } = this.props;
  //   const payload={
  //     parentId:'',
  //   };
  //   dispatch({
  //     type: 'post/fetchCurrentPost',
  //     payload:params,
  //   });
  // };

  // 选择树事件
  onSelect = (i, t) => {
    if (i.length > 0) {
      const { dispatch,form } = this.props;
      form.resetFields();
      const params = {
        departmentId: t.selectedNodes[0].key,
        isDelete: 'NO',
      };
      dispatch({
        type: 'post/fetchCurrentPost',
        payload: params,
      });

      this.setState({
        isEditPost: true,
        editDepartment: {
          name: t.selectedNodes[0].props.title,
          id: t.selectedNodes[0].key,
        },
        selectDepartment: {
          name: t.selectedNodes[0].props.title,
          id: t.selectedNodes[0].key,
        },
        editPost: {
          name: '',
        }
      });
      this.getDepartmentCascaderValue(this.props.post.departmentList, t.selectedNodes[0].key);
    }
  };

  onSelectDepartmentBySearch = () => {
    this.setState({
      isEditPost: true,
    });
  };

  // 部门归属
  getDepartmentCascader = (data, id) => {
    const option = [];
    data.forEach(item => {
      if (item.children) {
        option.push( {
              value: item.name,
              label: item.name,
              id: item.id,
              children: this.getDepartmentCascader(item.children, id),
            }
        );
      } else {
        option.push({
          value: item.name,
          label: item.name,
          id: item.id,
        });
      }
    });
    return option;
  };

  // 获取cascader的value
  getDepartmentCascaderValue = (tree, targets) => {
    let done = false;
    const path = [];
    console.log(tree);
    function traverse(trees, target) {
      for (let i = 0; i < trees.length; i++) {
        const node = trees[i];
        if (!done) {
          if (i > 0) {
            path.pop();
          }
          path.push(node.name);
          if (node.id == target) {
            done = true;
            return;
          } else {
            let children = node.children;
            if (children) {
              traverse(children, target);
            }
          }
        }
      }
      if (!done) {
        path.pop();
      }
      return;
    };
    traverse(tree, targets);
    this.setState({
      cascaderArr:path
    })
  };

  //  搜索部门
  searchDepartmentListByQuery = (val, trees) => {
    const options = [];
    function traverse(value, tree) {
      tree.forEach(item => {
        if (item.children) {
          traverse(value, item.children);
          if (item.name.indexOf(value) >= 0) {
            options.push({
              name: item.name,
              id: item.id,
            });
          }
        }
        if (item.name.indexOf(value) >= 0 && !item.children) {
          options.push({
            name: item.name,
            id: item.id,
          });
        }
      });
    }
    traverse(val, trees);
    if (val === '') {
      this.setState({
        departmentListByQuery: [],
      });
    } else {
      this.setState({
        departmentListByQuery: options,
      });
    }
  };

  // 搜索岗位
  searchPostListByQuery = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'post/search',
      payload: {
        query: val,
      },
    });
  };

  //  新增岗位
  addPostment = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { editDepartment, selectDepartment } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          parentId: editDepartment.id,
          departmentId: editDepartment.id,
        };
        const reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
        if (!reg.test(values.name)) {
          notification.error({
            message: '岗位名称仅支持中文、英文、数字',
          });
          return;
        }
        if (editDepartment.id === '') {
          notification.error({
            message: '请选择归属部门！',
          });
        } else {
          dispatch({
            type: 'post/addpost',
            payload: params,
            callback: res => {
              form.resetFields();
              if (res.message === 'success') {
                const parameter = {
                  departmentId: selectDepartment.id,
                  isDelete: 'NO',
                };
                dispatch({
                  type: 'post/fetchCurrentPost',
                  payload: parameter,
                });
              }
            },
          });
        }
      }
    });
  };

  //  修改岗位
  editPostment = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const {
      visible,
      editDepartment,
      isEditPost,
      isSearchDepartment,
      isSearchPost,
      editPost,
      isAddPost,
      departmentListByQuery,
      selectDepartment,
    } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          parentId: editDepartment.id,
          departmentId: editDepartment.id,
          id: editPost.id,
        };
        dispatch({
          type: 'post/editpost',
          payload: params,
          callback: res => {
            if (res.message === 'success') {
              const parameter = {
                departmentId: selectDepartment.id,
                isDelete: 'NO',
              };
              dispatch({
                type: 'post/fetchCurrentPost',
                payload: parameter,
              });
            }
          },
        });
      }
    });
  };

  // 新增部门
  addDepartment = () => {
    this.setState({
      editPost: {
        name: '',
        id: '',
      },
    });
  };

  // 提交
  doSubmit = obj => { };

  // 弹框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  //  删除岗位
  handleOk = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const {
      visible,
      editDepartment,
      isEditPost,
      isSearchDepartment,
      isSearchPost,
      editPost,
      isAddPost,
      departmentListByQuery,
      selectDepartment,
    } = this.state;
    this.setState({
      visible: false,
    });
    if(editPost.id===''){
      notification.error({
        message: '请选择要删除的岗位',
      });
      return ;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          parentId: editDepartment.id,
          isDelete: 'YES',
          departmentId: editDepartment.id,
          id: editPost.id,
        };
        dispatch({
          type: 'post/deletepost',
          payload: {
            name: values.name,
            parentId: editDepartment.id,
            isDelete: 'YES',
            departmentId: editDepartment.id,
            id: editPost.id,
          },
          callback: res => {
            const parameter = {
              departmentId: selectDepartment.id,
              isDelete: 'NO',
            };
            dispatch({
              type: 'post/fetchCurrentPost',
              payload: parameter,
            });
            this.setState({
              editPost: {
                name: '',
                id: '',
              },
            });
            this.props.form.resetFields();
          },
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { post, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      visible,
      editDepartment,
      isEditPost,
      isSearchDepartment,
      isSearchPost,
      editPost,
      isAddPost,
      departmentListByQuery,
      selectDepartment,
    } = this.state;
    const extraDepartmentContent = (
      <div>
        <Search
          placeholder="请输入部门名称进行查询"
          style={{ width: 250 }}
          onSearch={value => {
            this.searchDepartmentListByQuery(value, post.departmentList);
          }}
        />
      </div>
    );
    const extraPostContent = (
      <div>
        <Search
          placeholder="请输入岗位名称进行查询"
          style={{ width: 250 }}
          onSearch={this.searchPostListByQuery}
        />
      </div>
    );
    // 树
    const { TreeNode } = Tree;
    const RenderTreeNodes = data => {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id} icon={() => { }}>
              {RenderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} key={item.id} />;
      });
    };

    //  面包屑
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '系统管理',
        href: '/system/',
      },
      {
        title: '岗位设置',
      },
    ];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Modal title="提示" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>是否确定保存?</p>
        </Modal>
        <Row>
          {/* 是否显示post列表 */}
          <Col sm={6}>
            {!isEditPost ? (
              <Card 
                bordered={false}
                style={{ width: 290 }}
                bodyStyle={{ padding: '30px 32px 40px 32px' }}
                extra={extraDepartmentContent}
              >
                {loading && (
                  <Spin
                    style={{ margin: '0 auto', display: 'block' }}
                    size="large"
                    className={styles.loader}
                  />
                )}
                {departmentListByQuery.length > 0
                  ? departmentListByQuery.map(item => (
                    <div className={styles.postItem} key={item.id}>
                      {item.name}
                      <a onClick={this.onSelectDepartmentBySearch}>
                        <Icon type="edit" />
                      </a>
                    </div>
                  ))
                  : post.departmentList && (
                    <Tree className="departmentTree" onSelect={this.onSelect}>
                      {RenderTreeNodes(post.departmentList)}
                    </Tree>
                  )}
              </Card>
            ) : (
                <Col>
                  <Card
                    bordered={false}
                    style={{ width: 290, height: 50, borderBottom: '0px solid' }}
                    bodyStyle={{ borderBottom: 0 }}
                  >
                    <a
                      onClick={() => {
                        this.setState({
                          isEditPost: false,
                          isAddPost: true, 
                        });
                        this.getDepartmentCascaderValue(this.props.post.departmentList, 0);
                      }}
                    >
                      {' '}
                      返回
                  </a>
                  </Card>
                  <Card bordered={false} style={{ width: 290 }} extra={extraPostContent}>
                    <div className={styles.postTitle}>{selectDepartment.name}</div>
                    {post.searchPostList && post.searchPostList.length > 0 ? (
                      post.searchPostList.map(d => (
                        <div className={styles.postItem} key={d.id}>
                          {d.name}
                          <a
                            onClick={e => {
                              this.props.form.resetFields();
                              this.setState({
                                editPost: {
                                  name: d.name,
                                  id: d.id,
                                },
                                isAddPost: false,
                              });
                            }}
                          >
                            <Icon type="edit" />
                          </a>
                        </div>
                      ))
                    ) : (
                        <span onClick={() => { }}>暂无找到此项目！！！</span>
                      )}
                  </Card>
                  <Card bordered={false} style={{ width: 290 }} bodyStyle={{ marginTop: '0' }}>
                    <Button
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={() => {
                        this.props.form.resetFields();
                        this.setState({
                          isAddPost: true,
                          editPost: {
                            name: '',
                            id: '',
                          }
                        });
                        this.getDepartmentCascaderValue(this.props.post.departmentList, 0);
                      }}
                    >
                      新增岗位
                  </Button>
                    <Button
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={() => console.log(this.state)}
                      style={{ float: 'right' }}
                    >
                      导入岗位
                  </Button>
                  </Card>
                </Col>
              )}
          </Col>
          <Col sm={18}>
            {/* 新增/编辑岗位状态 */}
            {isAddPost ? (
              <Card
                bordered={false}
                style={{ paddingTop: 95, width: 900 }}
                bodyStyle={{ padding: '0 32px 40px 195px' }}
              >
                <Form onSubmit={this.addPostment}>
                  <FormItem>
                    <p>岗位名称</p>
                    {getFieldDecorator('name', {
                      initialValue: '',
                      setFieldsValue: editPost.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入岗位名称',
                        },
                      ],
                    })(<Input style={{ width: 250, height: 40 }} size="large" />)}
                  </FormItem>
                  <br />
                  <FormItem>
                    <p>岗位归属</p>
                    <Cascader
                      options={this.getDepartmentCascader(post.departmentList, editDepartment.id)}
                      value={this.state.cascaderArr}
                      placeholder="请选择部门归属"
                      expandTrigger="hover"
                      changeOnSelect
                      allowClear
                      onChange={(key, obj) => {
                        console.log('--');
                        console.log(key.length !== 0 ? obj[obj.length - 1].id : 0);
                        console.log('--');
                        this.setState({
                          editDepartment: {
                            id: key.length !== 0 ? obj[obj.length - 1].id : 0,
                          },
                        });
                        this.getDepartmentCascaderValue(this.props.post.departmentList, key.length !== 0 ? obj[obj.length - 1].id : 0);
                        console.log(this.state.editDepartment.id);
                      }}
                    />
                  </FormItem>
                  <FormItem>
                    <br />
                    <Button className={styles.buttonStyle} type="primary" htmlType="submit">
                      确认新增
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            ) : (
                <Card
                  bordered={false}
                  style={{ paddingTop: 95, width: 900 }}
                  bodyStyle={{ padding: '0 32px 40px 195px' }}
                >
                  <Form onSubmit={this.editPostment}>
                    <FormItem>
                      <p>岗位名称</p>
                      {getFieldDecorator('name', {
                        initialValue: editPost.name,
                        setFieldsValue: editPost.name,
                        rules: [
                          {
                            required: true,
                            message: '请输入岗位名称',
                          },
                        ],
                      })(<Input style={{ width: 250, height: 40 }} size="large" />)}
                    </FormItem>
                    <br />
                    <FormItem>
                      <p>岗位归属</p>
                      <Cascader
                        options={this.getDepartmentCascader(post.departmentList, editDepartment.id)}
                        placeholder="请选择部门归属"
                        value={this.state.cascaderArr}
                        expandTrigger="hover"
                        changeOnSelect
                        allowClear
                        onChange={(key, obj) => {
                          this.setState({
                            editDepartment: {
                              id: key.length !== 0 ? obj[obj.length - 1].id : 0,
                              name: key.length !== 0 ? obj[obj.length - 1].name : '',
                            },
                          });
                          this.getDepartmentCascaderValue(this.props.post.departmentList, key.length !== 0 ? obj[obj.length - 1].id : 0);
                        }}
                      />
                    </FormItem>
                    <FormItem>
                      <br />
                      <Button className={styles.buttonStyle} type="primary" htmlType="submit">
                        确认修改
                    </Button>
                      <Button
                        className={styles.buttonStyle}
                        type="primary"
                        style={{ marginLeft: 20 }}
                        onClick={this.showModal}
                      >
                        删除岗位
                    </Button>
                    </FormItem>
                  </Form>
                </Card>
              )}
          </Col>
        </Row>
      </div>
    );
  }
}
