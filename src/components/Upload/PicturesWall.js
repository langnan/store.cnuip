import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  render() {
    const { fileList, onChange, multiple, maxCount, uploadTip, format } = this.props;
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        {uploadTip || (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        )}
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action="/file/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={result => {
            const validFiles = result.fileList.filter(file => {
              const fileExt = file.name
                .split('.')
                .pop()
                .toLowerCase();
              return format.indexOf(fileExt) >= 0;
            });
            onChange(validFiles);
          }}
          beforeUpload={(file, filelist) => {
            const fileExt = file.name
              .split('.')
              .pop()
              .toLowerCase();
            if (format.indexOf(fileExt) < 0) {
              message.warn(`请选择${format.join('、')}格式的图片上传！`);
              return false;
            }
            return true;
          }}
          multiple={multiple}
          withCredentials={false}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

PicturesWall.propTypes = {
  maxCount: PropTypes.number,
  onChange: PropTypes.func,
  // fileList: PropTypes.array,
  multiple: PropTypes.bool,
  uploadTip: PropTypes.string,
  format: PropTypes.array,
};

PicturesWall.defaultProps = {
  maxCount: 1,
  onChange: () => {},
  // fileList: [],
  multiple: false,
  uploadTip: null,
  format: ['png', 'jpg', 'jpeg', 'gif'],
};

export default PicturesWall;
