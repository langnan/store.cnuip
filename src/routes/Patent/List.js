import React from 'react';
import { Row, Col, Form, Input, Select, Button, Table } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';
import { patentTypeMap, patentStatusMap } from '../../models/patent/patentList';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ patentList, loading }) => ({
  patentList,
  loading: loading.effects['patentList/fetch'],
}))
@Form.create()
export default class List extends React.Component {
  query = {};

  componentDidMount() {
    this.queryPatents();
  }

  queryPatents = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/fetch',
      payload: {
        ...this.query,
        ...params,
      },
    });
  };

  submitQuery = e => {
    e.preventDefault();
    const { form } = this.props;
    const fieldValues = form.getFieldsValue();
    const params = {};
    for (const key in fieldValues) {
      if (fieldValues[key]) {
        params[key] = fieldValues[key];
      }
    }
    this.query = params;
    this.queryPatents(params);
  };

  render() {
    const { loading, form, patentList } = this.props;
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
        title: '专利类型',
        dataIndex: 'sectionName',
        render: (text, record, index) => {
          return patentTypeMap[text];
        },
      },
      {
        title: '权利人',
        dataIndex: 'ph',
      },
      {
        title: '发明人',
        dataIndex: 'pin',
      },
      {
        title: '专利状态',
        dataIndex: 'lastLegalStatus',
        render: (text, record, index) => {
          return <span style={{ ...patentStatusMap[text] }}>{text}</span>;
        },
      },
    ];

    return (
      <div>
        <PageHeader />
        <div className={styles.queryOptions}>
          <Form onSubmit={this.submitQuery}>
            <Row gutter={20}>
              <Col span={6}>
                <FormItem label="申请号/专利名称">
                  {getFieldDecorator('anOrTi', {})(<Input />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="权利人">{getFieldDecorator('ph', {})(<Input />)}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="发明人">{getFieldDecorator('pin', {})(<Input />)}</FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="专利类型">
                  {getFieldDecorator('sectionName', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="FMZL">发明专利</Option>
                      <Option value="WGZL">外观专利</Option>
                      <Option value="SYXX">实用新型</Option>
                      <Option value="FMSQ">发明授权</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={4}>
                <FormItem label="专利状态">
                  {getFieldDecorator('lastLegalStatus', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="在审">在审</Option>
                      <Option value="有效">有效</Option>
                      <Option value="无效">无效</Option>
                      <Option value="有效期满">有效期满 </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button htmlType="submit" type="primary" className={styles.queryBtn}>
                  查询
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          loading={loading}
          className={styles.patentTable}
          rowClassName={styles.tableRow}
          rowKey="an"
          columns={columns}
          dataSource={patentList.data.list}
          pagination={{
            ...patentList.data.pagination,
            showQuickJumper: true,
          }}
          onRow={patent => {
            const { dispatch } = this.props;
            return {
              onClick: () => {
                dispatch(routerRedux.push(`/patent/detail/${patent.an}`));
              },
            };
          }}
          onChange={pagination => {
            this.queryPatents({
              pageNum: pagination.current,
            });
          }}
        />
      </div>
    );
  }
}
