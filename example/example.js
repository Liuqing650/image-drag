import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';

class CustomizeExample extends Component {
  state = {
    width: 0,
    height: 0,
    isImageFocus: false,
    isFocus: false
  }
  dragStart = (toolInfo) => {
    if (!this.props.isLog) {
      return;
    }
    console.log('dragStart---->', toolInfo);
  }
  dragEnd = (toolInfo) => {
    // 更新拖拽后的数据到自定义拖拽栏下
    this.onUpdateStyle(toolInfo);
    if (!this.props.isLog) {
      return;
    }
    console.log('dragEnd---->', toolInfo);
  }
  dragging = (style) => {
    if (!this.props.isLog) {
      return;
    }
    console.log('dragging---->', style);
  }
  handleEvent = (event) => {
    event.stopPropagation();
  }
  handleFocusImage = (isImageFocus) => {
    this.setState({isImageFocus});
  }
  handleFocus = (isFocus) => {
    this.setState({isFocus});
  }
  handleBlur = (event, toolInfo) => {
    this.setState({isFocus: false});
    this.onChangeSize(toolInfo);
  }
  handleClickImage = (toolInfo) => {
    // 每次点击图片时获取焦点数据
    this.onUpdateStyle(toolInfo);
  }
  handleKeyPress = (event, toolInfo) => {
    this.handleEvent(event);
    if (event.key === 'Enter') {
      this.onChangeSize(toolInfo);
    }
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
  onChangeSize = (toolInfo) => {
    const { width, height } = this.state;
    toolInfo.changeSize(width, height);
  }
  onUpdateStyle = (toolInfo) => {
    this.setState({
      width: Number(toolInfo.width),
      height: Number(toolInfo.height),
    });
  }
  render() {
    const self = this;
    const dragRenderProps = {
      width: 600,
      image: imgSrc,
      onDragEnd: this.dragEnd,
      onDragStart: this.dragStart,
      onDragging: this.dragging,
      onClickImage: this.handleClickImage,
      onFocusImage: () => this.handleFocusImage(true),
      onBlurImage: () => this.handleFocusImage(false),
      toolBar: {
        isShow: this.state.isFocus || this.state.isImageFocus,
        isUse: this.props.isUse,
      },
      renderTool(toolInfo) {
        if (!toolInfo.isUse || !toolInfo.isShow) {
          return;
        }
        const { width, height } = self.state;
        const eventProps = {
          onBlur: (event) => self.handleBlur(event, toolInfo),
          onMouseDown: () => self.handleFocus(true),
          onClick: self.handleEvent,
          onKeyPress: (event) => self.handleKeyPress(event, toolInfo),
        };
        const widthProps = {
          ...eventProps,
          onChange: (event) => self.onInputWidthChange(event, toolInfo),
          value: width,
        };
        const heightProps = {
          ...eventProps,
          onChange: (event) => self.onInputHeightChange(event, toolInfo),
          value: height,
        };
        return (
          <div style={{position: 'absolute'}}>
            width: <span><input {...widthProps} /></span>
            height: <span><input {...heightProps} /></span>
          </div>
        );
      }
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
  onChangePoint = () => {
    const { isShow } = this.state;
    this.setState({isShow: !isShow});
  }
  onChangeToolbar = () => {
    const { isUse } = this.state;
    this.setState({isUse: !isUse});
  }
  onChangeLog = () => {
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
          <button onClick={this.onChangePoint}>{isShow ? 'HIDE' : 'SHOW'}</button>
          <button onClick={this.onChangeToolbar}>{isUse ? 'HIDE-TOOLBAR' : 'SHOW-TOOLBAR'}</button>
          <button onClick={this.onChangeLog}>{isLog ? 'HIDE-LOG' : 'SHOW-LOG'}</button>
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
