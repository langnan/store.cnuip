import React from 'react';
import { connect } from 'dva';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, Tree, Menu, message, Dropdown, Cascader } from 'antd';
import styles from './Department.less';
import PageHeader from '../../components/PageHeader'
import { notification } from 'antd';
const { Search } = Input;
const FormItem = Form.Item;
@connect(({ department, loading }) => ({
  department,
  loading: loading.effects['department/fetchCurrent']
}))

@Form.create()
export default class extends React.Component {

  componentDidMount() {
    this.getDepartmentList();
  }

  componentWillMount() {

  }

  //  获取数据
  getDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchCurrent'
    })
  }

  //  提交
  // doSubmit = obj => {
  //   console.log('提交');
  // }



  state = {
    editDepartmentId: 0,
    visible: false,
    editDepartment: {
      name: '',
      id: ''
    },//  编辑的部门
    isSearchDepartment: false, // 部门搜索列表是否显示
    isAddDepartment: true,
    selectDepartment: '',// 部门归属
    departmentListByQuery: [],
    cascaderArr:[]
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { editDepartmentId, visible, editDepartment, isAddDepartment, selectDepartment } = this.state;
    this.setState({
      visible: false,
    });
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          isDelete: 'YES',
          parentId: selectDepartment,
          id: editDepartment.id
        }
        dispatch({
          type: 'department/deleteDepartment',
          payload: params,
          callback: (res) => {
            if (JSON.parse(res).message==='success') {
              dispatch({
                type: 'department/fetchCurrent'
              })
            } 
          }
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  edit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { editDepartmentId, visible, editDepartment, isAddDepartment, selectDepartment } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
      if (!reg.test(values.name)) {
        notification.error({
          message: '岗位名称仅支持中文、英文、数字',
        });
        return;
      }
      if (!err) {
        if (isAddDepartment) {
          console.log('selectDepartment');
          console.log(selectDepartment);
          if(selectDepartment===''){
            notification.error({
              message: '未设置归属部门',
            });
            return;
          }
          const params = {
            name: values.name,
            isDelete: 'NO',
            parentId: selectDepartment,
          }
          dispatch({
            type: 'department/addDepartment',
            payload: params,
            callback: (res) => {
              if (res.message === 'success') {
                form.resetFields();
                dispatch({
                  type: 'department/fetchCurrent'
                })
              } 
            }
          })
        } else {
          const params = {
            name: values.name,
            isDelete: 'NO',
            parentId: selectDepartment,
            id: editDepartment.id
          }
          dispatch({
            type: 'department/editDepartment',
            payload: params,
            callback: (res) => {
              if (res.message === 'success') {
                dispatch({
                  type: 'department/fetchCurrent'
                })
              } 
            }
          })
        }
      }
    })

  }

    //获取cascader的value
    getDepartmentCascaderValue=(tree, target)=> {
      var done = false;
      var path = [];
      var parentArr=[];
      function traverse(tree, target) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (!done) {
            if (i > 0) {
              path.pop();
              parentArr.pop();
            }
            path.push(node.name);
            parentArr.push(node.id);
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
          parentArr.pop();
        }
        return;
      };
      traverse(tree, target);
      this.setState({
        selectDepartment:parentArr[parentArr.length-1],
        cascaderArr:path
      })
      //return path;
    };

    //获取cascader父级的value
    getParentDepartmentCascaderValue=(tree, target)=> {
      var done = false;
      var path = [];
      var parentArr=[];
      function traverse(tree, target) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (!done) {
            if (i > 0) {
              path.pop();
              parentArr.pop();
            }
            path.push(node.name);
            parentArr.push(node.id);
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
          parentArr.pop();
        }
        return;
      };
      traverse(tree, target);
      if(path.length==1){
        this.setState({
          selectDepartment:'',
          cascaderArr:path
        })
      }else{
        path.pop();
        parentArr.pop();
        this.setState({
          selectDepartment:parentArr[parentArr.length-1],
          cascaderArr:path
        })
      }

      //return path;
    };

    //  点击搜索结果事件
    selectDepartmentSearch=(id,name)=>{
      this.setState({
        editDepartmentId: id,
        editDepartment: {
          name: name,
          id: id
        },
        isAddDepartment: false,
      })
      this.getParentDepartmentCascaderValue(this.props.department.list, id)
    }

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

    //  部门归属
     getDepartmentCascader = (data, id) => {
      const option = [];
      data.map((item) => {
        if (item.children) {
          option.push(item.id === id ? {
            value: item.name,
            label: item.name,
            disabled: item.id === id ? true : false,
            id: item.id,
          } : {
              value: item.name,
              label: item.name,
              disabled: item.id === id ? true : false,
              id: item.id,
              children: this.getDepartmentCascader(item.children, id)
            })
        } else {
          option.push({
            value: item.name,
            label: item.name,
            disabled: item.id === id ? true : false,
            id: item.id
          })
        }
      });
      return option;
    }


  render() {
    const { department, loading } = this.props;
    const { getFieldDecorator } = this.props.form;//?
    const { editDepartmentId, visible, editDepartment, isAddDepartment, selectDepartment ,departmentListByQuery} = this.state
    const extraContent = (
      <div>
        <Search placeholder='请输入部门名称进行查询' style={{ width: 250 }} onSearch={value => {
          this.searchDepartmentListByQuery(value, department.list);
        }} />
      </div>
    )
    //  树
    var TreeNode = Tree.TreeNode;
    const RenderTreeNodes = function (data) {
      console.log(data);
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.name.length>10?item.name.slice(0,10):item.name} key={item.id} icon={() => { }}>
              {RenderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name.length>15?item.name.slice(0,10)+'...':item.name} key={item.id} />
      });
    }



    //选择树事件
    const onSelect = (i, t) => {
      const { form, dispatch } = this.props;
      form.resetFields();
      if (i.length > 0) {
        console.log(t.selectedNodes[0].props.title);
        this.setState({
          editDepartmentId: t.selectedNodes[0].key,
          editDepartment: {
            name: t.selectedNodes[0].props.title,
            id: t.selectedNodes[0].key
          },
          isAddDepartment: false,
          selectDepartment: t.selectedNodes[0].key
        })
        this.getParentDepartmentCascaderValue(this.props.department.list, t.selectedNodes[0].key)
      }

    }

    //  新增部门
    const addDepartment = () => {
      const { form } = this.props;
      form.resetFields();
      this.setState({
        editDepartment: {
          name: '',
          id: ''
        },
        isAddDepartment: true,
        cascaderArr:[this.props.department.list[0].name],
        selectDepartment:0
      })
      this.getDepartmentCascader(this.props.department.list, editDepartment.id);
    }


    //面包屑
    const breadcrumbList = [{
      title: '首页',
      href: '/'
    }, {
      title: '系统管理',
      href: '/system/'
    }, {
      title: '部门设置',
    }];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <Modal title="提示"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>是否确定保存?</p>
        </Modal>
        <Row>
          <Col sm={6}>
              <Card
              bordered={false}
              style={{ width: 290 }}
              bodyStyle={{ padding: '30px 32px 40px 32px' }}
              extra={extraContent}
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
                    <a onClick={()=>{this.selectDepartmentSearch(item.id,item.name)}}>
                      <Icon type="edit" />
                    </a>
                  </div>
                ))
                : this.props.department.list && <Tree
                  className='departmentTree'
                  onSelect={onSelect}
                >
                  {RenderTreeNodes(this.props.department.list)}
                </Tree>}
            </Card>
            <Card bordered={false} style={{ width: 290 }} bodyStyle={{ marginTop: '0' }}>
              <Button
                className={styles.buttonStyle}
                type='primary'
                onClick={addDepartment}
              >
                新增部门
              </Button>
              <Button
                className={styles.buttonStyle}
                type='primary'
                onClick={() => console.log(this.props.department.list)}
                style={{ float: 'right' }}
              >
                导入部门
              </Button>
            </Card>
          </Col>
          <Col sm={18}>
            <Card
              bordered={false}
              style={{ paddingTop: 95, width: 900 }}
              bodyStyle={{ padding: '0 32px 40px 195px' }}
            >
              <Form onSubmit={this.edit}>
                <FormItem >
                  <p>部门名称</p>
                  {getFieldDecorator('name', {
                    initialValue: editDepartment.name,
                    value:editDepartment.name,
                    rules: [{
                      required: true, message: '请输入部门名称',
                    }],
                  })(
                    <Input
                      style={{ width: 250, height: 40 }}
                      size="large"
                    />,
                  )}

                </FormItem>
                <br />
                <FormItem >
                  <p>部门归属</p>
                  <Cascader
                    options={this.getDepartmentCascader(this.props.department.list, editDepartment.id)}
                    placeholder="请选择部门归属"
                    value={this.state.cascaderArr}
                    expandTrigger='hover'
                    changeOnSelect={true}
                    allowClear={true}
                    onChange={(key, obj) => {
                      this.setState({
                        editDepartmentId: key.length != 0 ? obj[obj.length - 1].id : '',
                        selectDepartment: key.length != 0 ? obj[obj.length - 1].id : ''
                      })
                      this.getDepartmentCascaderValue(this.props.department.list, key.length != 0 ? obj[obj.length - 1].id : '')
                    }
                    }

                  />
                </FormItem>
                <FormItem >
                  <br />
                  <Button
                    className={styles.buttonStyle}
                    type='primary'
                    //  onClick={this.showModal}
                    htmlType="submit"
                  >
                    {isAddDepartment ? '新增部门' : '修改部门'}
                  </Button>
                  {
                    !isAddDepartment ? <Button
                      className={styles.buttonStyle}
                      type='primary'
                      onClick={() => { }}
                      style={{ marginLeft: 20 }}
                      onClick={this.showModal}
                    >
                      删除部门
          </Button> : ''
                  }

                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
//{item.name.length>10?item.name.slice(0,10):item.name}