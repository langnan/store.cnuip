import React from 'react';
import { Input, Form, Row, Col, DatePicker, Button } from 'antd';
import PageHeader from '../../components/PageHeader';

import RetrievalBanner from '../../assets/images/retrieval/top-bg.jpg';

import styles from './Search.less';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
export default class RetrievalSearch extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const gutter = 140;
    const colSpan = 12;

    return (
      <div className={styles.main}>
        <PageHeader className={styles.breadcrumb} />
        <div className={styles.banner}>
          <img className={styles.bannerImg} src={RetrievalBanner} alt="banner" />
          <Search
            className={styles.bannerSearch}
            placeholder="请输入公司名称、科研机构名称和产品技术关键词"
            onSearch={value => console.log(value)}
            enterButton
          />
          <div className={styles.moreOptionContainer}>
            <a className={styles.moreOptions}>更多条件搜索</a>
          </div>
        </div>
        <div className={styles.optionFormBg}>
          <div className={styles.optionFormContainer}>
            <Form className={styles.optionForm} onSubmit={this.handleSubmit}>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="法律状态">
                    {getFieldDecorator('lawStatus', {})(<Input />)}
                  </FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="国家地区">{getFieldDecorator('region', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="专利类型">{getFieldDecorator('type', {})(<Input />)}</FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="IPC分类">{getFieldDecorator('ipc', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="申请号">{getFieldDecorator('an', {})(<Input />)}</FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="申请人">{getFieldDecorator('pa', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="申请日">
                    {getFieldDecorator('lawStatus', {})(
                      <RangePicker className={styles.rangePicker} />
                    )}
                  </FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="发明人">{getFieldDecorator('pin', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="公开">{getFieldDecorator('pulic', {})(<Input />)}</FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="公告号">{getFieldDecorator('pnm', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="公开日">
                    {getFieldDecorator('pd', {})(<RangePicker className={styles.rangePicker} />)}
                  </FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="公告日">
                    {getFieldDecorator('pd', {})(<RangePicker className={styles.rangePicker} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={gutter}>
                <Col span={colSpan}>
                  <FormItem label="代理机构">{getFieldDecorator('agc', {})(<Input />)}</FormItem>
                </Col>
                <Col span={colSpan}>
                  <FormItem label="代理人">{getFieldDecorator('agt', {})(<Input />)}</FormItem>
                </Col>
              </Row>
              <FormItem style={{ textAlign: 'center', marginTop: 20 }}>
                <Button htmlType="submit" className={styles.submitBtn}>
                  搜索
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
