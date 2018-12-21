import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Input, Form, Drawer, Checkbox, List, Button } from 'antd';

import styles from './UserDrawer.less';

const { Search } = Input;

@connect(({ user }) => ({
  users: user.users,
}))
@Form.create()
class UserDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { selectedUsers } = props;
    this.state = {
      selectedUsers,
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  onSearch = value => {
    this.fetchUser({
      realName: value,
    });
  };

  fetchUser = query => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      payload: query,
    });
  };

  toggleUser = (user, checked) => {
    const { selectedUsers } = this.state;
    if (checked) {
      // 增加
      this.setState({
        selectedUsers: [...selectedUsers, user],
      });
    } else {
      const userIndex = selectedUsers.indexOf(selectedUsers.find(u => u.id === user.id));
      this.setState({
        selectedUsers: [
          ...selectedUsers.slice(0, userIndex),
          ...selectedUsers.slice(userIndex + 1),
        ],
      });
    }
  };

  handleSubmit = () => {
    const { selectedUsers } = this.state;
    const { onSubmit } = this.props;
    onSubmit(selectedUsers);
  };

  render() {
    const { users, onClose, visible } = this.props;
    const { selectedUsers } = this.state;
    const { pagination } = users;
    return (
      <Drawer
        title="选择抄送人"
        width={430}
        closable
        onClose={onClose}
        visible={visible}
        destroyOnClose
      >
        <Search placeholder="输入用户名称查询" onSearch={this.onSearch} />

        <List
          className={styles.userList}
          bordered={false}
          dataSource={users.list}
          size="large"
          pagination={{
            ...pagination,
            // simple: true,
            size: 'small',
            onChange: (page, pageSize) => {
              this.fetchUser({
                pageNum: page,
                pageSize,
              });
            },
          }}
          renderItem={user => (
            <List.Item>
              <Checkbox
                className={styles.userItem}
                value={user.id}
                checked={selectedUsers.some(u => u.id === user.id)}
                onChange={e => {
                  this.toggleUser(user, e.target.checked);
                }}
              >
                <span className={styles.name}>{user.realName}</span>
                <span className={styles.phone}>{user.phone}</span>
                <span className={styles.title}>{user.title}</span>
              </Checkbox>
            </List.Item>
          )}
        />
        <div className={styles.drawerBtns}>
          <Button onClick={this.handleSubmit} className={styles.drawerBtn}>
            提交
          </Button>
        </div>
      </Drawer>
    );
  }
}

UserDrawer.propTypes = {
  selectedUsers: PropTypes.array,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

UserDrawer.defaultProps = {
  selectedUsers: [],
  visible: false,
  onClose: () => {},
  onSubmit: () => {},
};

export default UserDrawer;
