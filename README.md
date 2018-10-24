# image-dragger

预览demo

[图片拖拽缩放组件](https://liuqing650.github.io/image-drag/preview/)

## API

|name|type|desc|other|
|-|-|-|-|
|width|number|图片区域宽度|默认600|
|height|number|图片区域高度|默认400|
|image|`file` or `url`|图片|*|
|children|`dom元素`|图片|*, 如果`image`也存在，此属性优先|
|imgStyle|object|图片样式属性|*|
|toolBar|object|工具栏配置|*|
|dragPoint|object|拖拽点配置|*|
|onClickImage|function|点击图片|function(toolInfo)|

## toolBar

|name|type|desc|other|
|-|-|-|-|
|top|number|位置属性|0|
|bottom|number|位置属性|0|
|left|number|位置属性|0|
|right|number|位置属性|0|
|className|string|toolBar样式|*|
|isUse|boolean|是否使用toolBar|true|
|isBlock|boolean|是否进行块状化布局|*|
|render|function|自定义工具栏显示形式|function(toolInfo),接收一个Dom元素|

## dragPoint

|name|type|desc|other|
|-|-|-|-|
|topLeftPoint|object|左上角拖拽点样式|{}|
|topRightPoint|object|右上角拖拽点样式|{}|
|bottomLeftPoint|object|左下角拖拽点样式|{}|
|bottomRightPoint|object|右下角拖拽点样式|{}|
|style|object|拖拽点公共样式|*|
