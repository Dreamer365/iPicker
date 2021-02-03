<br>
<h1 align="center">iPicker</h1>

<h4 align="center">无任何依赖的轻量级省市区多级联动组件</h4>

<blockquote align="center">
  这是一个轻量级的地区选择组件，可以简单快速的对 “省市区” 进行选择<br>
专门针对桌面端的现代高级浏览器，无任何第三方依赖完全使用原生 JavaScript 开发
</blockquote>


<h4 align="center">
  <a href="http://dreamer365.gitee.io/ipicker/" target="_blank">查看在线示例</a>
</h4>

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
            iPicker.create("#target", {
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
- [自定义显示层级](#g)
- [默认禁用层级](#h)
- [默认禁用地区](#i)





<h4 id="a">使用内置数据源</h4>
<b>注意：内置数据源中的所有地区数据均来自公开的网络搜索，因此不保证其准确性和完整性，请开发者酌情使用！</b>
<br>
<b>提示：内置数据源中暂无香港特别行政区、澳门特别行政区和台湾省等地区的数据！</b>

```html
<div id="target"></div>

<script>
    iPicker.create("#target", {
    
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
    iPicker.create("#target", {
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
            // 因此，开发者可能需要给 code 参数设置一个默认值来获取 “省份” 数据（如示例代码中 code 为 null 时默认取零）
            source: code => $.get( "http://www.abcddcba.com/api/area/areaId=" + ( code || 0 ) )
        }
    });
</script>


<!-- 上面的示例代码使用了一个统一的地址返回数据 -->
<!-- 也可以传入第二个参数，根据此参数可分别设置 “省市区” 不同的数据源 -->
<script>
    iPicker.create("#target", {
        data: {
            source: function ( code, level ) {
                var data = "";

                // level 表示层级（范围 1-3 代表：省-市-区）
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
      [{
          code: "110000",
          name: "北京市"
      }]
    - 可以通过设置 props 来自定义属性名
-->
<script>
    iPicker.create("#target", {
        data: {
            props: {
                code: "areaId",
                name: "areaName"
            },
            source: code => $.get( "http://www.abcddcba.com/api/area/areaId=" + ( code || 0 ) )
        }
    });
</script>
```













<h4 id="c">可选主题模式</h4>

```javascript
// select 模式
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    theme: "select"
});

// cascader 模式
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    theme: "cascader"
});

// panel 模式
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    theme: "panel"
});
```
















<h4 id="d">设置默认选中值</h4>

```javascript
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    selected: [ "230000", "230100", "230103" ],
    selectedCallback: () => console.log( "默认值设置成功" )
});
```

















<h4 id="e">监听选中项的变化</h4>

```javascript
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    onSelect: ( code, name, all ) => {
            
        // 返回参数均为数组形式
        console.log( code );
        console.log( name );
        console.log( all );
    }
});
```















<h4 id="g">自定义显示层级</h4>

```javascript
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    level: 2
});
```



















<h4 id="h">默认禁用层级</h4>

```javascript
// 禁用全部层级
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabled: true
});

// 禁用指定层级，仅限 select 主题模式下
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabled: [ 2, 3 ]
});
```












<h4 id="i">默认禁用地区</h4>

```javascript
// 禁用全部地区
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabledItem: true
});

// 禁用指定地区
iPicker.create("#target", {
    data: {
        source: $.getJSON( "area.json" )
    },
    disabledItem: [ "230000", "230100", "230103" ]
});
```










<h2 id="i">组件方法</h2>

<b>iPicker 提供了 10 个方法：</b>

```javascript
// 创建组件
const picker = iPicker.create( "#target", { ... } );

// 创建组件（简写）
const picker = iPicker( "#target", { ... } );

// 设置选中项
iPicker.set( picker, [ "230000", "230100", "230103" ] );

// 获取选中项（前两种等效）
iPicker.get( picker );

iPicker.get( picker, "code" );

iPicker.get( picker, "name" );

iPicker.get( picker, "all" );

// 清空选中项
iPicker.clear( picker );

// 重置（恢复初始状态）
iPicker.reset( picker );

// 销毁组件
iPicker.destroy( picker );

// 启用所有层级
iPicker.enabled( picker, true );

// 启用指定层级，范围：1 - 3，仅限 select 主题模式下
iPicker.enabled( picker, [ 2, 3 ] );

iPicker.enabled( picker, 3 );

// 禁用所有层级
iPicker.disabled( picker, true );

// 禁用指定层级，范围：1 - 3，仅限 select 主题模式下
iPicker.disabled( picker, [ 2, 3 ] );

iPicker.disabled( picker, 3 );

// 启用地区
iPicker.enabledItem( picker, true );

// 启用指定地区
iPicker.enabledItem( picker, [ "230000" ] );

// 禁用所有地区
iPicker.disabledItem( picker, true );

// 禁用指定地区
iPicker.disabledItem( picker, [ "230000" ] );
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
        <td>主题模式，可选值：select、cascader、panel</td>
        <td>String</td>
        <td>select</td>
    </tr>
    <tr>
        <td>data</td>
        <td>设置数据源，共有三个属性：
            <br> <span>1. props：数据属性映射（仅能用于自定义数据源）</span>
            <br> <span>2. source：数据源类型（Promise 类型表示使用本地数据源；Function 类型表示使用自定义数据源）</span>
            <br> <span>3. when：数据源加载成功后执行的函数，可对数据进行最后的处理（若设置了此函数，则一定要在函数中返回处理</span>
            <br> <span><i style="opacity:0;pointer-events:none;">3. when：</i>过的数据，函数有两个参数：原始数据和数据对应的层级，层级只在自定义数据源时有用）</span> </td>
        <td>Object</td>
        <td> {
            <br> &nbsp;&nbsp;&nbsp;&nbsp;props: {
            <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code: "code",
            <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: "name"
            <br> &nbsp;&nbsp;&nbsp;&nbsp;},
            <br> &nbsp;&nbsp;&nbsp;&nbsp;source: null,
            <br> &nbsp;&nbsp;&nbsp;&nbsp;when: null
            <br> } </td>
    </tr>
    <tr>
        <td>level</td>
        <td>展示的层级，可选值：1、2、3</td>
        <td>Number</td>
        <td>3</td>
    </tr>
    <tr>
        <td>width</td>
        <td>展示框的宽度，可设置为 Number 类型，单位：px，也可设置为百分比</td>
        <td>Number / String</td>
        <td>200</td>
    </tr>
    <tr>
        <td>height</td>
        <td>展示框的高度，单位：px</td>
        <td>Number</td>
        <td>34</td>
    </tr>
    <tr>
        <td>radius</td>
        <td>展示框和下拉列表的圆角值，单位：px</td>
        <td>Number</td>
        <td>2</td>
    </tr>
    <tr>
        <td>maxHeight</td>
        <td>下拉列表的最大高度，单位：px</td>
        <td>Number</td>
        <td>300</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>禁用层级，设置为 true 则禁用所有层级，设置为 Number 或 Array 则禁用指定层级</td>
        <td>Boolean / Number / Array</td>
        <td>[]</td>
    </tr>
    <tr>
        <td>disabledItem</td>
        <td>禁用指定的地区，设置为 true 则禁用所有地区，设置为 Array 则禁用指定地区（传入行政编码）</td>
        <td>Boolean / Array</td>
        <td>[]</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>默认值（传入行政编码）</td>
        <td>Array</td>
        <td>[]</td>
    </tr>
    <tr>
        <td>selectedCallback</td>
        <td>成功设置了默认值后执行的函数，主要应用于自定义数据源的情况（因为自定义数据源是异步获取数据）</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>展示框的默认提示文字，select 主题下是 Array 类型，cascader 和 panel 主题下是 String 类型</td>
        <td>Array / String</td>
        <td>[ "省", "市", "区" ]</td>
    </tr>
    <tr>
        <td>separator</td>
        <td>cascader 和 panel 主题下，展示结果中的文字分隔符</td>
        <td>String</td>
        <td>/</td>
    </tr>
    <tr>
        <td>onlyShowLastLevel</td>
        <td>cascader 和 panel 主题下，在展示框中只显示选中结果的最后一级数据</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>clearable</td>
        <td>在展示框右侧显示清空按钮（鼠标悬浮在展示框上时显示）</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>strict</td>
        <td>严格模式</td>
        <td>Boolean</td>
        <td>false</td>
    </tr>
    <tr>
        <td>icon</td>
        <td>展示框末端的图标，可选值：triangle、arrow</td>
        <td>String</td>
        <td>triangle</td>
    </tr>
    <tr>
        <td>onClear</td>
        <td>点击清空按钮时执行的函数</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
    <tr>
        <td>onSelect</td>
        <td>选中地区时执行的函数，有三个参数：行政编码、地区名称、编码与名称的集合体</td>
        <td>Function</td>
        <td>空函数</td>
    </tr>
</table>

<hr/>

<h2 id="k">开源协议</h2>
<p><a href="https://gitee.com/dreamer365/iPicker/blob/master/LICENSE">MIT License</a></p>

<hr/>

<h2 id="l">浏览器支持</h2>


| Chrome | Firefox | Opera | Edge | Safari | IE  |
| ---    | ---     | ---   | ---  | ---    | --- |
| 60+    | 60+     | 60+   | 17+  | 12+    | 不支持 |

