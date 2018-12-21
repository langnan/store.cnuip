import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, Form, Drawer, Checkbox, Radio } from 'antd';

import styles from './LevelDrawer.less';

const { Search } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

@connect(({ flow, user }) => ({
  levels: flow.levelSearchList,
  departments: flow.departmentSearchList,
  currentUser: user.currentUser,
}))
@Form.create()
class LevelDrawer extends React.Component {
  state = {
    childrenDrawer: false,
  };

  componentDidMount() {
    this.queryLevel();
    this.queryDepartment();
  }

  onLevelSearch = query => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/searchLevel',
      payload: {
        query,
      },
    });
  };

  onDepartmentSearch = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/searchDepartment',
      payload,
    });
  };

  queryLevel = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/getLevels',
      payload,
    });
  };

  queryDepartment = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/getDepartmentArray',
      payload,
    });
  };

  toggleChildrenDrawer = visible => {
    this.setState({
      childrenDrawer: visible,
    });
  };

  saveFlow = e => {
    e.preventDefault();
    const {
      form,
      onSubmit,
      levels,
      departments,
      editingNode,
      currentUser,
      onlyOneDepartment,
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const selectedLevel = levels.find(l => l.id === fieldsValue.level);
      let selectedDepartments;
      if (onlyOneDepartment) {
        selectedDepartments = [departments.find(d => d.id === fieldsValue.departments)];
      } else {
        selectedDepartments = departments.filter(d => fieldsValue.departments.includes(d.id));
      }
      this.toggleChildrenDrawer(false);
      const editedNode = {
        id: editingNode.id,
        key: editingNode.key,
        name: selectedLevel.name,
        editorId: currentUser.id,
        editorName: currentUser.username,
        powersId: selectedLevel.id,
        powersName: selectedLevel.name,
        tmplProcessId: editingNode.tmplProcessId,
        tmplProcessTaskDepartmentVoList: selectedDepartments.map(d => ({
          departmentId: d.id,
          departmentName: d.name,
          // tmplProcessTaskId: editingNode.id
        })),
      };
      onSubmit(editingNode, editedNode, selectedLevel, selectedDepartments);
    });
  };

  render() {
    const {
      levels,
      departments,
      editingNode,
      form,
      onClose,
      visible,
      onlyOneDepartment,
    } = this.props;
    const { childrenDrawer } = this.state;
    const { getFieldDecorator } = form;
    let departmentElements;
    let departmentInitialValue;
    if (onlyOneDepartment) {
      departmentElements = (
        <RadioGroup className={styles.levelList}>
          {departments.map(d => (
            <Radio className={styles.levelItem} key={d.id} value={d.id}>
              {d.name}
            </Radio>
          ))}
        </RadioGroup>
      );
      departmentInitialValue =
        editingNode.tmplProcessTaskDepartmentVoList &&
        editingNode.tmplProcessTaskDepartmentVoList.length > 0 &&
        editingNode.tmplProcessTaskDepartmentVoList[0].departmentId;
    } else {
      departmentElements = (
        <CheckboxGroup className={styles.levelList}>
          {departments.map(d => (
            <Checkbox className={styles.levelItem} key={d.id} value={d.id}>
              {d.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      );
      departmentInitialValue =
        editingNode.tmplProcessTaskDepartmentVoList &&
        editingNode.tmplProcessTaskDepartmentVoList.map(d => d.departmentId);
    }
    return (
      <Form onSubmit={this.saveFlow}>
        <Drawer
          title="选择审核权限"
          width={430}
          closable
          onClose={onClose}
          visible={visible}
          destroyOnClose
        >
          <Search placeholder="输入审核权限名称查询" onSearch={this.onLevelSearch} />
          <FormItem>
            {getFieldDecorator('level', {
              initialValue: editingNode.powersId,
              rules: [
                {
                  required: true,
                  message: '请选择审核权限',
                },
              ],
            })(
              <RadioGroup
                className={styles.levelList}
                onChange={e => {
                  this.queryDepartment({ powersId: e.target.value });
                }}
              >
                {levels.map(l => (
                  <Radio
                    className={styles.levelItem}
                    key={l.id}
                    value={l.id}
                    onClick={() => {
                      this.toggleChildrenDrawer(true);
                    }}
                  >
                    {l.name}
                  </Radio>
                ))}
              </RadioGroup>
            )}
          </FormItem>
          <Drawer
            title="选择部门"
            width={430}
            closable
            onClose={() => {
              this.toggleChildrenDrawer(false);
            }}
            visible={childrenDrawer}
          >
            <Search
              placeholder="输入部门名称查询"
              onSearch={value => {
                this.onDepartmentSearch({ query: value });
              }}
            />
            <FormItem className={styles.levelListContainer}>
              {getFieldDecorator('departments', {
                initialValue: departmentInitialValue,
                rules: [
                  {
                    required: true,
                    message: '请选择部门',
                  },
                ],
              })(departmentElements)}
            </FormItem>
            <div className={styles.drawerBtns}>
              <Button onClick={this.saveFlow} className={styles.drawerBtn}>
                提交
              </Button>
            </div>
          </Drawer>
        </Drawer>
      </Form>
    );
  }
}

LevelDrawer.propTypes = {
  visible: PropTypes.bool,
  editingNode: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onlyOneDepartment: PropTypes.bool,
};

LevelDrawer.defaultProps = {
  visible: false,
  editingNode: {},
  onClose: () => {},
  onSubmit: () => {},
  onlyOneDepartment: false,
};

export default LevelDrawer;
