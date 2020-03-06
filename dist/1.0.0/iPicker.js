/*!
 * iPicker v1.0.0
 * Copyright (C) 2020, ZG
 * Released under the MIT license.
 */
!(function ( global, factory ) {

    if ( typeof define === "function" && define.amd ) { 
        define([ "jquery" ], function ( jQuery ) { 
            return factory( global, jQuery ) 
        });
    } else if ( typeof module !== "undefined" && typeof exports === "object" ) {
        factory( global, require( "jquery" ) );
    } else {
        factory( global, global.jQuery );
    }

})( typeof window !== "undefined" ? window : this, function ( window, $ ) {

    // 检测 jQuery (1.9.0+)
    !(function checkjQuery () {
        if ( typeof jQuery === "undefined" ) {
            throw new Error( "iPicker's JavaScript requires jQuery" );
        }
        var version = $.fn.jquery.split( "." );
        if ( ~~version[ 0 ] === 1 && ~~version[ 1 ] < 9 ) {
            throw new Error( "iPicker's JavaScript requires jQuery version 1.9.0 or higher" );
        }
    })();

    // 添加样式
    $( 'style[data-from="iPicker"]' ).remove();
    $( "head" ).prepend( '<style data-from="iPicker">.iPicker-container,.iPicker-container *{box-sizing:border-box}.iPicker-container{position:relative;float:left;width:200px;height:34px;font-size:14px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.iPicker-container:not(:last-child){margin-right:10px}.iPicker-result{overflow:hidden;padding:0 40px 0 12px;height:34px;border:#dfdfdf solid 1px;border-radius:4px;background:#fff;color:#000;white-space:nowrap;line-height:32px;transition:border-color .2s}.iPicker-result span{display:block;float:left;width:calc(100% + 10px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.iPicker-result-active:not(.iPicker-disabled),.iPicker-result:not(.iPicker-disabled):hover{border:#00b8ff solid 1px}.iPicker-result i{position:absolute;top:0;right:0;display:block;width:30px;height:34px}.iPicker-result i::before{position:absolute;top:0;right:2px;display:block;width:28px;height:100%;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2OTk1MjQ3Njc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUzNS40NjY2NjcgODEyLjhsNDUwLjEzMzMzMy01NjMuMmMxNC45MzMzMzMtMTkuMiAyLjEzMzMzMy00OS4wNjY2NjctMjMuNDY2NjY3LTQ5LjA2NjY2N0g2MS44NjY2NjdjLTI1LjYgMC0zOC40IDI5Ljg2NjY2Ny0yMy40NjY2NjcgNDkuMDY2NjY3bDQ1MC4xMzMzMzMgNTYzLjJjMTIuOCAxNC45MzMzMzMgMzQuMTMzMzMzIDE0LjkzMzMzMyA0Ni45MzMzMzQgMHoiIHAtaWQ9IjI2NTEiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=) center no-repeat;content:"";opacity:.5;transition:transform .3s;transform:scale(.55)}.iPicker-result-active i::before{transform:scale(.55) rotate(180deg)}.iPicker-placeholder{color:#aaa}.iPicker-disabled{cursor:not-allowed;background:#f0f0f0;color:#aaa}.iPicker-result.iPicker-disabled i{opacity:.5}.iPicker-list{position:relative;z-index:10;display:none;overflow-x:hidden;overflow-y:auto;padding:8px 0;max-height:300px;background:#fff;box-shadow:rgba(0,0,0,.1) 0 2px 6px;transform-origin:center top;animation-timing-function:ease-in-out;animation-duration:.3s;animation-fill-mode:forwards}.iPicker-list li,.iPicker-list ul{display:block;margin:0;padding:0}.iPicker-list li{display:block;padding:6px 12px;list-style:none;transition:.15s;word-break:break-all}.iPicker-list li.iPicker-list-active,.iPicker-list li:hover{background:#f5f5f5;color:#00b8ff}.iPicker-list-active{cursor:default}.iPicker-list.iPicker-list-hide,.iPicker-list.iPicker-list-show{display:block}.iPicker-list.iPicker-list-show{animation-name:iPickerShow}.iPicker-list.iPicker-list-hide{animation-name:iPickerHide}@keyframes iPickerShow{from{opacity:0;transform:scaleY(0)}to{opacity:1;transform:scaleY(1)}}@keyframes iPickerHide{from{opacity:1;transform:scaleY(1)}to{opacity:0;transform:scaleY(0)}}</style>' );

    // 创建插件
    $.fn.iPicker = function ( options, levelArray ) {

        // 获取选中结果
        if ( !arguments.length ) {
            var result = [];
            $( this ).first().find( ".iPicker-result" ).each(function () {
                var value = ( $( this ).data( "selected" ) || {} ).value;
                value && result.push( value );
            });
            return result;
        }

        // 清空选择的结果
        if ( options === "clear" ) {
            return this.each(function () {
                $( this )
                    .find( ".iPicker-container:gt(0) ul" ).empty()
                    .end()
                    .find( "li" ).removeClass( "iPicker-list-active" )
                    .end()
                    .find( ".iPicker-result" ).addClass( "iPicker-placeholder" ).removeData( "selected" )
                    .find( "span" ).each(function () {
                        $( this ).text( $( this ).data( "placeholder" ) );
                    })
            })
        }

        // 重置 ( 恢复初始状态 )
        if ( options === "reset" ) {
            return this.each(function () {
                var opt = $( this ).data( "iPickerOptions" );
                if ( $.isPlainObject( opt ) && !$.isEmptyObject( opt ) ) {
                    $( this ).iPicker( opt );
                }
            })
        }

        // 销毁
        if ( options === "destroy" ) {
            return this.each(function () {
                $( this ).empty().removeData( "iPickerOptions" );
                $( document ).off( "click.iPicker" );
            })
        }

        // 解除禁用
        if ( options === "enabled" ) {
            return this.each(function () {
                var $disabled = $( this ).find( ".iPicker-disabled" );
                if ( !levelArray ) {
                    $disabled.removeClass( "iPicker-disabled" );
                } else {
                    if ( Array.isArray( levelArray ) && levelArray.length ) {
                        $.each(levelArray, function ( i, v ) {
                            $disabled.eq( v - 1 ).removeClass( "iPicker-disabled" );
                        })
                    }
                }
            })
        }

        // 设置
        if ( $.isPlainObject( options ) && options.data ) {

            // 默认配置
            var defaults = {
                data: {},
                level: 3,
                width: 200,
                maxHeight: 300,
                disabled: false,
                defaultValue: [],
                placeholder: [ "省", "市", "区" ],
                onSelect: $.noop
            };
            var opt = $.extend( true, defaults, options );
            var selectIsFunc = $.isFunction( opt.onSelect );

            // 生成组件
            var picker = "";
            if ( $.isNumeric( opt.level ) && opt.level >= 1 && opt.level < 4 ) {
                for ( var i = 0; i < parseInt( opt.level ); i++ ) {
                    picker += '\
                        <div class="iPicker-container">\
                            <div class="iPicker-result iPicker-placeholder">\
                                <span></span>\
                                <i></i>\
                            </div>\
                            <div class="iPicker-list">\
                                <ul></ul>\
                            </div>\
                        </div>\
                    ';
                }
            }

            // 获取数据
            var dfd = $.Deferred();
            function getData () {
                var errorText = "数据加载失败";

                // 传入字符串地址
                if ( typeof opt.data === "string" && $.trim( opt.data ) ) {
                    
                    // 调用 $.getJSON 方法获取数据
                    $.getJSON( opt.data ).done(function ( response ) {
                        response ? dfd.resolve( response ) : dfd.reject( errorText );
                    }).fail(function () {
                        dfd.reject( errorText );
                    })
                    
                } else if ( $.isPlainObject( opt.data ) && !$.isEmptyObject( opt.data ) ) {

                    // 直接传入 json 数据
                    dfd.resolve( opt.data );

                } else if ( typeof opt.data === "object" && opt.data.then ) {

                    // 传入 Promise
                    opt.data.then(function ( response ) {
                        response ? dfd.resolve( response ) : dfd.reject( errorText );
                    }, function () {
                        dfd.reject( errorText );
                    })
                    
                } else {
                    dfd.reject( errorText );
                }
                return dfd;
            }

            // 关闭列表
            function closeList ( $list ) {
                $list.each(function () {
                    var $this = $( this );
                    if ( $this.hasClass( "iPicker-list-show" ) ) {
                        $this
                            .off( "animationend" )
                            .prev().removeClass( "iPicker-result-active" )
                            .end().addClass( "iPicker-list-hide" ).removeClass( "iPicker-list-show" )
                            .on("animationend", function () {
                                $this.off( "animationend" );
                            })
                    }
                })
            }

            return this.each(function () {
                var $this = $( this );
                var set = [];

                // 添加组件并存储配置
                $this.html( picker ).data( "iPickerOptions", opt );

                // 获取基本元素
                var $container = $this.find( ".iPicker-container" ),
                    $result = $this.find( ".iPicker-result" ),
                    $list = $this.find( ".iPicker-list" );

                // 列表最大高度
                if ( $.isNumeric( opt.maxHeight ) && opt.maxHeight >= 46 ) {
                    $list.css( "maxHeight", parseInt( opt.maxHeight ) + "px" );
                }

                // 选择框宽度
                if ( $.isNumeric( opt.width ) && opt.width >= 90 ) {
                    $container.css( "width", parseInt( opt.width ) + "px" );
                }

                // 禁用选择框
                if ( opt.disabled ) {
                    var arr = [];
                    if ( opt.disabled === true ) {
                        arr = [ 0, 1, 2 ];
                    } else if ( Array.isArray( opt.disabled ) && opt.disabled.length ) {
                        arr = opt.disabled;
                    }
                    $.each(arr, function ( i, v ) {
                        if ( v >= 0 && v <= 2 ) {
                            $result.eq( v ).addClass( "iPicker-disabled" );
                        }
                    })
                }

                // 设置 placeholder
                if ( Array.isArray( opt.placeholder ) && opt.placeholder.length ) {
                    $result.find( "span" ).each(function ( i ) {
                        var placeholder = opt.placeholder[ i ] || "";
                        $( this ).data( "placeholder", placeholder ).text( placeholder );
                    })
                }

                // 给列表添加标识
                $list.each(function () {
                    $( this ).attr( "data-id", Math.random().toString( 36 ).substr( 2, 10 ) );
                });

                // 数据加载成功后执行程序
                getData().done(function ( response ) {
                    $result.on("click", function () { 
                        var $this = $( this ),
                            $next = $this.next();

                        var id = $next.data( "id" );

                        // 是否被禁用
                        var isDisabled = $this.hasClass( "iPicker-disabled" );

                        // 关闭其它所有列表
                        closeList( $( ".iPicker-list" ).not( '[data-id="' + id+ '"]' ) );
                        
                        if ( !isDisabled ) {

                            // 切换类
                            $this.toggleClass( "iPicker-result-active" );

                            // 根据列表状态进行 [ 开关 ] 操作
                            if ( $next.hasClass( "iPicker-list-show" ) ) {
                                closeList( $next );
                            } else {
                                $next.addClass( "iPicker-list-show" ).removeClass( "iPicker-list-hide" );
                            }
                        }
                    })

                    // 选择
                    $list.on("click.normal", "li", function () {
                        var $this = $( this ),
                            $thisList = $this.parents( ".iPicker-list" ),
                            $container = $this.parents( ".iPicker-container" );

                        // 选中项高亮显示
                        $this.addClass( "iPicker-list-active" ).siblings().removeClass( "iPicker-list-active" );

                        // 存储选中结果
                        // 显示选中内容
                        $thisList.prev().data("selected", {
                            value: $this.data( "code" ),
                            text: $this.text()
                        }).removeClass( "iPicker-placeholder" ).find( "span" ).text( $this.text() );

                        // 关闭列表
                        closeList( $thisList );

                        // 清空后面列表的内容和选中值
                        $container
                            .nextAll()
                            .find( ".iPicker-result" ).removeData( "selected" ).addClass( "iPicker-placeholder" )
                            .find( "span" ).each(function () {
                                $( this ).text( $( this ).data( "placeholder" ) );
                            })
                            .end()
                            .next()
                            .find( "ul" ).empty();
                        
                        // 向后一个列表添加 list
                        $container.next().find( "ul" ).html( addData( response, $this.data( "code" ) ) );
                        
                    }).on("click.select", "li", function () {

                        // onSelect 事件
                        if ( selectIsFunc ) {
                            var v = [],
                                t = [];

                            // 统计所有选中项的 value 和 text
                            $result.each(function () {
                                var data = $( this ).data( "selected" ) || {},
                                    value = data.value,
                                    text = data.text;
                                value && v.push( value );
                                text && t.push( text );
                            })

                            // 构建 value && text 集合
                            set = [];
                            $.each(v, function ( i, v ) {
                                set.push({
                                    value: i,
                                    text: v
                                });
                            })

                            // 执行 onSelect 事件
                            opt.onSelect.call( this,  v, t, set );
                        }
                    })

                    // 添加数据
                    function addData ( data, code ) {
                        var list = "";
                        if ( data ) {
                            data = typeof data === "string" ? JSON.parse( data ) : data;
                            if ( data[ code ] ) {
                                $.each(data[ code ], function ( i, v ) {
                                    list += '<li data-code="' + i + '">' + v + '</li>';
                                })
                            }
                        }
                        return list;
                    }

                    // 自动向第一级列表添加数据
                    $list.first().find( "ul" ).html( addData( response, "86" ) );

                    // 设置默认值
                    if ( Array.isArray( opt.defaultValue ) && opt.defaultValue.length ) {
                        $.each(opt.defaultValue, function ( i, v ) {
                            $list.eq( i ).find( '[data-code="' + v + '"]' ).trigger( "click.normal" );
                        })
                    }
                }).fail(function ( response ) {

                    // 当数据加载失败时
                    // 在控制台打印信息
                    console.warn( response );
                })

                // 点击空白处隐藏列表
                $( document ).on("click.iPicker", function ( event ) {
                    if ( !$container.is( event.target ) && !$container.has( event.target ).length ) {
                        closeList( $list );
                    }
                })
            })
        }
    }

});
