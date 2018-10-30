import React from 'react';
import Drag from './Drag';
import opt from './static';

class ImageDrag extends React.Component {
  state = {
    dragStyle: {},                    // 内存中的计算值，用作缓冲
    imgStyle: {},                     // 决定拖拽锚点的位置以及真实图片的样式
    toolBar: {},                      // 信息携带者
    dragPoint: {},
    blockStyle: {},
    markStyle: {},
    imageInfo: {},
    imgStatus: '',
    renderTool: null,
  }
  componentWillMount() {
    this.init();
  }
  componentWillUpdate(newProps) {
    if (this.props.toolBar !== newProps.toolBar) {
      this.update(newProps);
    }
  }
  init = () => {
    this.initImage();
    this.initDragPoint();
    this.initToolBar();
  }
  update = (props) => {
    this.updateToolBar(props);
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
  initDragPoint = () => {
    const { dragPoint } = this.props;
    this.setState({
      dragPoint: {
        topLeftPoint: {},
        topRightPoint: {},
        bottomLeftPoint: {},
        bottomRightPoint: {},
        style: {},
        ...dragPoint
      }
    });
  }
  initToolBar = (props) => {
    const { children, toolBar, image, renderTool } = this.props;
    let imgStatus = '';
    const _toolBar = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      isUse: true,
      isFocus: false,
      isBlock: true,
      isShow: false,
      render: null, // 支持接收一个函数，并返回一个dom元素  function() {return <Dom />}
      changeSize: this.onChangeSize,
      dragStyle: {},
      ...toolBar
    };
    if (children) {
      imgStatus = _toolBar.isBlock ? opt.BlockChildren : opt.MarkChildren;
    } else {
      imgStatus = _toolBar.isBlock ? opt.BlockImage : opt.MarkImage;
    }
    this.setState({
      toolBar: _toolBar,
      imgStatus,
      renderTool: renderTool || null
    });
  }
  updateToolBar = (props) => {
    const { children, toolBar, image } = props || this.props;
    const stateToolBar = this.state.toolBar;
    const { dragStyle } = this.state;
    const _toolBar = {
      ...stateToolBar,
      ...toolBar
    };
    const toolBarDragStyle = _toolBar.dragStyle;
    const _dragStyle = {
      ...dragStyle,
      width: _toolBar.width,
      height: _toolBar.height,
    };
    this.setState({
      toolBar: _toolBar,
      dragStyle: _dragStyle,
    });
  }
  handleStyleChange = (style) => {
    this.setState({dragStyle: style});
    if (this.props.onDragging) {
      this.props.onDragging(style);
    }
  }
  onChangeSize = (width, height) => {
    const { dragStyle, imgStyle } = this.state;
    const newSize = {
      width: width || imgStyle.width,
      height: height || imgStyle.height,
    };
    this.setState({
      dragStyle: {
        ...dragStyle,
        ...newSize
      },
      imgStyle: {
        ...imgStyle,
        ...newSize
      }
    });
    this.onModifyImageStyle(width, height);
  }
  onFocusImage = (even) => {
    const { toolBar, dragStyle, imgStyle } = this.state;
    even.preventDefault();
    if (!toolBar.isFocus) {
      this.setState({
        toolBar: {
          ...toolBar,
          isFocus: true
        }
      });
    }
    const toolInfo = {
      ...toolBar,
      width: dragStyle.width || imgStyle.width,
      height: dragStyle.height || imgStyle.height
    };
    const isShow = !toolBar.isFocus && !toolBar.isShow;
    if (isShow) {
      if (this.props.onClickImage) {
        this.props.onClickImage(toolInfo);
      }
    }
    if (this.props.onFocusImage) {
      this.props.onFocusImage(toolInfo);
    }
  }
  onBlurImage = (even) => {
    const { toolBar } = this.state;
    this.setState({
      toolBar: {
        ...toolBar,
        isFocus: false
      }
    });
    if (this.props.onBlurImage) {
      this.props.onBlurImage(toolBar);
    }
  }
  onModifyImageStyle = (width, height) => {
    // imgStyle 保留初始值
    const { imgStatus, imgStyle } = this.state;
    const style = {
      width: width || imgStyle.width,
      height: height || imgStyle.height,
    };
    switch (imgStatus) {
      case opt.BlockChildren:
      case opt.BlockImage:
        this.setState({ blockStyle: style });
        break;
      case opt.MarkChildren:
      case opt.MarkImage:
        this.setState({ markStyle: style });
        break;
      default:
        break;
    }
  }
  onDragStart = (even, style) => {
    if (this.props.onDragStart) {
      const { toolBar, dragStyle, imgStyle } = this.state;
      const toolInfo = {
        ...toolBar,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height
      };
      this.props.onDragStart(toolInfo, even, style);
    }
  }
  onDragEnd = (even, style) => {
    const { toolBar, dragStyle, imgStyle } = this.state;
    const width = dragStyle.width || imgStyle.width;
    const height = dragStyle.height || imgStyle.height;
    const toolInfo = {
      ...toolBar,
      width,
      height
    };
    this.onModifyImageStyle(width, height);
    if (this.props.onDragEnd) {
      this.props.onDragEnd(toolInfo, even, style);
    }
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
        return (<span style={blockStyle}><img style={blockStyle} src={image} attr={attr} title={title} /></span>);
      case opt.MarkImage:
        return (<span style={markStyle}><img style={markStyle} src={image} attr={attr} title={title} /></span>);
      default:
        break;
    }
  }
  renderDrag = () => {
    const { imgStyle, imgStatus, dragPoint, toolBar } = this.state;
    const { image } = this.props;
    const isShowDrag = toolBar.isUse && (toolBar.isShow || toolBar.isFocus);
    const dragProps = {
      padding: 0,
      imgStatus: imgStatus,
      bgImg: image,
      imgStyle: imgStyle,
      dragPoint: dragPoint,
      onStyleChange: this.handleStyleChange,
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd
    }
    return isShowDrag ? <Drag {...dragProps} /> : null;
  };
  renderToolBar = () => {
    const { toolBar, dragStyle, imgStyle, renderTool } = this.state;
    const isShowToolBar = toolBar.isUse && (toolBar.isShow || toolBar.isFocus);
    const toolBarStyle = { position: 'absolute', };
    if (renderTool && typeof renderTool === 'function') {
      const toolInfo = {
        ...toolBar,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height,
      };
      return renderTool(toolInfo);
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
  render() {
    const { imgStyle, toolBar, imgStatus, dragPoint } = this.state;
    const { children, width, onDragStart, onDragEnd, image, tabIndex } = this.props;
    const evenProps = {
      onClick: this.onFocusImage,
      onBlur: this.onBlurImage,
      tabIndex,
      style: {
        outline: 'none',
        position: 'relative',
        display: 'inline-block'
      }
    }
    return (
      <div {...evenProps}>
        {this.renderImage()}
        {this.renderDrag()}
        {this.renderToolBar()}
      </div>
    );
  }
}

// API
ImageDrag.defaultProps={
  tabIndex: 0,
  imgStyle: {
    width: 600,
    height: 400
  },
  dragPoint: {},
  toolBar: {},
  onClickImage: null,
  onFocusImage: null,
  onBlurImage: null,
  onDragEnd: null,
  onDragStart: null,
  onDragging: null,
  renderTool: null,
};

export default ImageDrag;
