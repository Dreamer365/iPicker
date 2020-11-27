### v3.0.0
###### 2020-11-27
- 新增
    - 增加可选数据源功能，现在可自由选择使用 “内置数据源” 或 “自定义数据源”；
    - 增加 separator 属性，在 cascader 主题下可自定义选择结果的分隔符；
    - 增加 onlyShowLastLevel 属性，在 cascader 主题下可设置只显示所选地区的最后一项；
    - 增加 strict 属性，此属性将开启严格选择模式；
    - 增加 arrowTheme 属性，现在选择框结尾的箭头图标有两种主题可选；
    - 增加 selectedCallback 属性，在默认值设置成功后执行的回调函数；
    - 增加 activeStyle 属性，用来取代 activeColor 属性；
    - 增加 radius 属性，可设置结果展示框的圆角值；
    - disabled 属性，enabled 方法和 disabled 方法现在可以传入数字类型的值；
- 修复
    - 修复 reset 方法无法重置 disabled 属性的问题；
- 变更
    - iPicker 组件现在只作用于第一个匹配元素；
    - 废弃 activeColor 属性；
    - 默认选中值不再支持传入 name，只能设置相应地区的 code 值；
    - 代码进行了完全重构，现在内部使用了 Promise 对象，因此如果要兼容 IE11 浏览器，需要引入相应的 polyfill 或 shim；
    - 更新了内置数据源的 json 数据；
    - level 属性现在从 1 开始，可选值范围变为 1 - 3；
    - 样式的细微调整。

### v2.1.0
###### 2020-03-09
- data 参数支持传入 Promise；
- 新增 activeColor 参数。

### v2.0.0
###### 2020-03-06
- 对程序进行重写，不再依赖 jQuery 和 Vue，完全基于原生 JavaScript 开发；
- 新增 cascader 主题。

### v1.0.0
###### 2020-01-14
- 发布 iPicker。