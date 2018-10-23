import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';
class Card extends Component {
  onWidthChange = (even) => {
    console.log(even.target.value);
  }
  onHeightChange = (even) => {
    console.log(even.target.value);
  }
  render() {
    const { style, dragEnd, dragStart } = this.props;
    const cardStyle = {
      width: style.width || 200,
      height: style.height || 200,
      textAlign: 'center',
      lineHeight: '200px',
      color: '#222',
      background: '#eaff8f'
    }
    const inputStyle = {
      width: 200,
      height: 50,
    }
    return (
      <div style={cardStyle}>
        <div style={{
            position: 'absolute',
            color: '#fff',
            zIndex: 20
          }}>
          <span style={inputStyle}>
            width: <input onChange={this.onWidthChange} value={style.width} />
            height: <input onChange={this.onHeightChange} value={style.height} />
          </span>
        </div>
        <img
          style={{
            width: '100%',
            height: '100%'
          }}
          src={imgSrc}
        />
      </div>
    )
  }
}

export default class Example extends Component {
  state = {
    style: {},
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
  render() {
    const dragProps = {
      width: 600,
      image: imgSrc,
      onDragEnd: this.onDragEnd,
    }
    // const { style } = this.state;
    // const cardProps = {
    //   style: style,
    //   dragEnd: false,
    //   dragStart: false,
    // }
    return (
      <div>
        <ImageDrag {...dragProps} />
      </div>
    );
  }
}
