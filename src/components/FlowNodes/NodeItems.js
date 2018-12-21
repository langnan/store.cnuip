import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeItems.less';

export default class NodeItems extends React.Component {
  render() {
    const {
      value,
      node,
      metadata,
      nameForKey,
      nameForText,
      onCloseBtnClick,
      onAddItemClick,
      addBtnText,
    } = this.props;

    return (
      <ul className={styles.itemList}>
        {value &&
          value.map(item => (
            <li className={styles.item} key={item[nameForKey]}>
              {item[nameForText]}
              <a
                className={styles.closeBtn}
                onClick={() => {
                  onCloseBtnClick(item, value, metadata);
                }}
              >
                &#x2715;
              </a>
            </li>
          ))}
        <li
          className={styles.addItem}
          onClick={() => {
            onAddItemClick(node);
          }}
        >
          {addBtnText}
        </li>
      </ul>
    );
  }
}

NodeItems.propTypes = {
  // value: PropTypes.array,
  node: PropTypes.object,
  addBtnText: PropTypes.string,
  nameForKey: PropTypes.string,
  nameForText: PropTypes.string,
  metadata: PropTypes.object,
  onCloseBtnClick: PropTypes.func,
  onAddItemClick: PropTypes.func,
};

NodeItems.defaultProps = {
  // value: [],
  node: {},
  addBtnText: '+ 添加',
  nameForKey: 'departmentId',
  nameForText: 'departmentName',
  metadata: {},
  onCloseBtnClick: () => {},
  onAddItemClick: () => {},
};
