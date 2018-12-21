import React from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Row,
  Col,
  Button,
  Icon,
  Spin,
  Form,
  Modal,
  Tree,
  Menu,
  message,
  Dropdown,
  Cascader,
  DatePicker,
  Table,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import styles from './Transaction.less';
import PageHeader from '../../components/PageHeader';
import PatentDrawer from '../../components/Drawers/PatentDrawer';
import EditableTable from '../../components/TransactionItem';
import { returnAtIndex } from 'lodash-decorators/utils';
import { notification } from 'antd';
const FormItem = Form.Item;
@connect(({ transaction, patentList, loading }) => ({
  transaction,
  patentList,
  //loading: loading.effects['post/fetchCurrentDepartment'],
}))
@Form.create()
export default class extends React.Component {
  state = {
    patentDrawerVisible: false,
    selectedPatents: [],
    patentsSubmit: [],
  };
  componentDidMount() {
    this.fetchPatent();
    console.log(this.props);
  }

  fetchPatent = query => {
    const { dispatch } = this.props;
    dispatch({
      type: 'patentList/fetch',
      payload: query,
    });
  };

  togglePatentDrawer = visible => {
    this.setState({
      patentDrawerVisible: visible,
    });
  };

  /**
   * 选中专利回调
   */
  onPatentDrawerSubmit = selectedPatents => {
    const { patentsSubmit } = this.state;
    this.setState({
      patentsSubmit: selectedPatents.map(p => {
        if (patentsSubmit.some(item => item.an === p.an)) {
          const index = patentsSubmit.indexOf(patentsSubmit.find(patent => patent.an === p.an));
          return {
            key: p.an,
            an: p.an,
            ti: p.ti,
            ph: p.ph,
            pin: p.pin,
            price: patentsSubmit[index].price,
            ad: p.ad,
            type: p.type,
            lastLegalStatus: p.lastLegalStatus,
            pa: p.pa,
            pnm: p.pnm,
            sectionName: p.sectionName,
            state: p.state,
          };
        } else {
          return {
            key: p.an,
            an: p.an,
            ti: p.ti,
            ph: p.ph,
            pin: p.pin,
            price: '',
            ad: p.ad,
            type: p.type,
            lastLegalStatus: p.lastLegalStatus,
            pa: p.pa,
            pnm: p.pnm,
            sectionName: p.sectionName,
          };
        }
      }),
    });
    this.togglePatentDrawer(false);
  };

  deletePatents = key => {
    const { patentsSubmit } = this.state;
    const patentIndex = patentsSubmit.indexOf(patentsSubmit.find(p => p.an === key));
    this.setState({
      patentsSubmit: [
        ...patentsSubmit.slice(0, patentIndex),
        ...patentsSubmit.slice(patentIndex + 1),
      ],
    });
  };

  changePrice = (an, price) => {
    const { patentsSubmit } = this.state;
    const patentIndex = patentsSubmit.indexOf(patentsSubmit.find(p => p.an === an));
    const demo = patentsSubmit;
    demo[patentIndex].price = price;
    this.setState({
      patentsSubmit: [...demo],
    });
  };

  transactionSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { patentsSubmit } = this.state;
    var pricenotnull = true;
    if (patentsSubmit.length === 0) {
      notification.error({
        message: '请选择委托专利',
      });
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      patentsSubmit.forEach(item => {
        if (item.price == '') {
          pricenotnull = false;
          return;
        }
      });
      if (!pricenotnull) {
        notification.error({
          message: '专利委托价格不能为空',
        });
      }
      if (!err && pricenotnull) {
        const params = {
          no: values.no,
          authorizePatentList: patentsSubmit,
          endTime: values.date,
        };
        // dispatch({
        //     type: 'transaction/add',
        //     payload: params,
        //     callback: res => {
        //             window.location.href='/transaction/list'
        //     },
        // });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { patentDrawerVisible, selectedPatents, patentsSubmit } = this.state;
    const { getFieldDecorator } = form;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '专利交易',
      },
      {
        title: '专利委托',
        href: '/transaction/list',
      },
      {
        title: '新增委托',
      },
    ];
    return (
      <div>
        <PageHeader breadcrumbList={breadcrumbList} />
        <PatentDrawer
          //key={`${editingFlow.id}-${selectedUsers.length}`}
          visible={patentDrawerVisible}
          selectedPatents={selectedPatents}
          onClose={() => this.togglePatentDrawer(false)}
          onSubmitPatents={this.onPatentDrawerSubmit}
        />
        <Row>
          <Col span={24}>
            <div className={styles.topSearch}>
              <Form onSubmit={this.transactionSubmit}>
                <Col>
                  <FormItem label="委托编号:">
                    {getFieldDecorator('no', {
                      rules: [
                        {
                          required: true,
                          message: '请输入委托编号',
                        },
                      ],
                    })(<Input placeholder="请输入委托编号" style={{ width: 400, height: 40 }} />)}
                  </FormItem>
                </Col>

                <Col>
                  <FormItem label="选择委托专利">
                    <Button
                      //  className={styles.buttonStyle}
                      type="primary"
                      style={{ marginLeft: 20 }}
                      onClick={() => this.togglePatentDrawer(true)}
                    >
                      添加
                    </Button>
                    {/* <Button
                                            //  className={styles.buttonStyle}
                                            //  type="primary"
                                            style={{ marginLeft: 20 }}
                                            onClick={() => window.location.href='/transaction/list'}
                                        >
                                            测试
                                    </Button> */}
                  </FormItem>
                </Col>

                <Col>
                  <EditableTable
                    patents={patentsSubmit}
                    deletePatents={this.deletePatents}
                    changePrice={this.changePrice}
                  />
                </Col>

                <Col>
                  <FormItem label="选择期限至:">
                    {getFieldDecorator('date', {
                      rules: [
                        {
                          required: true,
                          message: '请输入委托期限',
                        },
                      ],
                    })(
                      <DatePicker
                        style={{ width: 163, height: 40, background: '#f3f3fb' }}
                        size="large"
                        disabledDate={current => {
                          return current && current <= moment().endOf('day');
                        }}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col>
                  <FormItem>
                    <Button
                      className={styles.buttonStyle}
                      type="primary"
                      onClick={this.transactionSubmit}
                    >
                      提交
                    </Button>
                  </FormItem>
                </Col>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
