import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class MyCheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      checkedList: value,
      indeterminate: true,
      checkAll: false,
    };
  }

  onChange = checkedList => {
    const { options, onChange } = this.props;
    const indeterminate = !!checkedList.length && checkedList.length < options.length;
    const checkAll = checkedList.length === options.length;
    this.setState(
      {
        checkedList,
        indeterminate,
        checkAll,
      },
      () => {
        const result = {
          checkAll,
          checkedList,
        };
        console.log(result);
        onChange(result);
      }
    );
  };

  onCheckAllChange = e => {
    const { checked } = e.target;
    const { options, onChange } = this.props;
    const checkedList = checked ? options.map(o => o.value) : [];
    this.setState(
      {
        checkedList,
        indeterminate: false,
        checkAll: checked,
      },
      () => {
        const result = {
          checkAll: checked,
          checkedList,
        };
        console.log(result);
        onChange(result);
      }
    );
  };

  render() {
    const { checkedList, indeterminate, checkAll } = this.state;
    const { options } = this.props;

    return (
      <div>
        <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
          {`全部（${options.length}）`}
        </Checkbox>
        <CheckboxGroup options={options} value={checkedList} onChange={this.onChange} />
      </div>
    );
  }
}

MyCheckboxGroup.propTypes = {
  options: PropTypes.array,
  // value: PropTypes.array,
  onChange: PropTypes.func,
};

MyCheckboxGroup.defaultProps = {
  options: [],
  // value: [],
  onChange: () => {},
};
