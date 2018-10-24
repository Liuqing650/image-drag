import React from 'react';

class Drag extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        originX: 0,
        originY: 0,
        zIndex: 1,
        isMove: false,
        direction: '',
        dragType: 'drag',
        imgStyle: {},
        pointStyle: {
          position: 'absolute',
          width: 10,
          height: 10,
          right: 2,
          bottom: 2,
          border: '1px solid #8bc34a',
          background: '#8bc34a'
        },
        bgImgStyle: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          opacity: 0,
        }
      }
    }
    componentWillMount() {
      this.initDragPoint();
    }
    initDragPoint = () => {
      const { pointStyle } = this.state;
      const { style } = this.props.dragPoint;
      const { imgStyle } = this.props;
      this.setState({
        pointStyle: {
          ...pointStyle,
          ...style,
        },
        imgStyle: {
          ...imgStyle
        }
      });
    }
    checkDocument = () => {
      if (!document) {
        console.error('没能获取到 window.document 对象');
        return;
      }
    }
    move = (event) => {
      let { lastX, lastY, direction } = this.state;
      console.log('direction------->', direction);
      let deltaX, deltaY;
      if (event.type.indexOf('mouse') >= 0) {
          deltaX = event.clientX - this.state.originX + lastX
          deltaY = event.clientY - this.state.originY + lastY
      } else {
          deltaX = event.touches[0].clientX - this.state.originX + lastX
          deltaY = event.touches[0].clientY - this.state.originY + lastY
      }
      this.setState({
          x: deltaX,
          y: deltaY
      })
      this.styleChange();
    }
    onDragStart = (event, direction) => {
      if (isNaN(Number(event.button)) || Number(event.button) !== 0) {
        return;
      }
      this.checkDocument();
      document.body.style.userSelect = 'none';
      if (event.type.indexOf('mouse') >= 0) {
          document.addEventListener('mousemove', this.move);
          document.addEventListener('mouseup', this.onDragEnd);
      } else {
          document.addEventListener('touchmove', this.move)
          document.addEventListener('touchend', this.onDragEnd)
      }
      if (this.props.onDragStart) {
        this.props.onDragStart(this.state.x, this.state.y)
      }
      let originX, originY;
      if (event.type.indexOf('mouse') >= 0) {
          originX = event.clientX
          originY = event.clientY
      } else {
          originX = event.touches[0].clientX
          originY = event.touches[0].clientY
      }
      const { bgImgStyle } = this.state;
      this.setState({
        originX: originX,
        originY: originY,
        lastX: this.state.x,
        lastY: this.state.y,
        zIndex: 10,
        isMove: true,
        direction: direction,
        bgImgStyle: {
          ...bgImgStyle,
          opacity: 0.2,
        }
      })
    }
    onDragEnd = (event) => {
      if (isNaN(Number(event.button)) || Number(event.button) !== 0) {
        return;
      }
      this.checkDocument();
      document.body.style.userSelect = '';
      if (event.type.indexOf('mouse') >= 0) {
        document.removeEventListener('mousemove', this.move)
        document.removeEventListener('mouseup', this.onDragEnd)
      } else {
        document.removeEventListener('touchmove', this.move)
        document.removeEventListener('touchend', this.onDragEnd)
      }
      this.setState({
        zIndex: 1,
        isMove: false
      })
      const { bgImgStyle } = this.state;
      this.setState({
        bgImgStyle: {
          ...bgImgStyle,
          opacity: 0,
        }
      })
      this.styleChange();
      if (this.props.onDragEnd) {
        this.props.onDragEnd(event, this.state.x, this.state.y);
      }
    }
    styleChange = () => {
      const { x, y, zIndex, bgImgStyle } = this.state;
      const { imgStyle } = this.props;
      const style = {
        width: (imgStyle.width + x),
        height: (imgStyle.height + y),
        zIndex
      }
      this.setState({
        imgStyle: {
          ...style
        }
      });
      this.props.onStyleChange(style);
    };
    renderDragPoint = (direction) => {
      const { pointStyle } = this.state;
      const { toolBar } = this.props;
      const directionPoint = {
        topLeft : this.props.dragPoint.topLeftPoint,
        topRight : this.props.dragPoint.topRightPoint,
        bottomLeft : this.props.dragPoint.bottomLeftPoint,
        bottomRight : this.props.dragPoint.bottomRightPoint,
      };
      const pointMove = -4;
      const attPoint = directionPoint[direction];
      if (!attPoint || !toolBar.isFocus) {
        return;
      }
      let _pointStyle = Object.assign({}, pointStyle);
      const pointSize = {
        ..._pointStyle,
        width: attPoint.width || 10,
        height: attPoint.height || 10,
      };
      const position = {
        topLeft: {
          ...pointSize,
          left: attPoint.left || pointMove,
          top: attPoint.top || pointMove,
          cursor: attPoint.cursor || 'nw-resize',
        },
        topRight: {
          ...pointSize,
          right: attPoint.right || pointMove,
          top: attPoint.top || pointMove,
          cursor: attPoint.cursor || 'ne-resize',
        },
        bottomLeft: {
          ...pointSize,
          left: attPoint.left || pointMove,
          bottom: attPoint.bottom || pointMove,
          cursor: attPoint.cursor || 'sw-resize',
        },
        bottomRight: {
          ...pointSize,
          right: attPoint.right || pointMove,
          bottom: attPoint.bottom || pointMove,
          cursor: attPoint.cursor || 'se-resize',
        }
      }
      const pointBtnProps = {
        onMouseDown: (event) => this.onDragStart(event, direction),
        onTouchStart: (event) => this.onDragStart(event, direction),
        onTouchEnd: (event) => this.onDragEnd(event, direction),
        onMouseUp: (event) => this.onDragEnd(event, direction),
      };
      return (<span {...pointBtnProps} style={position[direction]}/>);
    }
    render() {
        const {
          dragType, x, y, isMove, wrapInfo,
          bgImgStyle, imgStyle
        } = this.state;
        const { bgImg } = this.props;
        return (
          <div
            style={{
              width: imgStyle.width,
              height: imgStyle.height,
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              transition: isMove ? '' : 'all .2s ease-out',
              zIndex: isMove ? (this.props.dragType === 'drag' ? 10 : 2) : 2,
            }}
          >
            <img src={bgImg} style={bgImgStyle} />
            {this.renderDragPoint('topLeft')}
            {this.renderDragPoint('topRight')}
            {this.renderDragPoint('bottomLeft')}
            {this.renderDragPoint('bottomRight')}
          </div>
        )
    }
}
Drag.defaultProps = {
  imgStyle: {
    width: 600,
    height: 400
  },
};
export default Drag;