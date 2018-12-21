import React from 'react';
import { connect } from 'dva';
import { message, Input, Button, Form, Spin } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { requirementTypes, enterpriseTypes } from '../../services/info';
import PageHeader from '../../components/PageHeader';
import styles from './RequirementDetail.less';

const FormItem = Form.Item;

@connect(({ requirement, loading }) => ({
  requirement,
  loading: loading.effects['requirement/getRequirementDetail'],
  submitting: loading.effects['requirement/replyRequirement'],
}))
@Form.create()
export default class RequirementDetail extends React.Component {
  state = {
    detail: {},
  };

  componentDidMount() {
    this.getRequirementDetail();
  }

  getRequirementDetail = () => {
    const { dispatch, match } = this.props;
    const requirementId = match.params.id;
    if (requirementId) {
      dispatch({
        type: 'requirement/getRequirementDetail',
        payload: {
          id: requirementId,
        },
        callback: res => {
          if (res.code === 0) {
            this.setState({
              detail: res.result,
            });
          } else {
            message.error(`获取需求详情失败：${res.message}`);
          }
        },
      });
    }
  };

  reply = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'requirement/replyRequirement',
        payload: {
          requirementId: detail.id,
          replyContent: fieldsValue.reply,
        },
        callback: res => {
          if (res.code === 0) {
            message.success('回复发送成功', 1, () => {
              dispatch(routerRedux.push(`/info/requirement`));
            });
          } else {
            message.error(`回复发送失败：${res.message}`);
          }
        },
      });
    });
  };

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利咨讯',
      },
      {
        title: '需求管理',
        href: '/info/requirement',
      },
      {
        title: '需求详情',
      },
    ];
    const { form, submitting, loading } = this.props;
    const { getFieldDecorator } = form;
    const { detail } = this.state;
    console.log(detail);
    const requirementType = requirementTypes.find(t => t.value === detail.requirementType);
    const enterpriseType = enterpriseTypes.find(t => t.value === detail.enterpriseType);
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        {loading ? (
          <Spin size="large" className={styles.loader} />
        ) : (
          <div className={styles.main}>
            <p className={styles.title}>{detail.title}</p>
            <p className={styles.contentTitle}>需求详情：</p>
            <p className={styles.content}>{detail.content}</p>
            <div className={styles.metadata}>
              <div className={styles.left}>
                <span>
                  需求分类：{detail.classifyThree || detail.classifyTwo || detail.classifyOne}
                </span>
                <span>需求类型：{requirementType && requirementType.label}</span>
                <span>企业类别：{enterpriseType && enterpriseType.label}</span>
              </div>
              <div className={styles.right}>
                <span>需求标签：{detail.labels && detail.labels.join('，')}</span>
                <span>发布时间：{moment(detail.createdTime).format('YYYY-MM-DD')}</span>
                {/* <span>用户：{detail.username}</span> */}
              </div>
            </div>
            <div className={styles.reply}>
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
