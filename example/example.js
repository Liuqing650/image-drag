import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';

export default class Example extends Component {
  state = {
    style: {},
    isShow: false,
    isUse: true,
    isLog: false,
    width: 0,
    height: 0
  }
  dragStart = (toolInfo) => {
    if (!this.state.isLog) {
      return;
    }
    console.log('dragStart---->', toolInfo);
  }
  dragEnd = (toolInfo) => {
    if (!this.state.isLog) {
      return;
    }
    console.log('dragEnd---->', toolInfo);
  }
  dragging = (style) => {
    if (!this.state.isLog) {
      return;
    }
    console.log('dragging---->', style);
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
  render() {
    const { isShow, isUse, isLog, } = this.state;
    const self = this;
    const dragRenderProps = {
      width: 600,
      image: imgSrc,
      onDragEnd: this.dragEnd,
      onDragStart: this.dragStart,
      onDragging: this.dragging,
      toolBar: {
        isShow,
        isUse,
      },
      renderTool(toolInfo) {
        if (!toolInfo.isUse || !toolInfo.isShow) {
          return;
        }
        const { width, height } = self.state;
        return (
          <div style={{position: 'absolute'}}>
            width: <span><input onChange={self.onInputWidthChange} value={width} /></span>
            height: <span><input onChange={self.onInputHeightChange} value={height} /></span>
            <button onClick={() => self.onChangeSize(toolInfo)}>修改尺寸</button>
          </div>
        );
      },
      reload(info, status) {
        console.log('info---->', info, status);
      }
    }
    const dragProps = {
      width: 600,
      image: imgSrc,
      onDragEnd: this.onDragEnd,
      toolBar: {
        isShow,
        isUse
      }
    }
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
          <h1>子元素</h1>
          <ImageDrag {...dragRenderProps}>
            <img style={{
                width: '100%',
                height: '100%'
              }}
              src={imgSrc}
            />
          </ImageDrag>
          <h1>无子元素</h1>
          <ImageDrag {...dragProps} />
          <div style={{height: 300}} />
        </div>
      </div>
    );
  }
}
