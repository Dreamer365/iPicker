<br>
<h1 align="center">iPicker</h1>

<h4 align="center">地区选择组件&nbsp; | &nbsp;<a href="http://dreamer365.gitee.io/ipicker/" target="_blank">查看在线示例</a></h4>

<blockquote align="center">
  <em>iPicker</em> 是一个轻量级的地区选择组件，可以简单快速的对 “省市区” 进行选择<br>
专门针对桌面端的现代高级浏览器，提供了两种版本供开发者根据项目需求自由选择
  
</blockquote>

<p align="center">
  <a href="#jquery-plugin">jQuery 插件版</a>&nbsp;&nbsp;|
  <a href="#vue-browser">&nbsp;Vue 组件版</a>
</p>

<p align="center">数据来源 <a href="https://github.com/dwqs/area-data" target="_blank">area-data</a></p>

<h2 id="jquery-plugin">jQuery 插件版</h2>

#### 引入文件

```html
<!-- 要求 jquery 1.9.0+ -->
<script src="jquery.min.js"></script>
<script src="ipicker.min.js"></script>
```

#### 创建容器
```html
<div id="container"></div>
````

#### 调用插件
```js
$( "#container" ).iPicker({
    data: "area.json",
    onSelect: function ( value, text, set ) {
        console.log( value );
        console.log( text );
        console.log( set );
    }
});
````

#### jQuery 插件版提供的方法

```javascript
$( elem ).iPicker( {} );           // 设置组件
$( elem ).iPicker( "clear" );      // 清空选择的结果
$( elem ).iPicker( "reset" );      // 重置组件
$( elem ).iPicker( "destroy" );    // 销毁组件
$( elem ).iPicker( "enabled" );    // 启用设置了 disabled 的选择框
$( elem ).iPicker();               // 获取选中结果
```

<hr/>
<h2 id="vue-browser">Vue 组件版</h2>

### 安装

```javascript
npm install vue-ipicker -S
```

### 使用

```javascript
// main.js
import iPicker from "vue-ipicker";
Vue.use( iPicker );
```

```html
<template>
    <div id="app">
        <iPicker :options="options" @onSelect="select"></iPicker>
    </div>
</template>

<script>

    // 假设 area.json 文件放在了 static 里
    import AreaJSON from "../static/area.json";

    export default {
        name: "app",
        data () {
            return {
                options: {
                    data: AreaJSON
                }
            }
        },
        methods: {
            select ( value, text, set ) {
                console.log( value );
                console.log( text );
                console.log( set );
            }
        }
    }
</script>
````
<hr/>

<h2>API 参数</h2>

| 参数           | 说明                                                         | 类型     | 默认值             |
| -------------- | ------------------------------------------------------------ | -------- | ------------------ |
| data           | 地区的 json 数据，可传入三种形式的数据：<br>1. 直接传入 json 数据<br>2. 传入 Promise （ 仅限 jQuery 插件版！自动执行 then 方法来得到数据 ）<br>3. json 文件地址（ 仅限 jQuery 插件版！当传入 json 文件的地址时，程序会自动调用 $.getJSON() 请求数据 ）                                         | Object / String   | {}                 |
| level          | 显示的层级，范围 1-3，对应：省-市-区                         | Number   | 3                  |
| defautValue    | 默认选中值                                                   | Array    | []                 |
| disabled       | 禁用指定的选择框，true 表示全部禁用，传入数组可禁用指定层级，如：[ 1,2 ] 表示禁用第 2，3 级选择框               | Boolean / Array    | false                 |
| width       | 选择框宽度，单位：px                 | Number    | 200                 |
| maxHeight   | 下拉列表的最大高度，单位：px                 | Number    | 300                 |
| placeholder    | 选择框占位文字           | Array    | ["省", "市", "区"] |
| onSelect       | 选中列表中某一项后执行的回调函数，回调参数有三个：<br>1. 所有选中项的 value <br>2. 所有选中项的 text <br>3. 所有选中项的 value 和 text 集合<br><br>以上参数均返回数组形式 | Function | 空函数             |

<hr/>

<h2>开源协议</h2>
<p><a href="https://github.com/Dreamer365/iPicker/blob/master/LICENSE">MIT License</a></p>

<hr/>

<h2>浏览器支持</h2>

| Chrome | Firefox | Opera | Edge | Safari | IE  |
| ---    | ---     | ---   | ---  | ---    | --- |
| 60+    | 60+     | 60+   | 17+  | 12+    | 11+ |

