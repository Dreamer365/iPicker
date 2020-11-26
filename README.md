<br>
<h1 align="center">iPicker</h1>

<h4 align="center">无任何依赖的轻量级地区选择组件</h4>

<blockquote align="center">
  这是一个轻量级的地区选择组件，可以简单快速的对 “省市区” 进行选择<br>
专门针对桌面端的现代高级浏览器，无任何第三方依赖完全使用原生 JavaScript 开发
</blockquote>


<h4 align="center">
  <a href="http://dreamer365.gitee.io/ipicker/" target="_blank">查看在线示例</a>
</h4>

## 最新版本
v3.0.0

<hr/>

## 安装组件
##### 本地引入

```html
<script src="ipicker.min.js"></script>
```

##### cdn 引入

```html
<script src="https://unpkg.com/new-ipicker"></script>
<script src="https://cdn.jsdelivr.net/npm/new-ipicker"></script>
```

##### npm 安装

```javascript
npm i new-ipicker -S
const iPicker = require( "new-ipicker" );
```
<hr/>

## 示例代码

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>iPicker 示例代码</title>
    </head>
    <body>

        <div id="target"></div>
        
        <script src="ipicker.min.js"></script>
        <script>
            iPicker("#target", {
                data: {
                    
                    // 此处以通过 jquery 库获取本地数据源为例
                    source: $.getJSON( "area.json" )
                }
            })
        </script>

    </body>
</html>
```

<hr/>

## 使用方法
- [使用内置数据源](#a)
- [使用自定义数据源](#b)
- [可选主题模式](#c)
- [设置默认选中值](#d)
- [监听选中项的变化](#e)
- [自定义主题颜色](#f)
- [自定义显示层级](#g)
- [默认禁用](#h)





<h4 id="a">使用内置数据源</h4>
<b>注意：内置数据源中的所有地区数据均来自公开的网络搜索，因此不保证其准确性和完整性，请开发者检查后酌情使用！</b>
<br>
<b>提示：内置数据源中暂无香港特别行政区、澳门特别行政区和台湾省等地区的数据！</b>

```html
<div id="target"></div>

<script>
    iPicker("#target", {
    
        // 此处以通过 jquery 库获取本地数据源为例
        // 使用内置数据源时，必须保证 source 属性值是标准的 Promise 对象或者是 jquery 提供的 Deferred 对象
        // iPicker 会自动调用 then 方法，同时要确保 then 方法的参数就是返回的数据（Object 类型）
        data: {
            source: $.getJSON( "area.json" )
        }
    });
</script>
```




<h4 id="b">使用自定义数据源</h4>

```html
<div id="target"></div>

<script>
    iPicker("#target", {
        data: {
            
            // 此处以通过 jquery 库获取数据为例
            // 示例代码中使用的 "http://www.abcddcba.com/api/area" 是模拟地址，实际应用中替换成真实地址即可
            // code 参数值就是相应地区对应的行政区划代码
            // ----------------------------------------------------------------------------------------------------------
            // 使用自定义数据源时，必须保证 source 属性值是 Function 类型
            // iPicker 会自动执行此函数，同时要确保此函数的执行结果返回的是标准的 Promise 对象或者是 jquery 提供的 Deferred 对象
            // iPicker 会自动调用 then 方法，同时要确保 then 方法的参数就是返回的数据（Array 类型）
            // ----------------------------------------------------------------------------------------------------------
            // 初始状态下，iPicker 会自动执行一次 source 函数来获取 “省份” 数据，此时传入的 code 参数值为 null
            // 因此，开发者可能需要给 code 参数设置一个默认值来获取 “省份” 数据（如示例代码中 code 为 null 时默认为零）
            source: function ( code ) {
                return $.get( "http://www.abcddcba.com/api/area/areaId=" + ( code || 0 ) );
            }
        }
    });
</script>


<!-- 上面的示例代码使用了一个统一的地址返回数据 -->
<!-- 也可以传入第二个参数，根据此参数可分别设置 “省市区” 不同的数据源 -->
<script>
    iPicker("#target", {
        data: {
            source: function ( code, level ) {
                var data = "";

                // level 是层级（1-3 代表：省-市-区）
                switch ( level ) {

                    // 省数据源
                    // 初始状态下，iPicker 会自动执行一次 source 函数来获取 “省份” 数据，此时传入的 code 参数值为 null
                    // 因此，开发者可能需要给 code 参数设置一个默认值来获取 “省份” 数据（如示例代码中 areaId=0）
                    case 1: data = $.get( "http://www.abcddcba.com/api/province/areaId=0" ); break;

                    // 市数据源
                    case 2: data = $.get( "http://www.abcddcba.com/api/city/areaId=" + code ); break;

                    // 区数据源
                    case 3: data = $.get( "http://www.abcddcba.com/api/district/areaId=" + code ); break;
                }
                return data;
            }
        }
    });
</script>


<!-- 
    - iPicker 默认会调用返回数据中 code 和 name 属性，例如：
      {
          code: "110000",
          name: "北京市"
      }
    - 可以通过设置 props 来自定义属性名
-->
<script>
    iPicker("#target", {
        data: {
            props: {
                code: "areaId",
                name: "areaName"
            },
            source: function ( code ) {
                return $.get( "http://www.abcddcba.com/api/area/areaId=" + code );
            }
        }
    });
</script>
```



<h4 id="c">可选主题模式</h4>

```javascript
// select 模式
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    theme: "select"
});

// cascader 模式
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    theme: "cascader"
});
```
<h4 id="d">设置默认选中值</h4>

```javascript
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    selected: [ "230000", "230100", "230103" ]
});
```
<h4 id="e">监听选中项的变化</h4>

```javascript
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    onSelect: function ( code, name, all ) {
            
        // 返回参数均为数组形式
        console.log( code );
        console.log( name );
        console.log( all );
    }
});
```
<h4 id="f">自定义主题颜色</h4>

```javascript
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    activeStyle: {
        color: "#09f",
        borderColor: "#A600DB",
        backgroundColor: "#A600DB"
    }
});
```
<h4 id="g">自定义显示层级</h4>

```javascript
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    level: 2
});
```
<h4 id="h">默认禁用</h4>

```javascript
// 禁用全部层级
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabled: true
});

// 禁用指定层级，仅限 select 主题模式下
iPicker("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabled: [ 2, 3 ]
});
```
<h2 id="i">组件方法</h2>

<b>iPicker 提供了六个方法：</b>

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

// 启用（指定层级，范围：1-3，仅限 select 主题模式下）
iPicker.enabled( picker, [ 2, 3 ] );
iPicker.enabled( picker, 3 );

// 禁用（全部）
iPicker.disabled( picker );

// 禁用（指定层级，范围：1-3，仅限 select 主题模式下）
iPicker.disabled( picker, [ 2, 3 ] );
iPicker.disabled( picker, 3 );

// 销毁（移除 iPicker 组件）
iPicker.destroy( picker );
```

<hr/>

<h2 id="j">配置参数</h2>
<table>
    <tr>
        <td>参数</td>
        <td>说明</td>
        <td>类型</td>
        <td>默认值</td>
    </tr>
    <tr>
        <td>theme</td>
        <td>主题模式，可选值：select、cascader</td>
        <td>String</td>
        <td>select</td>
    </tr>
    <tr>
        <td>data</td>
        <td>
            设置数据源，共有 2 个属性：<br>
            01. props: 自定义数据源的数据属性映射（用于自定义数据源，使用内置数据源时无效）<br>
            02. source: 数据来源：<br>
                &nbsp;&nbsp;&nbsp;&nbsp;返回 Promise 表示加载本地数据源；<br>
                &nbsp;&nbsp;&nbsp;&nbsp;返回 Function 表示使用自定义数据源；
        </td>
        <td>Object</td>
        <td>
            {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;props: { <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code: "code", <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: "name" <br>
            &nbsp;&nbsp;&nbsp;&nbsp;},<br>
            &nbsp;&nbsp;&nbsp;&nbsp;data: null<br>
            }
        </td>
    </tr>
    <tr>
        <td>level</td>
        <td>数据的展示层级，有效范围：1-3（代表 1-3 级，省-市-区）</td>
        <td>Number</td>
        <td>3</td>
    </tr>
    <tr>
        <td>width</td>
        <td>展示框的宽度，单位：px，不能小于 90（如果设置了小于 90 的值则按照 90 处理）</td>
        <td>Number</td>
        <td>200</td>
    </tr>
    <tr>
        <td>maxHeight</td>
        <td>下拉列表的最大高度，单位：px，不能小于 46（如果设置了小于 46 的值则按照 46 处理）</td>
        <td>Number</td>
        <td>300</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>
            默认禁用的展示框，有 3 种设置方式：<br>
            01. 设置为 true 则禁用所有展示框；<br>
            02. 设置为 1-3 范围内的数字，则禁用单个指定层级的展示框（仅限 select 模式下）；<br>
            03. 设置为 Array 形式，则禁用单个/多个指定层级的展示框（仅限 select 模式下）<br>
            例如：<br>
            disabled: true（禁用所有展示框）<br>
            disabled: [ 2, 3 ] （禁用第 2，3 级展示框）<br>
            disabled: 3 （禁用第 3 级展示框）
    </td>
        <td>Boolean / Array / Number</td>
        <td>false</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>
            默认选中项，需要传入地区相应的 code 值<br>
            注意：selected 设置的层级数（即：数组长度）必须与 level 相同，否则无效<br>
            例如：<br>
            selected: [ "230000", "230100", "230103" ],<br>
            level: 3
        </td>
        <td>Array</td>
        <td>[]</td>
    </tr>
    <tr>
        <td>selectedCallback</td>
        <td>
            默认选中项设置成功后执行的回调函数，有 3 个回调参数：<br>
            1. code 数组<br>
            2. name 数组<br>
            3. code 与 name 的数组集合<br><br>
            提示：此属性一般用于 “自定义数据源” 的情况，因为自定义数据源需要发送请求<br>
            来获取地区数据，就会存在网络请求导致的延时，因此可能需要用此属性来执行一些操作<br>
            而使用内置数据源时，因为在初始化阶段已经一次性加载了全部数据，不存在延时问题<br>
            因此一般不会用到这个属性。
        </td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>展示框的占位文字，select 模式下是 Array 形式，cascader 模式下是 String 形式</td>
        <td>Array / String</td>
        <td>[ "省", "市", "区" ]</td>
    </tr>
    <tr>
        <td>onSelect</td>
        <td>
            选择项改变时执行的回调函数，有 3 个回调参数：<br>
            1. code 数组<br>
            2. name 数组<br>
            3. code 与 name 的数组集合
        </td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>activeStyle<br>（v3.0.0新增）</td>
        <td>设置选中项的激活颜色</td>
        <td>Object</td>
        <td>
            {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;color: "#00b8ff",<br>
            &nbsp;&nbsp;&nbsp;&nbsp;borderColor: "#00b8ff",<br>
            &nbsp;&nbsp;&nbsp;&nbsp;backgroundColor: "#f5f5f5"<br>
            }
        </td>
    </tr>
    <tr>
        <td>separator<br>（v3.0.0新增）</td>
        <td>cascader 主题模式下，展示框内的选择结果的分隔符</td>
        <td>String</td>
        <td>/</td>
    </tr>
    <tr>
        <td>strict<br>（v3.0.0新增）</td>
        <td>
            开启 strict 时<br>
            cascader 主题模式下，当关闭列表时，如果选择的结果层级与设置的 level 不等，则选择无效<br>
            select 主题模式下会自动将下一级的第一个选项选中</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>onlyShowLastLevel<br>（v3.0.0新增）</td>
        <td>cascader 主题下设置只显示所选地区的最后一项</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>arrowTheme<br>（v3.0.0新增）</td>
        <td>设置选择框结尾的箭头图标的样式，可选值：arrow, arrow-outline</td>
        <td>String</td>
        <td>arrow</td>
    </tr>
</table>

<hr/>

<h2 id="k">友情提示</h2>
<p>当使用【自定义数据源】时，只要设置好 data.props 属性，iPicker 就能实现任何数据的选择匹配功能（绝不仅限于地区选择哦）！</p>

<hr/>

<h2 id="k">开源协议</h2>
<p><a href="https://github.com/Dreamer365/iPicker/blob/master/LICENSE">MIT License</a></p>

<hr/>

<h2 id="l">更新日志</h2>
<p><a href="https://github.com/Dreamer365/iPicker/blob/master/Changelog.md">更新日志</a></p>

<hr/>

<h2 id="l">浏览器支持</h2>


| Chrome | Firefox | Opera | Edge | Safari | IE  |
| ---    | ---     | ---   | ---  | ---    | --- |
| 60+    | 60+     | 60+   | 17+  | 12+    | 11+ |

