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
      this.changeDragPoint();
    }
    componentWillUpdate(newProps) {
      if (this.props.imgStyle !== newProps.imgStyle) {
        this.changeDragPoint(newProps);
      }
    }
    changeDragPoint = (props) => {
      const _props = props || this.props;
      const { pointStyle } = this.state;
      const { style } = _props.dragPoint;
      const { imgStyle } = _props;
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
    calculatePosition = (event, direction, isMouse) => {
      let { lastX, lastY } = this.state;
      let deltaX, deltaY;
      const clientX = (isMouse ? event.clientX : event.touches[0].clientX);
      const clientY = (isMouse ? event.clientY : event.touches[0].clientY);
      switch (direction) {
        case 'topLeft':
          deltaX = this.state.originX - clientX + lastX;
          deltaY = this.state.originY - clientY + lastY;
          break;
        case 'topRight':
          deltaX = clientX - this.state.originX + lastX;
          deltaY = this.state.originY - clientY + lastY;
          break;
        case 'bottomLeft':
          deltaX = this.state.originX - clientX + lastX;
          deltaY = clientY - this.state.originY + lastY;
          break;
        case 'bottomRight':
          deltaX = clientX - this.state.originX + lastX;
          deltaY = clientY - this.state.originY + lastY;
          break;
        default:
          break;
      }
      return {
        deltaX,
        deltaY
      }
    }
    move = (event) => {
      const { direction } = this.state;
      const module = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
      let position = {};
      if (event.type.indexOf('mouse') >= 0) {
        position = this.calculatePosition(event, direction , true);
      } else {
        position = this.calculatePosition(event, direction , false);
      }
      this.setState({
          x: position.deltaX,
          y: position.deltaY
      })
      this.styleChange(direction, 'dragStart');
    }
    onDragStart = (event, direction) => {
      document.body.style.userSelect = 'none';
      event.preventDefault();
      event.stopPropagation();
      if (isNaN(Number(event.button)) || Number(event.button) !== 0) {
        return;
      }
      this.checkDocument();
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
        direction: direction,
        bgImgStyle: {
          ...bgImgStyle,
          opacity: 0.2,
        }
      })
    }
    onDragEnd = (event, direction) => {
      document.body.style.userSelect = '';
      event.preventDefault();
      event.stopPropagation();
      if (isNaN(Number(event.button)) || Number(event.button) !== 0) {
        return;
      }
      this.checkDocument();
      if (event.type.indexOf('mouse') >= 0) {
        document.removeEventListener('mousemove', this.move)
        document.removeEventListener('mouseup', this.onDragEnd)
      } else {
        document.removeEventListener('touchmove', this.move)
        document.removeEventListener('touchend', this.onDragEnd)
      }
      const { bgImgStyle } = this.state;
      this.setState({
        zIndex: 1,
        bgImgStyle: {
          ...bgImgStyle,
          opacity: 0,
        }
      })
      this.styleChange(direction, 'dragEnd');
      if (this.props.onDragEnd) {
        this.props.onDragEnd(event, this.state.x, this.state.y);
      }
    }
    styleChange = (direction, dragStatus) => {
      const { x, y, zIndex, bgImgStyle } = this.state;
      const isMove = dragStatus === 'dragStart';
      const { imgStyle } = this.props;
      const style = {
        width: (imgStyle.width + x),
        height: (imgStyle.height + y),
        isMove,
        zIndex,
        top: ['topLeft', 'topRight'].includes(direction) && isMove ? 'auto' : 0,
        bottom: ['bottomLeft', 'bottomRight'].includes(direction) && isMove ? 'auto' : 0,
        right: ['topRight', 'bottomRight'].includes(direction) && isMove ? 'auto' : 0,
        left: ['topLeft', 'bottomLeft'].includes(direction) && isMove ? 'auto' : 0,
      }
      this.setState({
        imgStyle: {
          ...style
        }
      });
      if (this.props.onStyleChange && typeof this.props.onStyleChange === 'function') {
        this.props.onStyleChange(style);
      }
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
      const isShow = toolBar.isShow || toolBar.isFocus;
      if (!attPoint || !isShow) {
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
        const { isMove,  bgImgStyle, imgStyle } = this.state;
        const { bgImg } = this.props;
        return (
          <div
            style={{
              width: imgStyle.width,
              height: imgStyle.height,
              position: 'absolute',
              top: imgStyle.top || 0,
              bottom: imgStyle.bottom || 0,
              right: imgStyle.right || 0,
              left: imgStyle.left || 0,
              transition: isMove ? '' : 'all .2s ease-out',
              zIndex: isMove ? 10 : 2,
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
    height: 400,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
};
export default Drag;