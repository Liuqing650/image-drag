# image-drag

[图片拖拽缩放组件](https://liuqing650.github.io/image-drag/preview/)

[![NPM](https://nodei.co/npm/image-drag.png)](https://nodei.co/npm/image-drag/)

[![NPM](https://nodei.co/npm-dl/image-drag.png?months=3)](https://nodei.co/npm/image-drag/)

## Example

```jsx
import React from 'react';
import ImageDrag from 'image-drag';

class Image extends React.Component {
  state = {
    isShow: false,
    isUse: true,
  }
  render() {
    const { isShow, isUse } = this.state;
    const dragProps = {
      width: 600, // can only receive number
      image: 'https://image.xx.jpg' || 'file',
      toolBar: {
        isShow,
        isUse
      }
    }
    return (<ImageDrag {...dragProps} />);
  }
}
export default Image;
```

[CODE](https://github.com/Liuqing650/image-drag/blob/master/example/example.js)

## API

|name|type|desc|other|version|
|-|-|-|-|-|
|width|number|图片区域宽度|默认600|v 1.0.0|
|height|number|图片区域高度|默认400|v 1.0.0|
|image|`file` or `url`|图片|*|v 1.0.0|
|children|`dom元素`|图片|*, 如果`image`也存在，此属性（`children`）优先|v 1.0.0|
|imgStyle|object|图片样式属性|*|v 1.0.0|
|toolBar|object|工具栏配置|*|v 1.0.0|
|dragPoint|object|拖拽点配置|*|v 1.0.0|
|tabIndex|string|设置 tabIndex 属性|*|**v 1.2.0**|
|onClickImage|function|点击图片|function(toolInfo)|v 1.0.0|
|onDragStart|function|拖拽开始|function(toolInfo, event, [clientX, clientY])|**v 1.1.0**|
|onDragging|function|拖拽中|function(imageDragStyle)|**v 1.1.0**|
|onDragEnd|function|拖拽结束|function(toolInfo, event, [clientX, clientY])|**v 1.1.0**|
|onFocusImage|function|获取图片焦点事件|function(toolInfo)|**v 1.2.1**|
|onBlurImage|function|失去图片焦点事件|function(toolInfo)|**v 1.2.1**|
|renderTool|function|自定义工具栏显示形式|function(toolInfo),接收一个Dom元素|v 1.0.0|

> renderTool中传入的参数为 `toolBar` 中的信息， 同时会多传递一个刷新图片尺寸的函数
>
> 在 **v 1.2.x** 及以上版本中 `function(toolInfo)` 传递的 `toolInfo` 为只读属性

## toolBar

|name|type|desc|other|version|
|-|-|-|-|-|
|top|number|位置属性|0|v 1.0.0|
|bottom|number|位置属性|0|v 1.0.0|
|left|number|位置属性|0|v 1.0.0|
|right|number|位置属性|0|v 1.0.0|
|width|number|拖拽后图片区域宽度|*|v 1.0.0|
|height|number|拖拽后图片区域高度|*|v 1.0.0|
|className|string|toolBar样式|*|v 1.0.0|
|isUse|boolean|是否使用toolBar|true|v 1.0.0|
|isShow|boolean|是否接管显示toolBar,会覆盖掉内置显示属性|false|v 1.0.0|
|isBlock|boolean|是否进行块状化布局|*|v 1.0.0|

## dragPoint

|name|type|desc|other|version|
|-|-|-|-|-|
|topLeftPoint|object|左上角拖拽点样式|{}|v 1.0.0|
|topRightPoint|object|右上角拖拽点样式|{}|v 1.0.0|
|bottomLeftPoint|object|左下角拖拽点样式|{}|v 1.0.0|
|bottomRightPoint|object|右下角拖拽点样式|{}|v 1.0.0|
|style|object|拖拽点公共样式|*|v 1.0.0|
