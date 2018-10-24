import React, { Component } from 'react';
import ImageDrag from '../src';

const imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540805600&di=36ca8557dbe2dd2a6d5a285b7a63559c&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4610b912c8fcc3ce79f8f9099945d688d43f20cb.jpg';

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
    return (
      <div>
        {/* <ImageDrag {...dragProps}>
          <img style={{
              width: '100%',
              height: '100%'
            }}
            src={imgSrc}
          />
        </ImageDrag> */}
        <ImageDrag {...dragProps} />
      </div>
    );
  }
}
