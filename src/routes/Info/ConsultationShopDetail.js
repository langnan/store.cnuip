import React from 'react';
import { message, Button, Input, Form, List, Radio, Tabs, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeader from '../../components/PageHeader';
import { replyTypes } from '../../services/info';
import styles from './ConsultaionDetail.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const breadcumbInit = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '专利资讯',
    href: '/',
  },
  {
    title: '企业咨询',
  },
];
@connect(({ consultation, user, loading }) => ({
  consultation,
  user,
  // loading: loading.effects['requirement/getConsultationDetail'],
  submitting: loading.effects['requirement/replyShop'],
}))
@Form.create({})
export default class Consultation extends React.Component {
  state = {
    tabKey: 1,
    breadcrumbList: [...breadcumbInit, { title: '店铺咨询' }, { title: '咨询详情' }],
    detail: {},
  };

  componentDidMount() {
    const { location } = this.props;
    this.setState({
      detail: location.state.state,
    });
  }

  reply = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'consultation/replyShop',
        payload: {
          shopCommentId: detail.id,
          replyContent: fieldsValue.reply,
        },
        callback: res => {
          if (res.code === 0) {
            message.success('回复发送成功', 1, () => {
              dispatch(routerRedux.push(`/info/consultation`));
            });
          } else {
            message.error(`回复发送失败：${res.message}`);
          }
        },
      });
    });
  };

  render() {
    const { breadcrumbList, tabKey, detail } = this.state;
    const { form, submitting, loading, user, consultation } = this.props;
    const { getFieldDecorator } = form;
    const { username } = user.currentUser;
    return (
      <div>
        <PageHeader tabActiveKey={tabKey} breadcrumbList={breadcrumbList} />
        {loading ? (
          <Spin size="large" className={styles.loader} />
        ) : (
          <div className={styles.main}>
            <div className={styles.content}>
              <p>{detail.reviewContent}</p>
            </div>
            <div className={styles.left}>
              <span>发布时间：{moment(detail.createdTime).format('YYYY-MM-DD')}</span>
            </div>
            <div className={styles.showReply}>
              {detail.replyContent ? (
                <p className={styles.replyContent}>回复：{detail.replyContent}</p>
              ) : (
                <Form onSubmit={this.reply}>
                  <FormItem>
                    {getFieldDecorator('reply', {
                      rules: [
                        {
                          required: true,
                          message: '请输入回复内容',
                        },
                      ],
                    })(
                      <Input.TextArea
                        className={styles.textArea}
                        autosize={{ minRows: 8, maxRows: 16 }}
                      />
                    )}
                  </FormItem>
                  <FormItem style={{ textAlign: 'center' }}>
                    <Button
                      className={styles.replyBtn}
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                    >
                      回复
                    </Button>
                  </FormItem>
                </Form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
