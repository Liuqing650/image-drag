import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';

class InputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height
    };
    this.timeIndex = 0;
  }
  componentWillReceiveProps(newProps) {
    if (newProps !== this.props) {
      this.setState({
        width: newProps.width,
        height: newProps.height
      });
    }
  }
  componentWillUnmount = () => {
    clearTimeout(this.timeIndex);
  }
  onInputWidthChange = (event) => {
    if (!isNaN(Number(event.target.value))) {
      this.setState({
        width: Number(event.target.value)
      });
    }
  }
  onInputHeightChange = (event) => {
    if (!isNaN(Number(event.target.value))) {
      this.setState({
        height: Number(event.target.value)
      });
    }
  }
  handleEvent = (event) => {
    event.stopPropagation();
  }
  handleUpdate = () => {
    const {width, height} = this.state;
    if (this.props.onChangeSize) {
      this.props.onChangeSize(width, height);
    }
  }
  handleFocus = (event) => {
    this.isFocus = true;
    this.timeIndex = setTimeout(() => {
      this.isFocus = false;
    }, 0);
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }
  handleBlur = (event) => {
    this.handleUpdate();
    if (!this.isFocus) {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  }
  handleKeyPress = (event) => {
    this.handleEvent(event);
    if (event.key === 'Enter') {
      this.handleUpdate();
    }
  }
  render() {
    const { width, height } = this.state;
    const eventProps = {
      onBlur: this.handleBlur,
      onMouseDown: this.handleFocus,
      onClick: this.handleEvent,
      onKeyPress: this.handleKeyPress,
    };
    const widthProps = {
      ...eventProps,
      onChange: this.onInputWidthChange,
      value: width,
    };
    const heightProps = {
      ...eventProps,
      onChange: this.onInputHeightChange,
      value: height,
    };
    return (
      <div contentEditable={false} style={{position: 'absolute'}}>
        width: <span><input {...widthProps} type="text" /></span>
        height: <span><input {...heightProps} /></span>
      </div>
    );
  }
}

// 复杂示例
class CustomizeExample extends Component {
  state = {
    width: 0,
    height: 0,
    isImageFocus: false,
    isFocus: false,
    isSelected: false,
  }
  dragStart = (toolInfo) => {
    if (this.props.isLog) {
      console.log('dragStart---->', toolInfo);
    }
  }
  dragEnd = (toolInfo) => {
    // 更新拖拽后的数据到自定义拖拽栏下
    if (this.props.isLog) {
      console.log('dragEnd---->', toolInfo);
    }
    this.setState({
      width: Number(toolInfo.width),
      height: Number(toolInfo.height),
    });
  }
  dragging = (toolInfo) => {
    if (this.props.isLog) {
      console.log('dragging---->', toolInfo);
    }
    this.setState({
      width: Number(toolInfo.width),
      height: Number(toolInfo.height),
    });
  }
  handleEvent = (event) => {
    event.stopPropagation();
  }
  handleFocus = () => {
    this.setState({isFocus: true});
  }
  handleBlur = () => {
    this.setState({isFocus: false});
  }
  changeSize = (width, height, toolInfo) => {
    toolInfo.changeSize(width, height);
    this.setState({
      width,
      height,
    });
  }
  handleClickImage = (toolInfo) => {
    const { width, height } = this.state;
    if (width === 0 && height === 0) {
      this.setState({
        width: Number(toolInfo.width),
        height: Number(toolInfo.height),
      });
    }
  }
  renderToolBar = (toolInfo) => {
    if (!toolInfo.isUse || !toolInfo.isShow) {
      return;
    }
    const { width, height } = this.state;
    const toolBarProps = {
      width,
      height,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onChangeSize: (width, height) => this.changeSize(width, height, toolInfo),
    };
    return (<InputBar {...toolBarProps} />);
  };
  render() {
    const dragRenderProps = {
      width: 600,
      image: imgSrc,
      tabIndex: 'false',
      onDragEnd: this.dragEnd,
      onDragStart: this.dragStart,
      onDragging: this.dragging,
      onClickImage: this.handleClickImage,
      onFocusImage: this.handleFocus,
      onBlurImage: this.handleBlur,
      toolBar: {
        isShow: this.state.isFocus,
        isUse: this.props.isUse,
      },
      renderTool: this.renderToolBar
    }
    return (
      <ImageDrag {...dragRenderProps}>
        <img style={{
            width: '100%',
            height: '100%'
          }}
          src={imgSrc}
        />
      </ImageDrag>
    )
  }
}

// 简单示例
class SimpleExample extends Component {
  render() {
    const dragProps = {
      width: 600,
      image: imgSrc,
      toolBar: {
        isShow: this.props.isShow,
        isUse: this.props.isUse
      }
    };
    return <ImageDrag {...dragProps} />;
  }
}

export default class Example extends Component {
  state = {
    isShow: true,
    isUse: true,
    isLog: false
  }
  handlePoint = () => {
    const { isShow } = this.state;
    this.setState({isShow: !isShow});
  }
  handleToolbar = () => {
    const { isUse } = this.state;
    this.setState({isUse: !isUse});
  }
  handleLog = () => {
    const { isLog } = this.state;
    this.setState({isLog: !isLog});
  }
  render() {
    const { isShow, isUse, isLog, } = this.state;
    const wrapStyle = {
      width: 1200,
      height: 800,
      margin: '20px auto'
    }
    return (
      <div>
        <div style={wrapStyle}>
          <button onClick={this.handlePoint}>{isShow ? 'HIDE' : 'SHOW'}</button>
          <button onClick={this.handleToolbar}>{isUse ? 'HIDE-TOOLBAR' : 'SHOW-TOOLBAR'}</button>
          <button onClick={this.handleLog}>{isLog ? 'HIDE-LOG' : 'SHOW-LOG'}</button>
          <h1>自定义示例-含子元素</h1>
          <CustomizeExample isUse={isUse} isLog={isLog} />
          <h1>简单示例-不含子元素</h1>
          <SimpleExample isShow={isShow} isUse={isUse} />
          <div style={{height: 300}} />
        </div>
      </div>
    );
  }
}
