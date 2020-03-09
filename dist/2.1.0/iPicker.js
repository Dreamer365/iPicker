/*!
 * iPicker v2.1.0
 * Copyright (C) 2020, ZG
 * Released under the MIT license.
 */
!(function ( global, factory ) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
    typeof define === "function" && define.amd ? define( factory ) :
    ( global = global || self, global.iPicker = factory() );
})( typeof window !== "undefined" ? window : this, function ( global ) {

    "use strict";

    var document = window.document;
    var $head = document.head;

    // 工具
    var _ = {
        type: function ( obj ) {
            return {}.toString.call( obj ).replace( /(\[object |\])/g, "" ).toLowerCase();
        },
        isObj: function ( obj ) {
            return !!( _.type( obj ) === "object" && Object.keys( obj ).length );
        },
        isNum: function ( num ) {
            return _.type( num ) === "number";
        },
        isFunc: function ( fn ) {
            return _.type( fn ) === "function";
        },
        random: function () {
            return Math.random().toString( 36 ).substr( 2, 10 );
        },
        merge: function ( param, defaults ) {
            var obj = {};
            for ( var key in defaults ) {
                var v = param[ key ];
                obj[ key ] = v === 0 ? v : v || defaults[ key ];
            }
            return obj;
        },
        getElem: function ( elem ) {
            return typeof elem === "string" ? $$( elem ) : ( elem.length ? elem : [ elem ] );
        },
        classFn: function ( elem, className, type ) {
            if ( type === "contains" ) {
                return elem.classList[ type ]( className );
            }
            _.getElem( elem ).forEach(function ( el ) {
                className.split( " " ).forEach(function ( cls ) {
                    el.classList[ type ]( cls );
                })
            })
        },
        toggleClass: function ( elem, className ) {
            _.classFn( elem, className, "toggle" );
        },
        addClass: function ( elem, className ) {
            _.classFn( elem, className, "add" );
        },
        removeClass: function ( elem, className ) {
            _.classFn( elem, className, "remove" );
        },
        hasClass: function ( elem, className ) {
            return _.classFn( elem, className, "contains" );
        },
        setCSS: function ( elem, obj ) {
            _.getElem( elem ).forEach(function ( el ) {
                for ( var key in obj ) {
                    el.style[ key ] = obj[ key ];
                }
            })
        },
        getCSS: function ( elem, name ) {
            return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( name );
        }
    };

    // 获取 DOM
    var $ = function ( selector, context ) {
        return ( context || document ).querySelector( selector );
    }
    var $$ = function ( selector, context ) {
        return [].slice.call( ( context || document ).querySelectorAll( selector ) );
    }

    // 默认配置
    var defaults = {
        theme: "select",
        data: {},
        level: 2,
        width: 200,
        maxHeight: 300,
        disabled: false,
        selected: [],
        activeColor: "#00b8ff",
        placeholder: [ "省", "市", "区" ],
        onSelect: function () {}
    };

    // 存储 iPicker
    var cachePicker = {};

    // 创建 iPicker
    var iPicker = function ( target, options ) {

        // 随机 ID
        var ID = "picker_" + _.random();

        // 获取目标容器
        var $target = $$( target );

        // 参数合法性检测
    	if ( 
            !target || 
            !options || 
            !$target.length || 
            !_.isObj( options ) ||
            typeof options.data !== "object"
        ) {
            return;
        }

        // 合并参数
        var opt = _.merge( options || {}, defaults );

        var selectTheme = opt.theme === "select",
            cascaderTheme = opt.theme === "cascader";
        var onSelectIsFunc = _.isFunc( opt.onSelect );
     
        // 生成组件
        var picker = "";
        if ( _.isNum( opt.level ) && opt.level >= 0 && opt.level < 3 ) {
            var tmpl = '\
                <div class="iPicker-container">\
                    <div class="iPicker-result">\
                        <input type="text" readonly autocomplete="off" spellcheck="false">\
                        <i></i>\
                    </div>\
                    <div class="iPicker-list">\
                        <ul></ul>\
                    </div>\
                </div>\
            ';
            if ( selectTheme ) {
                for ( var i = 0; i < parseInt( opt.level ) + 1; i++ ) {
                    picker += tmpl;
                }
            }
            if ( cascaderTheme ) {
                picker = tmpl;
            }
        } else {
            return;
        }

        // 关闭列表
        function closeList ( elem ) {
            _.getElem( elem ).forEach(function ( el ) {
                if ( el.classList.contains( "iPicker-list-show" ) ) {
                    el.classList.add( "iPicker-list-hide" );
                    el.classList.remove( "iPicker-list-show" );
                    el.previousElementSibling.classList.remove( "iPicker-result-active" );
                }
            })
        }

        // 添加 style
        var $style = $( "#iPicker-style" );
        if ( $style ) {
            $head.removeChild( $style );
        }
        $head.insertAdjacentHTML( "afterbegin", '<style id="iPicker-style">.iPicker-container,.iPicker-container *{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent}.iPicker-container *{margin:0;padding:0}.iPicker-container{position:relative;float:left;width:200px;height:34px;font-size:14px;cursor:pointer}.iPicker-container:not(:last-child){margin-right:10px}.iPicker-result{overflow:hidden;height:34px;border:#dfdfdf solid 1px;border-radius:4px;background:#fff;color:#000;white-space:nowrap;transition:border-color .2s}.iPicker-result input{pointer-events:none;width:100%;cursor:pointer;display:block;height:32px;background-color:#fff;border:none;outline:0;padding:0 30px 0 12px}.iPicker-result-active:not(.iPicker-disabled),.iPicker-result:not(.iPicker-disabled):hover{border:' + defaults.activeColor + ' solid 1px}.iPicker-result i{position:absolute;top:0;right:0;display:block;width:30px;height:34px}.iPicker-result i::before{position:absolute;top:0;right:2px;display:block;width:28px;height:100%;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2OTk1MjQ3Njc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUzNS40NjY2NjcgODEyLjhsNDUwLjEzMzMzMy01NjMuMmMxNC45MzMzMzMtMTkuMiAyLjEzMzMzMy00OS4wNjY2NjctMjMuNDY2NjY3LTQ5LjA2NjY2N0g2MS44NjY2NjdjLTI1LjYgMC0zOC40IDI5Ljg2NjY2Ny0yMy40NjY2NjcgNDkuMDY2NjY3bDQ1MC4xMzMzMzMgNTYzLjJjMTIuOCAxNC45MzMzMzMgMzQuMTMzMzMzIDE0LjkzMzMzMyA0Ni45MzMzMzQgMHoiIHAtaWQ9IjI2NTEiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=) center no-repeat;content:"";opacity:.5;transition:transform .3s;transform:scale(.55)}.iPicker-result-active i::before{transform:scale(.55) rotate(180deg)}.iPicker-disabled{cursor:not-allowed;background:#e7e7e7;color:#898989}.iPicker-disabled input{background:#e7e7e7;color:#898989}.iPicker-result.iPicker-disabled i{opacity:.5}.iPicker-list{position:relative;z-index:10;display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;padding:8px 0;background:#fff;box-shadow:rgba(0,0,0,.1) 0 2px 6px;transform-origin:center top;animation-timing-function:ease-in-out;animation-duration:.3s;animation-fill-mode:forwards}.iPicker-container:not(.iPicker-cascader) .iPicker-list{max-height:300px}.iPicker-cascader .iPicker-list{overflow-y:hidden;padding:0}.iPicker-list li,.iPicker-list ul{width:100%;display:block;margin:0;padding:0}.iPicker-list ul{float:left}.iPicker-cascader ul{width:200px;overflow-y:auto;overscroll-behavior:contain;padding:8px 0}.iPicker-cascader ul:not(:last-child){border-right:#e6e6e6 solid 1px}.iPicker-list li{position:relative;display:block;padding:6px 12px;list-style:none;transition:.15s;overflow:hidden;clear:both;word-break:break-all}.iPicker-list li *{pointer-events:none}.iPicker-list li span{display:block;float:left}.iPicker-list li i{display:block;position:absolute;top:50%;right:10px;width:8px;height:8px;margin-top:-4px;border-top:#666 solid 1px;border-right:#bbb solid 1px;transform:scale(.8) rotate(45deg)}.iPicker-list li.iPicker-list-active,.iPicker-list li:hover{background:#f5f5f5;color:' + defaults.activeColor + '}.iPicker-list-active{cursor:default}.iPicker-list.iPicker-list-hide,.iPicker-list.iPicker-list-show{display:block}.iPicker-list.iPicker-list-show{animation-name:iPickerShow}.iPicker-list.iPicker-list-hide{animation-name:iPickerHide}@keyframes iPickerShow{from{opacity:0;transform:scaleY(0)}to{opacity:1;transform:scaleY(1)}}@keyframes iPickerHide{from{opacity:1;transform:scaleY(1)}to{opacity:0;transform:scaleY(0)}}</style>' );

        // onSelect 事件可执行的标记
        var onSelectFlag = true;

        var targetID = _.random();

        // 如果自定义了 activeColor
        // 动态添加对应的 <style>
        if ( opt.activeColor !== defaults.activeColor ) {
            $( "style", $head ).insertAdjacentHTML( "afterend", '<style id="iPicker-style-' + targetID + '" class="iPicker-style-custom">.iPicker-container[data-id-' + targetID + '] .iPicker-result-active:not(.iPicker-disabled),.iPicker-container[data-id-' + targetID + '] .iPicker-result:not(.iPicker-disabled):hover{border-color:' + opt.activeColor + '}.iPicker-container[data-id-' + targetID + '] .iPicker-list li.iPicker-list-active,.iPicker-container[data-id-' + targetID + '] .iPicker-list li:hover{color:' + opt.activeColor + '}</style>' );
        }

        $target.forEach(function ( $el ) {

            // 添加组件并存储配置
            $el.innerHTML = picker;
            $el.iPickerOptions = opt;
            $el.cacheTarget = target;

            // 获取基本元素
            var $container = $$( ".iPicker-container", $el ),
                $result = $$( ".iPicker-result", $el ),
                $input = $$( "input", $el ),
                $list = $$( ".iPicker-list", $el );

            $container.forEach(function ( container, index ) {

                // 添加索引标记
                container.dataset.index = index;

                // 如果自定义了 activeColor 则需要添加唯一标识
                if ( opt.activeColor !== defaults.activeColor ) {
                    container.setAttribute( "data-id-" + targetID, "" );
                }
            })

            // cascader 主题添加类
            if ( cascaderTheme ) {
                _.addClass( $container, "iPicker-cascader" );
            }

            // 列表最大高度 ( >= 46 )
            var maxHeight = 0;
            if ( _.isNum( opt.maxHeight ) ) {
                maxHeight = ( opt.maxHeight >= 46 ? parseInt( opt.maxHeight ) : 46 ) + "px";
                if ( selectTheme ) {
                    _.setCSS($list, {
                        maxHeight: maxHeight
                    });
                }
            }

            // 选择框宽度 ( >= 90 )
            if ( _.isNum( opt.width ) ) {
                _.setCSS($container, {
                    width: ( opt.width >= 90 ? parseInt( opt.width ) : 90 ) + "px"
                });
            }

            // 禁用指定的选择框
            if ( opt.disabled ) {
                var arr = [];
                if ( opt.disabled === true ) {
                    arr = [ 0, 1, 2 ];
                } else if ( Array.isArray( opt.disabled ) && opt.disabled.length ) {
                    arr = opt.disabled;
                }
                arr.forEach(function ( level ) {
                    if ( level >= 0 && level <= 2 ) {
                        $result.forEach(function ( result, index ) {
                            if ( index === level ) {
                                _.addClass( result, "iPicker-disabled" );
                            }
                        })
                    }
                })
            }

            // 设置 placeholder
            if ( selectTheme && Array.isArray( opt.placeholder ) && opt.placeholder.length ) {
                opt.placeholder.forEach(function ( v, i ) {
                    if ( $input[ i ] ) {
                        $input[ i ].setAttribute( "placeholder", opt.placeholder[ i ] );
                    }
                })
            }
            if ( cascaderTheme ) {
                if ( typeof opt.placeholder !== "string" ) {
                    opt.placeholder = "请选择地区";
                }
                $input[ 0 ].setAttribute( "placeholder", opt.placeholder );
            }

            // 给列表添加标识
            $list.forEach(function ( list ) {
                list.dataset.id = _.random();
            })

            $result.forEach(function ( result ) {
                result.addEventListener("click", function () {
                    var $next = result.nextElementSibling;

                    // 关闭其它列表
                    closeList( '.iPicker-list:not([data-id="' + $next.dataset.id + '"])' );
                        
                    if ( !_.hasClass( result, "iPicker-disabled" ) ) {

                        // 切换 active 状态
                        _.toggleClass( result, "iPicker-result-active" );

                        // 根据列表状态进行 [ 开关 ] 操作
                        if ( _.hasClass( $next, "iPicker-list-show" ) ) {
                            closeList( $next );
                        } else {
                            _.addClass( $next, "iPicker-list-show" );
                            _.removeClass( $next, "iPicker-list-hide" );
                        }
                    }
                })
            })

            // cascader 主题
            if ( cascaderTheme ) {
                var $firstUL = $( "ul", $list[ 0 ] );
                var ulWidth = _.getCSS( $firstUL, "width" );
                if ( maxHeight ) {

                    // 向第一级列表添加最大高度
                    _.setCSS($firstUL, {
                        maxHeight: maxHeight
                    });
                }

                // 像列表添加宽度
                _.setCSS($list[ 0 ], {
                    width: ulWidth
                });

                var text, value;

                $el.onclick = null;
                $list[ 0 ].addEventListener("click", function ( event ) {
                    var $li = event.target;
                    if ( $li.nodeName.toLowerCase() === "li" ) {
                        var $ul = $li.parentNode;
                        var code = $li.dataset.code;
                        if ( $ul.nextElementSibling ) {

                            // 移除当前列表后面的所有列表
                            !(function removeNextList () {
                                var $nextList = $ul.nextElementSibling;
                                if ( $nextList ) {
                                    $list[ 0 ].removeChild( $nextList );
                                    if ( $ul.nextElementSibling ) {
                                        removeNextList();
                                    }
                                }
                            })();
                        }

                        if ( $$( "ul", $list[ 0 ] ).length < opt.level + 1 ) {
                            
                            // 向当前列表后面添加新列表
                            // 并重新计算 list 宽度
                            $list[ 0 ].insertAdjacentHTML( "beforeend", '<ul>' + addData( code ) + '</ul>' );
                            var $allUL = $$( "ul", $list[ 0 ] );
                            _.setCSS($list[ 0 ], {
                                width: $allUL.length * parseInt( ulWidth ) + "px"
                            });

                            // 向新列表添加高度限制
                            if ( maxHeight ) {
                                _.setCSS($allUL, {
                                    minHeight: maxHeight,
                                    maxHeight: maxHeight
                                });
                            }

                            // 移除最后一级列表的箭头
                            if ( $$( "ul", $list[ 0 ] ).length === opt.level + 1 ) {
                                $$( "i", $( "ul:last-child", $list[ 0 ] ) ).forEach(function ( i ) {
                                    i.parentNode.removeChild( i );
                                })
                            }
                        } else {

                            // 如果点击的是最后一个列表
                            // 则自动关闭全部列表
                            closeList( $list );
                        }

                        // 选中项高亮显示
                        _.removeClass( $$( "li", $ul ), "iPicker-list-active" );
                        _.addClass( $li, "iPicker-list-active" );

                        // 获取值
                        text = [];
                        value = [];
                        $$( ".iPicker-list-active", $list[ 0 ] ).forEach(function ( active ) {
                            var _text = $( "span", active ).innerText,
                                _code = active.dataset.code;
                            text.push( _text );
                            value.push( _code );
                            $input[ 0 ].value = text.join( " / " );
                        })

                        // 构建 value && text 集合
                        var set = [];
                        value.forEach(function ( v, i ) {
                            set.push({
                                code: v,
                                name: text[ i ]
                            });
                        })

                        $result[ 0 ].selected = {
                            code: value,
                            name: text,
                            all: set
                        };

                        // onSelect 事件
                        if ( onSelectIsFunc && onSelectFlag ) {
                            opt.onSelect.call( $li, value, text, set );
                        }
                    }
                })
            }

            // 默认主题
            if ( selectTheme ) {
                $el.onclick = function ( event ) {
                    var $li = event.target;
                    if ( $li.nodeName.toLowerCase() === "li" ) {
                        var $thisList = $li.parentNode.parentNode,
                            $thisContainer = $thisList.parentNode;

                        // 选中项高亮显示
                        _.removeClass( $$( "li", $li.parentNode ), "iPicker-list-active" );
                        _.addClass( $li, "iPicker-list-active" );

                        var $prev = $thisList.previousElementSibling;

                        // 存储选中结果
                        // 显示选中内容
                        $prev.selected = {
                            code: $li.dataset.code,
                            name: $li.innerText
                        }
                        $( "input", $prev ).value = $li.innerText;

                        // 关闭列表
                        closeList( $thisList );

                        // 清空后面列表的内容和选中值
                        $container.forEach(function ( container, index ) {
                            if ( index > $thisContainer.dataset.index ) {
                                $( ".iPicker-result", container ).selected = undefined;
                                $( "input", container ).value = "";
                                $( "ul", container ).innerHTML = "";
                            }
                        })

                        // 向后一个列表添加 list
                        var $nextContainer = $thisContainer.nextElementSibling;
                        if ( $nextContainer ) {

                            // 加入延时防止后续列表的滚动条不能回顶
                            var delayRenderTimer = window.setTimeout(function () {
                                window.clearTimeout( delayRenderTimer );
                                $( "ul", $nextContainer ).innerHTML = addData( $li.dataset.code );
                            }, 0);
                        }

                        // onSelect 事件
                        if ( onSelectIsFunc && onSelectFlag ) {
                            var v = [],
                                t = [];

                            // 统计所有选中项的 value 和 text
                            $result.forEach(function ( result ) {
                                var data = result.selected || {},
                                    value = data.code,
                                    text = data.name;
                                value && v.push( value );
                                text && t.push( text );
                            })

                            // 构建 value && text 集合
                            var set = [];
                            v.forEach(function ( _v, _i ) {
                                set.push({
                                    code: _v,
                                    name: t[ _i ]
                                });
                            })

                            // 执行 onSelect 事件
                            opt.onSelect.call( $li, v, t, set );
                        }
                    }
                }
            }

            // 添加数据
            var cacheData = null;
            function getData ( callback ) {
                if ( cacheData ) {
                    callback();
                } else {
                    if ( _.isFunc( opt.data.then ) ) {
                        opt.data.then(function ( response ) {
                            cacheData = response;
                            callback( cacheData );
                        })
                    } else {
                        cacheData = opt.data;
                        callback( cacheData );
                    }
                }
            }
            function addData ( code, callback ) {
                var list = "";
                if ( cacheData ) {
                    return buildList();
                } else {
                    getData(function ( json ) {
                        callback && callback( buildList() );
                    })
                }
                function buildList () {
                    if ( cacheData[ code ] ) {
                        for ( var key in cacheData[ code ] ) {
                            list += 
                                '<li data-code="' + key + '" data-name="' + cacheData[ code ][ key ] + '">' +
                                    '<span>' + cacheData[ code ][ key ] + '</span>' + 
                                    ( opt.theme === "cascader" ? '<i></i>' : '' ) +
                                '</li>';
                        }
                    }
                    return list;
                }
            }

            // 自动向第一级列表添加数据
            addData("86", function ( list ) {
                $( "ul", $list[ 0 ] ).innerHTML = list;
            })
            if ( cascaderTheme && opt.level === 0 ) {
                $$( "i", $list[ 0 ] ).forEach(function ( i ) {
                    i.parentNode.removeChild( i );
                })
            }

            // 默认选中
            getData(function () {
                if ( Array.isArray( opt.selected ) && opt.selected.length ) {
                    var timer = null;
                    function selectedTrigger () {
                        (function trigger ( i ) {
                            window.clearTimeout( timer );
                            onSelectFlag = false;
                            if ( i !== opt.selected.length ) {
                                var li = '[data-' + ( opt.selected[ i ].match( /\d/ ) ? "code" : "name" ) + '="' + opt.selected[ i ] + '"]';
                                $( li, $el ).click();
                                i++;
                                onSelectFlag = true;
                                window.setTimeout( trigger, 0, i );
                            } else {
                                onSelectFlag = true;
                            }
                        })( 0 );
                    }
                    selectedTrigger();
                    $el.cacheTrigger = selectedTrigger;
                }
            })

            // 点击空白处隐藏列表
            document.addEventListener("click", function ( event ) {
                $container.forEach(function ( container, i ) {
                    if ( event.target !== container && !container.contains( event.target ) ) {
                        closeList( $list[ i ] ); 
                    }
                })
            })
        })

        cachePicker[ ID ] = $target;
        return ID;
    }

    // 获取选中结果
    iPicker.get = function ( id, type ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        function get ( type ) {
            var result = [];
            var $picker = $target[ 0 ],
                $result = $$( ".iPicker-result", $picker );

            // 默认主题
            if ( !$( ".iPicker-cascader", $picker ) ) {
                $result.forEach(function ( _result ) {
                    var selected = _result.selected || {};
                    if ( type !== "all" ) {
                        result.push( selected[ type ] );
                    } else {
                        result.push({
                            code: selected.code,
                            name: selected.name
                        });
                    }
                })
            } else {

                // cascader 主题
                var selected = $result[ 0 ].selected || {};
                result = selected[ type !== "all" ? type : "all" ];
            }

            return ( result || [] ).filter(function ( v ) {
                if ( typeof v === "object" ) {
                    return v.code && v.name && v;
                }
                return v;
            });
        }
        if ( !type || type === "code" ) {
            return get( "code" );
        }
        if ( type === "name" ) {
            return get( "name" );
        }
        if ( type === "all" ) {
            return get( "all" );
        }
    }

    // 清空选择
    iPicker.clear = function ( id ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        $target.forEach(function ( el ) {
            $$( ".iPicker-result", el ).forEach(function ( result ) {
                result.selected = undefined;
            })
            $$( "input", el ).forEach(function ( input ) {
                input.value = "";
            })
            $$( ".iPicker-list-active", el ).forEach(function ( active ) {
                _.removeClass( active, "iPicker-list-active" );
            })
            $$( ".iPicker-container", el ).forEach(function ( container, index ) {
                if ( index ) {
                    $( "ul", container ).innerHTML = "";
                }
            })
            
            // cascader 主题
            if ( $( ".iPicker-cascader", el ) ) {
                $$( "ul", el ).forEach(function ( ul, index ) {
                    if ( index ) {
                        ul.parentNode.removeChild( ul );
                    }
                })
                _.setCSS($( ".iPicker-list", el ), {
                    width: _.getCSS( $( "ul", el ), "width" )
                });
            }
        })
    }

    // 重置组件
    iPicker.reset = function ( id ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        $target.forEach(function ( el ) {
            if ( el.cacheTrigger ) {
                el.cacheTrigger();
            } else {
                iPicker.clear( id );
            }
        })
    }

    // 销毁组件
    iPicker.destroy = function ( id ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        $target.forEach(function ( el ) {
            el.innerHTML = "";
            delete el.iPickerOptions;
            delete el.cacheTarget;
            delete el.cacheTrigger;
        })
        delete cachePicker[ id ];
        if ( !$( ".iPicker-container" ) ) {
            $$( "#iPicker-style, .iPicker-style-custom" ).forEach(function ( style ) {
                $head.removeChild( style );
            })
        }
    }

    // 启用组件
    iPicker.enabled = function ( id, levelArray ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        $target.forEach(function ( el ) {
            var $disabled = $$( ".iPicker-disabled", el );
            if ( $disabled.length ) {
                if ( !levelArray || $( ".iPicker-cascader", el ) ) {
                    _.removeClass( $disabled, "iPicker-disabled" );
                } else {
                    if ( Array.isArray( levelArray ) && levelArray.length ) {
                        levelArray.forEach(function ( v ) {
                            if ( v >= 0 && v <= 2 ) {
                                _.removeClass( $disabled[ v ], "iPicker-disabled" );
                            }
                        })
                    }
                }
            }
        })
    }

    // 禁用组件
    iPicker.disabled = function ( id, levelArray ) {
        var $target = cachePicker[ id ];
        if ( !id || !$target ) {
            return;
        }
        $target.forEach(function ( el ) {
            var $result = $$( ".iPicker-result", el );
            if ( $result.length ) {
                if ( !levelArray || $( ".iPicker-cascader", el ) ) {
                    _.addClass( $result, "iPicker-disabled" );
                } else {
                    if ( Array.isArray( levelArray ) && levelArray.length ) {
                        levelArray.forEach(function ( v ) {
                            if ( v >= 0 && v <= 2 ) {
                                _.addClass( $result[ v ], "iPicker-disabled" );
                            }
                        })
                    }
                }
            }
        })
    }

    return iPicker;

});
