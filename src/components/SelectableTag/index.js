import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';

import styles from './index.less';

export default class SelectableTag extends PureComponent {
  state = {
    selectedTags: [],
  };

  componentDidMount() {
    this.getSelectedTags();
  }

  onClick = tag => {
    const { maxSelectCount, onChange, disabled } = this.props;
    const { selectedTags } = this.state;
    if (disabled) {
      return;
    }
    let result = [];
    if (this.isTagSelected(tag.value)) {
      result = selectedTags.filter(t => t !== tag.value);
      this.updateState(result);
      return;
    }
    if (maxSelectCount === 1) {
      result = [tag.value];
      this.updateState(result);
      return;
    }
    if (selectedTags.length >= maxSelectCount) {
      return;
    }
    result = [...selectedTags, tag.value];
    this.updateState(result);
  };

  getSelectedTags = () => {
    const { value } = this.props;
    this.setState({
      selectedTags: value || [],
    });
  };

  updateState = selectedTags => {
    const { onChange } = this.props;
    this.setState(
      {
        selectedTags,
      },
      () => {
        onChange(selectedTags);
      }
    );
  };

  isTagSelected = tagValue => {
    const { selectedTags } = this.state;
    return selectedTags.some(t => t === tagValue);
  };

  render() {
    const { dataSource } = this.props;

    return (
      <div>
        <ul className={styles.tagList}>
          {dataSource &&
            dataSource.map(d => (
              <li
                key={d.value}
                onClick={() => {
                  this.onClick(d);
                }}
                className={this.isTagSelected(d.value) ? styles.selected : ''}
              >
                {d.name}
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

SelectableTag.propTypes = {
  maxSelectCount: PropTypes.number,
  onChange: PropTypes.func,
  dataSource: PropTypes.array,
  disabled: PropTypes.bool,
};

SelectableTag.defaultProps = {
  maxSelectCount: 1,
  onChange: () => {},
  dataSource: [],
  disabled: false,
};
