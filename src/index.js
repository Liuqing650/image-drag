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
      sizeChange: this.onSizeChange,
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
  onSizeChange = (event) => {
    const { dragStyle, imgStyle } = this.state;
    this.setState({
      imgStyle: {
        ...imgStyle,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height,
      }
    });
    this.onModifyImageStyle();
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
    const { toolBar, dragStyle, imgStyle, renderTool } = this.state;
    const isShowToolBar = toolBar.isUse && (toolBar.isShow || toolBar.isFocus);
    if (renderTool && typeof renderTool === 'function') {
      const toolInfo = {
        ...toolBar,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height,
      };
      return renderTool(toolInfo);
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
      const onClickImage = this.props.onClickImage;
      if (onClickImage && typeof onClickImage === 'function') {
        const toolInfo = {
          ...toolBar,
          width: dragStyle.width || imgStyle.width,
          height: dragStyle.height || imgStyle.height
        };
        onClickImage(toolInfo);
      }
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
  }
  onModifyImageStyle = () => {
    const { imgStatus, dragStyle, imgStyle } = this.state;
    // 阻止首次加载时dragStyle无值，导致图片异常
    if (Object.keys(dragStyle).length === 0) {
      return;
    }
    switch (imgStatus) {
      case opt.BlockChildren:
      case opt.BlockImage:
        this.setState({
          blockStyle: {
            width: dragStyle.width || imgStyle.width,
            height: dragStyle.height || imgStyle.height,
          }
        });
        break;
      case opt.MarkChildren:
      case opt.MarkImage:
        this.setState({
          markStyle: {
            width: dragStyle.width || imgStyle.width,
            height: dragStyle.height || imgStyle.height,
          }
        });
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
    this.onModifyImageStyle();
    if (this.props.onDragEnd) {
      const { toolBar, dragStyle, imgStyle } = this.state;
      const toolInfo = {
        ...toolBar,
        width: dragStyle.width || imgStyle.width,
        height: dragStyle.height || imgStyle.height
      };
      this.props.onDragEnd(toolInfo, even, style);
    }
  }
  render() {
    const { dragStyle, imgStyle, toolBar, imgStatus, dragPoint } = this.state;
    const { children, width, onDragStart, onDragEnd, image, tabIndex } = this.props;
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
        <Drag {...dragProps} />
        {this.renderToolBar()}
      </div>
    );
  }
}

ImageDrag.defaultProps={
  tabIndex: 0,
  imgStyle: {
    width: 600,
    height: 400
  }
};

export default ImageDrag;
