import React from 'react';
import { Card, Input, Row, Col, Button, Icon, Spin, Form, Modal, Tree, Checkbox } from 'antd';
import accountIcon from '../../assets/images/system/empty.png';

import styles from './Empty.less';

export default class Empty extends React.Component {
  render() {
    const { title, onClick } = this.props;
    return (
      <Card
        bordered={false}
        style={{ paddingTop: 95, width: 900 }}
        bodyStyle={{ padding: '0 0 40px 195px' }}
      >
        <Row gutter={24}>
          <Col lg={18}>
            <div style={{ textAlign: 'center' }}>
              <img src={accountIcon} alt="新增" />
              <Button
                onClick={() => {
                  onClick();
                }}
                className={styles.buttonStyle}
                style={{ float: 'none', margin: '16px auto', display: 'block' }}
                type="primary"
              >
                新增{title}
              </Button>
              <p>
                暂无新增{title},点击上方按钮或左侧“新增部门”按钮
                <br />
                新增相应的内容
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
