import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Input, Form, Drawer, Checkbox, List, Button } from 'antd';

import styles from './PatentDrawer.less';

const { Search } = Input;

@connect(({ user, patentList }) => ({
  users: user.users, patentList

}))
@Form.create()
class PatentDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { selectedPatents, patentList } = props;
    this.state = {
      selectedPatents,
      patentList
    };
  }

  componentDidMount() {
    this.fetchPatent();
  }

  onSearch = value => {
    this.fetchPatent({
      anOrTi: value,
    });
  };


  fetchPatent = query => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/fetchUseful',
      payload: query,

    });
  };

  togglePatents = (patent, checked) => {
    const { selectedPatents } = this.state;
    if (checked) {
      // 增加
      this.setState({
        selectedPatents: [...selectedPatents, patent],
      });
    } else {
      const patentIndex = selectedPatents.indexOf(selectedPatents.find(p => p.an === patent.an));
      this.setState({
        selectedPatents: [
          ...selectedPatents.slice(0, patentIndex),
          ...selectedPatents.slice(patentIndex + 1),
        ],
      });
    }
  };

  handleSubmit = () => {
    const { selectedPatents } = this.state;
    const { onSubmitPatents } = this.props;
    onSubmitPatents(selectedPatents);
  };

  render() {
    const { users, onClose, visible, patentList } = this.props;
    const { selectedPatents } = this.state;
    //const { pagination } = patentList;
    return (
      <Drawer
        title="选择委托专利"
        width={500}
        closable
        onClose={onClose}
        visible={visible}
        destroyOnClose
      >
        <Search placeholder="输入申请号或者专利名称查询" onSearch={this.onSearch} />

        <List
          className={styles.patentList}
          //bordered={false}
          dataSource={patentList.usefulPatents.list}
          size="large"
          pagination={{
            ...patentList.usefulPatents.pagination,
            onChange: (page, pageSize) => {
              this.fetchPatent({
                pageNum: page,
                pageSize: pageSize,
              });
            },
          }}
          renderItem={item => (
            <List.Item>
              <Checkbox
                className={styles.userItem}
                value={item.an}
                checked={selectedPatents.some(p => p.an === item.an)}
                onChange={e => {
                  this.togglePatents(item, e.target.checked);
                }}
              >
                <span className={styles.name}>{item.ti}</span>
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

PatentDrawer.propTypes = {
  selectedPatents: PropTypes.array,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmitPatents: PropTypes.func,
};

PatentDrawer.defaultProps = {
  selectedPatents: [],
  visible: false,
  onClose: () => { },
  onSubmitPatents: () => { },
};

export default PatentDrawer;

//fetchUseful