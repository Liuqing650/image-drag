import React from 'react';
import opt from '../static';

class ZoomModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible || false,
      width: props.width || 500,
      height: props.height || 'auto',
    };
    this.modalStyle = {
      position: 'fixed';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1024;
      width: '100%';
      height: '100vh';
      overflow: hidden;
    };
    this.modalTitleStyle = {

    }
  }
  componentDidMount() {

  }
  componentWillUnMount() {
    
  }
  renderImage = () => {
    const { imgStatus, children, image } = this.props;
    switch (imgStatus) {
      case opt.BlockChildren || opt.MarkChildren:
        return (<div>{children}</div>);
      case opt.BlockImage:
        return (<img src={image} attr={attr || ''} />);
      default:
        break;
    }
  }
  render() {
    const { visible } = this.state;
    const { image, children, imgStatus, modalTitle } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <div style={this.modalStyle}>
        <div style={this.modalTitleStyle}>
          <span>{modalTitle}</span>
          <span>close</span>
        </div>
      </div>
    );
  }
}
export default ZoomModal;
