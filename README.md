<br>
<h1 align="center">iPicker</h1>

<h4 align="center">无任何依赖的轻量级地区选择组件</h4>

<blockquote align="center">
  <em>iPicker</em> 是一个轻量级的地区选择组件，可以简单快速的对 “省市区” 进行选择<br>
专门针对桌面端的现代高级浏览器，无任何第三方依赖完全使用原生 JavaScript 开发
</blockquote>

<h4 align="center">
  <a href="http://dreamer365.gitee.io/ipicker/" target="_blank">查看在线示例</a>
</h4>
<br>
<p align="center">JSON 数据来源 <a href="https://github.com/dwqs/area-data" target="_blank">area-data</a></p>

## 安装组件
#### 本地引入

```html
<script src="ipicker.min.js"></script>
```

#### cdn 引入

```html
<script src="https://unpkg.com/new-ipicker@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/new-ipicker@latest/dist/iPicker.min.js"></script>
```

#### npm 安装

```javascript
npm i new-ipicker -S
```
```javascript
const iPicker = require( "new-ipicker" );
```
<hr/>

## 使用方法
#### 创建容器后，先获取 json 数据，然后调用 `iPicker` 方法即可：

```html
<div id="target"></div>

<script>
    
    // 此处以通过 axios 库获取数据为例
    axios.get( "area.json" ).then(function ( response ) {
        iPicker("#target", {
            data: response.data
        });
    })
    
</script>
```
#### 可以选择 cascader 主题
```javascript
axios.get( "area.json" ).then(function ( response ) {
    iPicker("#target", {
        data: response.data,
        type: "cascader"
    });
})
```
#### 设置默认选中值
```javascript
axios.get( "area.json" ).then(function ( response ) {
    iPicker("#target", {
        data: response.data,
        selected: [ "230000", "230100", "230103" ]

        // 也可以是 name 形式
        // selected: [ "黑龙江省", "哈尔滨市", "南岗区" ]
    });
})
```
#### 监听选中项的变化
```javascript
axios.get( "area.json" ).then(function ( response ) {
    iPicker("#target", {
        data: response.data,
        onSelect: function ( code, name, all ) {
            
            // 有三种返回值（均为数组形式）
            console.log( code );
            console.log( name );
            console.log( all );
        }
    });
})
```
## 组件方法
#### iPicker 提供了六个方法：
![输入图片说明](https://images.gitee.com/uploads/images/2020/0306/123227_4782b14c_5535128.png "iPicker.png")

```javascript
var picker = iPicker( "#target", { ... } );

// 获取选中结果（前两种等效）
iPicker.get( picker );
iPicker.get( picker, "code" );
iPicker.get( picker, "name" );
iPicker.get( picker, "all" );

// 清空选中结果
iPicker.clear( picker );

// 重置（恢复初始状态）
iPicker.reset( picker );

// 启用（全部）
iPicker.enabled( picker );

// 启用（指定层级，范围：0-2，仅限 select 主题模式下）
iPicker.enabled( picker, [ 0, 1 ] );

// 禁用（全部）
iPicker.disabled( picker );

// 禁用（指定层级，范围：0-2，仅限 select 主题模式下）
iPicker.disabled( picker, [ 0, 1 ] );
```

<hr/>

## 配置参数
<table>
    <tr>
        <td>参数</td>
        <td>说明</td>
        <td>类型</td>
        <td>默认值</td>
    </tr>
    <tr>
        <td>theme</td>
        <td>主题模式，可选值：select, cascader</td>
        <td>String</td>
        <td>select</td>
    </tr>
    <tr>
        <td>data</td>
        <td>地区的 json 数据（必填项）</td>
        <td>Object</td>
        <td>{}</td>
    </tr>
    <tr>
        <td>level</td>
        <td>数据的展示层级，范围：0-2（代表 1-3 级，省-市-区）</td>
        <td>Number</td>
        <td>2</td>
    </tr>
    <tr>
        <td>width</td>
        <td>展示框的宽度，单位：px，cascader 模式下建议适当的增加</td>
        <td>Number</td>
        <td>200</td>
    </tr>
    <tr>
        <td>maxHeight</td>
        <td>数据列表的最大高度，单位：px</td>
        <td>Number</td>
        <td>300</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>默认禁用的展示框，设置为 true 时将禁用所有展示框；<br>在 select 模式下可传入数组形式，设置禁用指定层级的展示框，范围：0-2（代表 1-3 级，省-市-区）</td>
        <td>Boolean / Array</td>
        <td>false</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>默认选中项，可以是 name 或 code 形式</td>
        <td>Array</td>
        <td>[]</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>展示框的占位文字，select 模式下是数组形式，cascader 模式下是字符串形式</td>
        <td>String / Array</td>
        <td>[ "省", "市", "区" ]</td>
    </tr>
    <tr>
        <td>onSelect</td>
        <td>选择项改变时执行的回调函数，有 3 个回调参数：<br>1. code 数组<br>2. name 数组<br>3. code 与 name 的数组集合</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
</table>

<hr/>

## 开源协议
<p><a href="https://gitee.com/dreamer365/iPicker/blob/master/LICENSE">MIT License</a></p>

<hr/>

## 浏览器支持

| Chrome | Firefox | Opera | Edge | Safari | IE  |
| ---    | ---     | ---   | ---  | ---    | --- |
| 60+    | 60+     | 60+   | 17+  | 12+    | 11+ |

