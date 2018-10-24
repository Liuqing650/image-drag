import React from 'react';
import Drag from './Drag';
import opt from './static';

class ImageDrag extends React.Component {
  state = {
    dragStyle: {},
    imgStyle: {},
    toolBar: {},
    dragPoint: {},
    blockStyle: {},
    markStyle: {},
    imageInfo: {},
    imgStatus: '',
  }
  componentWillMount() {
    this.init();
  }
  init = () => {
    this.initImage();
    this.initToolBar();
    this.initDragPoint();
  }
  initImage = () => {
    const { width, height, imgStyle, attr, title } = this.props;
    const propsImageStyle = {
      ...imgStyle,
      width: width || 600,
      height: height || 400,
      zIndex: 5,
    }
    this.setState({
      imgStyle: {
        ...propsImageStyle,
      },
      blockStyle: {
        ...propsImageStyle,
        display: 'block',
      },
      markStyle: {
        ...propsImageStyle,
        display: 'inline',
      },
      imageInfo: {
        attr: attr || '',
        title: title || '',
        isFocus: false,
      }
    });
  }
  initToolBar = () => {
    const { children, toolBar, image } = this.props;
    let imgStatus = '';
    if (children) {
      imgStatus = toolBar.isBlock ? opt.BlockChildren : opt.MarkChildren;
    } else {
      imgStatus = toolBar.isBlock ? opt.BlockImage : opt.MarkImage;
    }
    this.setState({
      toolBar: {...toolBar},
      imgStatus
    });
  }
  initDragPoint = () => {
    const { dragPoint } = this.props;
    this.setState({
      dragPoint: {...dragPoint}
    });
  }
  handleStyleChange = (style) => {
    this.setState({dragStyle: style});
  }
  renderImage = () => {
    const { children, width, image } = this.props;
    const { imgStatus, imgStyle, imageInfo, blockStyle, markStyle } = this.state;
    const { attr, title } = imageInfo;
    switch (imgStatus) {
      case opt.BlockChildren:
        return (<div style={blockStyle}>{children}</div>);
      case opt.MarkChildren:
        return (<span style={markStyle}>{children}</span>);
      case opt.BlockImage:
        return (<span style={blockStyle}><img style={blockStyle} src={image} attr={attr} title={title}  /></span>);
      case opt.MarkImage:
        return (<span style={markStyle}><img style={markStyle} src={image} attr={attr} title={title} /></span>);
      default:
        break;
    }
  }
  renderToolBar = () => {
    const { toolBar, dragStyle, imgStyle } = this.state;
    const isShowToolBar = toolBar.isUse && toolBar.isFocus;
    if (toolBar.render && typeof toolBar.render === 'function') {
      const toolInfo = {
        ...toolBar,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height
      };
      return toolBar.render(toolInfo);
    }
    const toolBarStyle = {
      position: 'absolute',
    }
    if (isShowToolBar) {
      return (
        <div className={toolBar.className || ''} style={toolBarStyle}>
          width: <span>{dragStyle.width || imgStyle.width}</span>
          height: <span>{dragStyle.height || imgStyle.height}</span>
        </div>
      );
    }
  }
  onFocusImage = (even) => {
    const { toolBar } = this.state;
    even.preventDefault();
    if (!toolBar.isFocus) {
      this.setState({
        toolBar: {
          ...toolBar,
          isFocus: true
        }
      });
    } else {
      console.log('open modal...');
    }
    console.log('open isFocus...', toolBar.isFocus);
    // console.log(even.target);
    // console.log(even.target.width);
  }
  onBlurImage = (even) => {
    const { toolBar } = this.state;
    this.setState({
      toolBar: {
        ...toolBar,
        isFocus: false
      }
    });
  }
  onModifyImageStyle = () => {
    const { imgStatus, dragStyle } = this.state;
    // 阻止首次加载时dragStyle无值，导致图片异常
    if (Object.keys(dragStyle).length === 0) {
      return;
    }
    switch (imgStatus) {
      case opt.BlockChildren:
      case opt.BlockImage:
        this.setState({
          blockStyle: {
            width: dragStyle.width,
            height: dragStyle.height,
          }
        });
        break;
      case opt.MarkChildren:
      case opt.MarkImage:
        this.setState({
          markStyle: {
            width: dragStyle.width,
            height: dragStyle.height,
          }
        });
        break;
      default:
        break;
    }
  }
  onDragStart = (even, style) => {
    const { toolBar } = this.state;
    if (this.props.onDragStart) {
      this.props.onDragStart(even, style, toolBar);
    }
  }
  onDragEnd = (even, style) => {
    this.onModifyImageStyle();
  }
  render() {
    const { dragStyle, imgStyle, toolBar, imgStatus, dragPoint } = this.state;
    const { children, width, onDragStart, onDragEnd, image } = this.props;
    const margin = [5, 5];
    const dragProps = {
      padding: 0,
      margin: margin,
      imgStatus: imgStatus,
      bgImg: image,
      toolBar: toolBar,
      dragStyle: dragStyle,
      imgStyle: imgStyle,
      dragPoint: dragPoint,
      onStyleChange: this.handleStyleChange,
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd
    }
    const evenProps = {
      onClick: this.onFocusImage,
      onBlur: this.onBlurImage,
      style: {
        outline: 'none',
        position: ' ',
        display: 'inline-block'
      }
    }
    return (
      <div tabIndex="0" {...evenProps}>
        {this.renderImage()}
        <Drag {...dragProps} />
        {this.renderToolBar()}
      </div>
    );
  }
}

ImageDrag.defaultProps={
  imgStyle: {
    width: 600,
    height: 400
  },
  toolBar: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    isUse: true,
    isFocus: false,
    isBlock: true,
    render: null, // 支持接收一个函数，并返回一个dom元素  function() {return <Dom />}
  },
  dragPoint: {
    topLeftPoint: {},
    topRightPoint: {},
    bottomLeftPoint: {},
    bottomRightPoint: {},
    style: {},
  }
};

export default ImageDrag;
