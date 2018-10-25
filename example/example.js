import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';

export default class Example extends Component {
  state = {
    style: {},
    isShow: false,
    isUse: true,
    toolBar: {}
  }
  dragStart = (style) => {
    this.setState({
      style,
      dragEnd: false,
      dragStart: true,
    });
  }
  onDragEnd = (style) => {
    this.setState({
      style,
      dragEnd: true,
      dragStart: false,
    });
  }
  onChangePoint = () => {
    const { isShow } = this.state;
    this.setState({isShow: !isShow});
  }
  onChangeToolbar = () => {
    const { isUse } = this.state;
    this.setState({isUse: !isUse});
  }
  onInputWidthChange = (event) => {
    const { toolBar } = this.state;
    toolBar.width = isNaN(Number(event.target.value)) ? dragStyle.width : Number(event.target.value);
    this.setState({
      toolBar
    });
  }
  onInputHeightChange = (event) => {
    const { toolBar } = this.state;
    toolBar.height = isNaN(Number(event.target.value)) ? dragStyle.width : Number(event.target.value);
    this.setState({
      toolBar
    });
  }
  render() {
    const { isShow, isUse, toolBar } = this.state;
    const self = this;
    const dragRenderProps = {
      width: 600,
      image: imgSrc,
      onDragEnd: this.onDragEnd,
      toolBar: {
        ...toolBar,
        isShow,
        isUse,
      },
      renderTool(toolInfo) {
        if (!toolInfo.isUse || !toolInfo.isShow) {
          return;
        }
        return (
          <div style={{position: 'absolute'}}>
            width: <span><input onChange={self.onInputWidthChange} value={toolInfo.width} /></span>
            height: <span><input onChange={self.onInputHeightChange} value={toolInfo.height} /></span>
            <button onClick={toolInfo.sizeChange}>修改尺寸</button>
          </div>
        );
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
