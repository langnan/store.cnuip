import React from 'react';
import { Row, Col, Form, Input, Select, Button, Table } from 'antd';
import { connect } from 'dva';
import PageHeader from '../../components/PageHeader';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ feeWarning, loading }) => ({
  feeWarning,
  loading: loading.effects['feeWarning/fetch'],
}))
@Form.create()
export default class FeeWarning extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'feeWarning/fetch',
    });
  }

  render() {
    const { loading, form, feeWarning } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '申请号',
        dataIndex: 'an',
      },
      {
        title: '专利名称',
        dataIndex: 'ti',
      },
      {
        title: '权利人',
        dataIndex: 'ob',
      },
      {
        title: '发明人',
        dataIndex: 'in',
      },
      {
        title: '年费状态',
        dataIndex: 'status',
      },
      {
        title: '缴费截止日',
        dataIndex: 'outDate',
      },
      {
        title: '预计年费金额',
        dataIndex: 'fee',
        render: text => <div>￥{text.toFixed(2)}</div>,
      },
    ];

    return (
      <div>
        <PageHeader />
        <div className={styles.queryOptions}>
          <Form>
            <Row gutter={20}>
              <Col span={6}>
                <FormItem label="申请号/专利名称">
                  {getFieldDecorator('name', {})(<Input />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="权利人">{getFieldDecorator('obligee', {})(<Input />)}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="发明人">{getFieldDecorator('inventor', {})(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="年费状态">
                  {getFieldDecorator('feeStatus', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="1">正常</Option>
                      <Option value="2">紧急</Option>
                      <Option value="3">滞纳</Option>
                      <Option value="4">过期</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Button className={styles.queryBtn}>查询</Button>
                <Button className={styles.exportBtn}>导出</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <p className={styles.tip}>
          Tips:
          因数据延时，最新缴纳的年费信息最迟会在7个工作日内显示，为此带来的不便，我们深表歉意！
        </p>
        <Table
          className={styles.patentTable}
          rowClassName={(row, index) =>
            row.status === '紧急' ? styles.detention : row.status === '滞纳' ? styles.urgent : styles.normal
          }
          rowKey="an"
          columns={columns}
          dataSource={feeWarning.data.list}
          pagination={{
            ...feeWarning.data.pagination,
            showQuickJumper: true,
          }}
          loading={loading}
        />
      </div>
    );
  }
}
