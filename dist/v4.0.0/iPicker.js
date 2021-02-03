/*!
 * iPicker v4.0.0
 * Copyright (C) 2020-2021, ZG
 * Released under the MIT license.
 */
!(( global, factory ) => {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
    typeof define === "function" && define.amd ? define( factory ) :
    ( global = global || self, global.iPicker = factory() );
})( typeof window !== "undefined" ? window : this, global => {

    "use strict";
    
    // 工具
    const Util = {

        // 检测类型
        type: obj => Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase(),

        // 不为空的纯对象
        isCorrectObject: obj => !!( Util.type( obj ) === "object" && Object.keys( obj ).length ),

        // 检测 > 0 或 >= 0 的安全整数
        isCorrectNumber: ( num, zero ) => !!( Number.isSafeInteger( num ) && ( !zero ? num > 0 : num >= 0 ) ),

        // 检测函数
        isFunction: func => Util.type( func ) === "function",

        // 创建唯一标识符
        uid ( useSymbol ) {
            const random = Math.random().toString( 36 ).substr( 2, 10 );
            return useSymbol ? Symbol( random ) : random;
        },

        // 定时器
        delayTimer ( delay = 0 ) {
            return new Promise(resolve => {
                const timer = window.setTimeout(() => {
                    window.clearTimeout( timer );
                    resolve();
                }, delay)
            })
        },

        // 合并参数
        mergeParam ( params = {}, defaults ) {
            const result = {};
            for ( const key in defaults ) {
                const v = params[ key ];
                if ( Util.type( v ) === "object" ) {
                    result[ key ] = Util.mergeParam( v, defaults[ key ] );
                } else {
                    result[ key ] = v === 0 ? v : ( v || defaults[ key ] );
                }
            }
            return result;
        }
    };
    
    // DOM 系统
    const $ = (() => {
        function buildDom ( domArray ) {
            const length = domArray[ 0 ] ? domArray.length : 0;
            this.length = length;
            for ( let i = 0; i < length; i++ ) {
                this[ i ] = domArray[ i ];
            }
            return this;
        }
        buildDom.prototype = {
            each ( callback ) {
                for ( let i = 0, j = this.length; i < j; i++ ) {
                    callback.call( this[ i ], i, this[ i ] );
                }
                return this;
            },
            get ( index = 0 ) {
                return this[ index ];
            },
            click ( callback ) {
                return this.each(function () {
                    this.addEventListener("click", function ( event ) {
                        callback.call( this, event );
                    })
                })
            },
            hasClass ( className ) {
                return this[ 0 ].classList.contains( className );
            },
            addClass ( className ) {
                return this.each(function () {
                    for ( const name of className.split( " " ) ) {
                        this.classList.add( name );
                    }
                })
            },
            removeClass ( className ) {
                return this.each(function () {
                    for ( const name of className.split( " " ) ) {
                        this.classList.remove( name );
                    }
                })
            },
            toggleClass ( className ) {
                return this.each(function () {
                    for ( const name of className.split( " " ) ) {
                        this.classList.toggle( name );
                    }
                })
            },
            css ( name, value ) {
                function getStyle ( elem, prop ) {
                    return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( prop );
                }
                function setStyle ( el, _name, _value ) {
                    el.style[ _name ] = _value;
                }
                return ( typeof name === "string" && !value ) ? 
                    getStyle( this[ 0 ], name ) : 
                    this.each(function () {
                        if ( name && value ) {
                            setStyle( this, name, value );
                        }
                        if ( Util.isCorrectObject( name ) && !value ) {
                            for ( const key in name ) {
                                setStyle( this, key, name[ key ] );
                            }
                        }
                    })
            },
            html ( html ) {
                return this.each(function () {
                    this.innerHTML = html;
                })
            },
            text ( text ) {
                return this[ 0 ].textContent;
            },
            val ( val ) {
                return this.each(function () {
                    this.value = val;
                })
            },
            eq ( index ) {
                if ( typeof index === "number" ) {
                    const eqArr = [];
                    if ( index < this.length ) {
                        eqArr.push( this[ index ] );    
                    }
                    return $( eqArr );
                }
            },
            index () {
                if ( this[ 0 ] ) {
                    let child = this[ 0 ];
                    let i = 0;
                    while ( ( child = child.previousSibling ) !== null ) {
                        child.nodeType === 1 && i++;
                    }
                    return i;
                }
            },
            prev () {
                const prevArr = [];
                this.each(function () {
                    const p = this.previousElementSibling;
                    p && prevArr.push( p );
                })
                return $( prevArr );
            },
            next () {
                const nextArr = [];
                this.each(function () {
                    const n = this.nextElementSibling;
                    n && nextArr.push( n );
                })
                return $( nextArr );
            },
            nextAll () {
                const nextAll = [];
                this.each(function () {
                    let next = this.nextElementSibling; 
                    function findNext () {
                        if ( next ) {
                            nextAll.push( next ); 
                            next = $( next ).get().nextElementSibling;
                            findNext();
                        }
                    }
                    findNext();
                });
                return $( nextAll );
            },
            parent () {
                const parentArr = [];
                this.each(function () {
                    parentArr.push( this.parentNode );
                })
                return $( parentArr );
            },
            find ( dom ) {
                const findArr = [];
                this.each(function () {
                    const node = this.querySelectorAll( dom );
                    for ( var i = 0, j = node.length; i < j; i++ ) {
                        ( node[ i ].nodeType === 1 ) && findArr.push( node[ i ] );
                    }
                })
                return $( findArr );
            },
            siblings: function () {
                const sibling = [];
                this.each(function () {
                    const child = this.parentNode.children;
                    for ( let i = 0, j = child.length; i < j; i++ ) {
                        if ( child[ i ] !== this ) {
                            sibling.push( child[ i ] );
                        }
                    }
                });
                return $( sibling );
            },
            add ( elem ) {
                let dom = this;
                const addElem = $( elem );
                for ( let i = 0, j = addElem.length; i < j; i++ ) {
                    dom[ dom.length ] = addElem[ i ];
                    dom.length++;
                }
                return dom;  
            },
            data ( name, value ) {
                return ( typeof name === "string" && !value ) ? 
                    this[ 0 ].dataset[ name ] : 
                    this.each(function () {
                        if ( name && value ) {
                            this.dataset[ name ] = value;
                        } else {
                            for ( const key in name ) {
                                this.dataset[ key ] = name[ key ];
                            }
                        }
                    })
            },
            remove () {
                return this.each(function () {
                    this.parentNode && this.parentNode.removeChild( this );
                })
            },
            show () {
                return this.each(function () {
                    this.style.display = "block";
                })
            },
            hide () {
                return this.each(function () {
                    this.style.display = "";
                    if ( $( this ).css( "display" ) !== "none" ) {
                        this.style.display = "none";
                    }
                })
            }
        };
        return function ( selector ) {
            let result = [];
            if ( typeof selector === "string" ) {
                result = document.querySelectorAll( selector );
            }
            if ( selector.nodeType || selector === document ) {
                result.push( selector );
            } else if ( selector.length > 0 && selector[ 0 ] && selector[ 0 ].nodeType ) {
                for ( let i = 0, j = selector.length; i < j; i++ ) {
                    result.push( selector[ i ] );
                }
            }
            return new buildDom( result );     
        }
    })();

    // 默认配置
    const Defaults = {
        theme: "select",
        data: {
            props: {
                code: "code",
                name: "name"
            },
            source: null,
            when: null
        },
        level: 3,
        radius: 2,                   
        width: 200,
        height: 34,
        maxHeight: 300,
        disabled: [],
        disabledItem: [],
        selected: [],
        selectedCallback: () => {},
        placeholder: [ "省", "市", "区" ],
        separator: "/",
        clearable: false,
        strict: false,
        onlyShowLastLevel: false,
        icon: "arrow",
        onClear: () => {},
        onSelect: () => {}
    };

    // 存储组件数据
    const CacheIPicker = {
        originalElem: new WeakMap(),  // 原始目标元素 >> elem: "..."
        options: new WeakMap(),       // 组件配置信息 >> elem: opt
        value: new WeakMap(),         // 组件选中结果 >> elem: [ [], [], [] ]
        id: new WeakMap(),            // 组件唯一标识 >> elem: uid
        target: new Map()             // 组件目标信息 >> uid: elem
    };

    // 缓存数据源
    let CacheInnerData = null;
    const CacheCustomData = new Map();

    // 样式 id
    const styleId = "__iPicker-default-style__";

    // 功能模块
    const Module = {
        createFrame ( $target, { theme, level, icon, clearable }, uid ) {
            let frame = `
                <div class="iPicker-container">
                    <div class="iPicker-result">
                        <input 
                            type="text" 
                            autocomplete="off" 
                            spellcheck="false"
                            class="iPicker-input"
                            readonly
                        >    
                        <i class="arrow-icon ${ icon === "arrow-outline" ? 'arrow-outline' : 'arrow-triangle' }"></i>
                        ${ clearable ? '<i class="clear-icon"></i>' : '' }
                    </div>
                    <div class="iPicker-list iPicker-${ theme }">___</div>
                </div>
            `;
            switch ( theme ) {
                case "select":
                    frame = frame.replace( "___", "<ul></ul>" ).repeat( level );
                break;
                case "cascader": 
                    frame = frame.replace( "___", "<ul></ul>".repeat( level ) );
                break;
                case "panel":
                    frame = frame.replace( "___", `
                        <div class="iPicker-panel-tab">
                            <div class="iPicker-panel-tab-active">省份</div>
                            ${ level > 1 ? "<div>城市</div>" : "" }
                            ${ level > 2 ? "<div>区县</div>" : "" }
                        </div>
                        <div class="iPicker-panel-content">${ "<ul></ul>".repeat( level ) }</div>
                    ` );
                break;
            }
            $target.addClass( "iPicker-target" ).html( frame ).data({
                theme: theme,
                id: uid.toString().replace( /(\(|\))/g, "" )
            });
        },
        createList ( data, opt, isInnerData ) {
            return new Promise(resolve => {
                let list = "";
                const isCascader = opt.theme === "cascader";
                if ( !isInnerData ) {
                    const { code, name } = opt.data.props || {};
                    data.forEach(obj => {
                        list += `
                            <li data-code="${ obj[ code ] }" data-name="${ obj[ name ] }">
                                <span>${ obj[ name ] }</span>
                                ${ ( isCascader ? '<i></i>' : '' ) }
                            </li>
                        `;
                    })
                } else {
                    for ( const key in data ) {  
                        list += `
                            <li data-code="${ key }" data-name="${ data[ key ] }">
                                <span>${ data[ key ] }</span>
                                ${ ( isCascader ? '<i></i>' : '' ) }
                            </li>
                        `;
                    }
                }
                resolve( list );
            })
        },
        getData ( code, level, opt, isInnerData ) {

            // 优先使用本地缓存的数据源
            return new Promise(resolve => {

                // 通过 opt.data.when 函数可对数据进行一次最后的处理
                function when ( data, level ) {
                    if ( Util.isFunction( opt.data.when ) ) {
                        return opt.data.when( data, level );
                    } else {
                        return data;
                    }
                }

                // 自定义数据源
                if ( !isInnerData ) {
                    const hasCache = CacheCustomData.get( code );
                    if ( hasCache ) {
                        resolve( when( hasCache, level ) );
                    } else {
                        opt.data.source( code, level ).then(res => {
                            CacheCustomData.set( code, res );
                            resolve( when( res, level ) );
                        })
                    }
                } else {

                    // 内置数据源
                    if ( !CacheInnerData ) {
                        opt.data.source.then(res => {
                            CacheInnerData = res;
                            resolve( when( res[ code ], level ) );
                        })
                    } else {
                        resolve( when( CacheInnerData[ code ], level ) );
                    }
                }
            })
        },
        getSelected ( $target ) {

            // 根据被选中列表含有 "特征类" 来获取选中项
            const $active = $target.find( ".iPicker-list-active" );
            const activeSize = $active.length;
            const [ code, name, map ] = [ [], [], [] ];
            if ( activeSize ) {
                $active.each(function () {
                    const dataCode = $( this ).data( "code" );
                    const dataName = $( this ).data( "name" );
                    code.push( dataCode );
                    name.push( dataName );
                    map.push({
                        code: dataCode,
                        name: dataName
                    });
                })
            }
            return [ code, name, map ];
        },
        cacheSelected ( target, value ) {
            CacheIPicker.value.set( target, value );
        }
    };

    // 核心程序
    const iPicker = ( target, options ) => {

        /* 
         ! 对必选参数进行校验，包括：
         # - target     <String>
         # - options    <Object>
         # --- data     <Object>
         # ----- source <Function | Promise>
         */
        if (
            !target ||
            !options ||
            typeof target !== "string" ||
            !target.trim() || 
            !Util.isCorrectObject( options ) || 
            !Util.isCorrectObject( options.data ) || 
            !options.data.source ||
            ( !Util.isFunction( options.data.source ) && Util.type( options.data.source ) !== "promise" )
        ) {
            return;
        }

        const $target = $( target );
        const _target = $target.get();

        if ( !_target ) {
            return;
        }

        // 合并参数
        const opt = Util.mergeParam( options, Defaults );

        /*
         ! 检验并处理 level
         # level 的有效值只能是：1, 2, 3 <Number> 
         # 如果传入其它值则强制更改为 3
         */
        if ( !Util.isCorrectNumber( opt.level ) || opt.level < 1 || opt.level > 3 ) {
            opt.level = 3;
        }

        // 缓存主题类型
        const selectTheme = opt.theme === "select";
        const cascaderTheme = opt.theme === "cascader";
        const panelTheme = opt.theme === "panel";

        // 缓存数据源类型
        const isInnerData = Util.type( opt.data.source ) === "promise";
        const isCustomData = Util.isFunction( opt.data.source );

        // 检测 onClear 和 onSelect 是否为函数
        const onClearIsFunc = Util.isFunction( opt.onClear );
        const onSelectIsFunc = Util.isFunction( opt.onSelect );

        // 创建一个全局唯一标识符
        const uid = _target._iPicker_uid_ || Util.uid( true );

        // 存储
        CacheIPicker.originalElem.set( _target, target );
        CacheIPicker.options.set( _target, opt );
        CacheIPicker.target.set( uid, _target );
        CacheIPicker.id.set( _target, uid );
        _target._iPicker_uid_ = uid;

        // 添加样式
        if ( !document.getElementById( styleId ) ) {
            document.head.insertAdjacentHTML("afterbegin", `
                <style id="${ styleId }">.iPicker-target{position:relative;height:34px}.iPicker-container,.iPicker-target *{box-sizing:border-box;font-size:14px;margin:0;padding:0}.iPicker-container{height:34px;float:left;position:relative}.iPicker-container:not(:first-of-type){margin-left:10px}.iPicker-result{display:flex;align-items:center;position:relative;background:#fff;border:#d6d6d6 solid 1px;min-width:100px;height:34px;border-radius:2px;cursor:pointer;user-select:none}.iPicker-result.iPicker-result-active:not(.iPicker-disabled),.iPicker-result.iPicker-result-active:not(.iPicker-disabled):hover{border:#00b8ff solid 1px}.iPicker-result.iPicker-result-active i::before{transform:scale(.55) rotate(180deg)}.iPicker-result.iPicker-result-active i.arrow-outline::before{transform:scale(.72) rotate(180deg)}.iPicker-result i{position:absolute;top:0;right:0;display:block;width:30px;height:34px}.iPicker-result i::before{position:absolute;top:0;right:2px;display:block;width:28px;height:100%;background-position:center;background-repeat:no-repeat;content:"";opacity:.5;transition:transform .2s;transform:scale(.55)}.iPicker-result i.arrow-icon::before{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2OTk1MjQ3Njc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUzNS40NjY2NjcgODEyLjhsNDUwLjEzMzMzMy01NjMuMmMxNC45MzMzMzMtMTkuMiAyLjEzMzMzMy00OS4wNjY2NjctMjMuNDY2NjY3LTQ5LjA2NjY2N0g2MS44NjY2NjdjLTI1LjYgMC0zOC40IDI5Ljg2NjY2Ny0yMy40NjY2NjcgNDkuMDY2NjY3bDQ1MC4xMzMzMzMgNTYzLjJjMTIuOCAxNC45MzMzMzMgMzQuMTMzMzMzIDE0LjkzMzMzMyA0Ni45MzMzMzQgMHoiIHAtaWQ9IjI2NTEiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=)}.iPicker-result i.clear-icon::before{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA3Njc2MTg3NDk0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNDIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMS45MTg2NDcgMTYzLjE1NDkxN2MtMTkzLjQzODY0MSAwLTM1MS42OTcwMzcgMTU4LjI1NDMwNC0zNTEuNjk3MDM3IDM1MS42OTkwODQgMCAxOTMuNDM5NjY0IDE1OC4yNTczNzQgMzUxLjY5NzAzNyAzNTEuNjk3MDM3IDM1MS42OTcwMzcgMTkzLjM5NDYzOCAwIDM1MS42NTMwMzUtMTU4LjI1NjM1IDM1MS42NTMwMzUtMzUxLjY5NzAzN0M4NjMuNTcwNjU5IDMyMS40MDkyMjEgNzA1LjMxMzI4NiAxNjMuMTU0OTE3IDUxMS45MTg2NDcgMTYzLjE1NDkxN002ODcuNzM2OTc4IDY0MS40NTIzMjdsLTQ5LjE5ODUxNSA0OS4yMjQwOTgtMTI2LjYxOTgxNi0xMjYuNjAwMzczLTEyNi41NzM3NjcgMTI2LjYwMDM3My00OS4zMDQ5MzktNDkuMjI0MDk4IDEyNi42MzYxODktMTI2LjU5ODMyNi0xMjYuNjM2MTg5LTEyNi42MDAzNzMgNDkuMzA0OTM5LTQ5LjIyNDA5OCAxMjYuNTczNzY3IDEyNi42MDAzNzMgMTI2LjYxOTgxNi0xMjYuNjAwMzczIDQ5LjE5ODUxNSA0OS4yMjQwOTgtMTI2LjU3Mzc2NyAxMjYuNjAwMzczTDY4Ny43MzY5NzggNjQxLjQ1MjMyN3oiIHAtaWQ9IjMzNDMiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=);transform:scale(1);z-index:10}.iPicker-result i.arrow-outline::before{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA1MDYzNzA0MzAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0NDMiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiA3MzBjLTYuNCAwLTEyLjgtMi40LTE3LjctNy4zbC0zODYtMzg2Yy05LjgtOS44LTkuOC0yNS42IDAtMzUuNCA5LjgtOS44IDI1LjYtOS44IDM1LjQgMEw1MTIgNjY5LjZsMzY4LjMtMzY4LjNjOS44LTkuOCAyNS42LTkuOCAzNS40IDAgOS44IDkuOCA5LjggMjUuNiAwIDM1LjRsLTM4NiAzODZjLTQuOSA0LjktMTEuMyA3LjMtMTcuNyA3LjN6IiBmaWxsPSIjMzMzMzMzIiBwLWlkPSIzNDQ0Ij48L3BhdGg+PC9zdmc+);transform:scale(.72);opacity:.9}.iPicker-result.iPicker-disabled{cursor:not-allowed;background:#f2f5fa;color:#898989;border-color:#dfdfdf}.iPicker-result.iPicker-disabled input{cursor:not-allowed;background:#f2f5fa;color:#898989}.iPicker-input{display:block;width:100%;width:calc(100% - 23px);height:32px;padding:0 10px;outline:0;border:0;cursor:pointer;user-select:none}.iPicker-result input::selection{background:#fff}.iPicker-list.iPicker-list-ontop{transform-origin:center bottom}.iPicker-list-show-temporary{display:block!important;opacity:0!important;pointer-events:none!important}.iPicker-input::-webkit-input-placeholder{color:#aaa}.iPicker-input::-moz-placeholder{color:#aaa}.iPicker-target[data-theme=panel] .iPicker-list{width:370px}.iPicker-list{position:relative;z-index:10;display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;user-select:none;background:#fff;border:#ddd solid 1px;box-shadow:rgba(0,0,0,.12) 0 2px 6px;transform-origin:center top;transform:scaleY(0);transition-property:transform,opacity;transition-duration:.2s}.iPicker-list ul{display:block;overflow:hidden}.iPicker-list li{cursor:pointer;transition:.2s}.iPicker-list li span{pointer-events:none}.iPicker-list li.iPicker-list-active,.iPicker-list li:hover{color:#00b8ff;background:rgba(0,184,255,.1)}.iPicker-list li.iPicker-list-disabled{cursor:not-allowed;background:#f2f5fa;color:#b6b6b6}.iPicker-panel-tab{display:flex;align-items:center;justify-content:flex-start;height:36px;background-color:#f5f5f5;border-bottom:#ddd solid 1px}.iPicker-panel-tab>div{cursor:pointer;padding:0 20px;height:36px;line-height:36px}.iPicker-panel-tab>div:last-child.iPicker-panel-tab-active,.iPicker-panel-tab>div:not(:last-child){border-right:#d3d3d3 solid 1px}.iPicker-panel-tab>div.iPicker-panel-tab-active{background:#fff;cursor:default;position:relative;height:37px;border-bottom:#fff solid 1px;color:#00b8ff}.iPicker-panel-content{padding:10px 0;min-height:50px;overflow-x:hidden;overflow-y:auto}.iPicker-panel-content ul{display:none}.iPicker-panel li{float:left;display:block;margin:2px 4px;padding:4px 10px;border-radius:2px}.iPicker-panel li span{font-size:13px}.iPicker-cascader li,.iPicker-select li{position:relative;display:block;padding:6px 12px;list-style:none;transition:.25s;overflow:hidden;clear:both;word-break:break-all}.iPicker-cascader li:first-child,.iPicker-select li:first-child{margin-top:8px}.iPicker-cascader li:last-child,.iPicker-select li:last-child{margin-bottom:8px}.iPicker-list.iPicker-cascader{overflow:hidden}.iPicker-cascader ul{position:relative;z-index:4;display:none;width:200px;float:left;overflow-y:auto;overscroll-behavior:contain}.iPicker-cascader ul:nth-child(2){z-index:3;margin-left:-2px}.iPicker-cascader ul:nth-child(3){z-index:2;margin-left:0}.iPicker-cascader ul:nth-child(4){z-index:1}.iPicker-cascader ul:not(:last-child){border-right:#dfdfdf solid 1px}.iPicker-cascader li i{display:block;position:absolute;top:50%;right:10px;width:8px;height:8px;margin-top:-4px;border-top:#6f6f6f solid 1px;border-right:#6f6f6f solid 1px;transform:scale(.8) rotate(45deg)}.iPicker-cascader li.iPicker-list-disabled i{opacity:.4}.iPicker-cascader li.iPicker-list-active i{border-top-color:#00b8ff;border-right-color:#00b8ff}.iPicker-cascader ul:last-child li i{display:none}.iPicker-list.iPicker-list-show{display:block;transform:scaleY(1)}.iPicker-list.iPicker-list-hide{transform:scaleY(0);opacity:0}</style>
            `);
        }

        // 生成组件结构
        Module.createFrame( $target, opt, uid );

        // 缓存 dom
        const $container = $target.find( ".iPicker-container" );
        const $result = $target.find( ".iPicker-result" );
        const $input = $target.find( ".iPicker-input" );
        const $list = $target.find( ".iPicker-list" );
        const $ul = $list.find( "ul" );

        // 添加索引标记
        $ul.each(function ( i ) {
            $( this ).data( "level", ++i );
        })

        /*
         ! 设置列表最大高度
         # maxHeight: <Number>
         # 最小有效值是 100，如果设置了小于 100 的值则按照默认配置进行处理
         */
        if ( Util.isCorrectNumber( opt.maxHeight ) && opt.maxHeight >= 100 ) {
            $list.css( "maxHeight", `${ opt.maxHeight }px` );
            if ( cascaderTheme ) {
                $ul.css( "maxHeight", `${ opt.maxHeight }px` );
            }
            if ( panelTheme ) {
                $list.find( ".iPicker-panel-content" ).css( "height", `${ opt.maxHeight - 38 }px` );
            }
        }

        /*
         ! 设置结果展示框宽度
         # width: <Number | String>
         # - <Number> 时最小有效值是 100，如果设置了小于 100 的值则按照默认配置进行处理
         # - <String> 时必须是百分比形式
         */
        if ( Util.isCorrectNumber( opt.width ) && opt.width >= 100 ) {
            $result.css( "width", `${ opt.width }px` );
            if ( selectTheme ) {
                $list.css( "width", `${ opt.width }px` );
            }
        }
        if ( typeof opt.width === "string" && opt.width.trim().endsWith( "%" ) ) {
            $result.css( "width", opt.width );
            if ( selectTheme ) {
                $list.css( "width", opt.width );
            } else {
                $container.css( "width", opt.width );
            }
        }

        /*
         ! 设置结果展示框高度
         # height: <Number>
         # 最小有效值是 20，如果设置了小于 20 的值则按照默认配置进行处理
         */
        if ( Util.isCorrectNumber( opt.height ) && opt.height >= 20 ) {
            $result.css( "height", `${ opt.height }px` );
            $input.css( "height", `${ opt.height - 2 }px` );
            $input.next().css( "height", `${ opt.height - 2 }px` );
        }

        /*
         ! 禁用指定地区
         # disabledItem: <Boolean( true ) | Array>
         */
        if ( opt.disabledItem === true ) {
            new MutationObserver(() => {
                $target.find( "li" ).addClass( "iPicker-list-disabled" );
            }).observe(_target, {
                childList: true,
                subtree: true
            })
        }
        if ( Array.isArray( opt.disabledItem ) && opt.disabledItem.length ) {
            for ( const code of [ ...new Set( opt.disabledItem ) ] ) {
                new MutationObserver(() => {
                    const li = _target.querySelector( `[data-code="${ code }"]:not(.iPicker-list-disabled)` );
                    if ( li ) {
                        li.classList.add( "iPicker-list-disabled" );
                    }
                }).observe(_target, {
                    childList: true,
                    subtree: true
                })
            }
        }

        /*
         ! 禁用指定的结果展示框
         # disabled: <Boolean( true ) | Number | Array>
         */
        if ( opt.disabled === true ) {
            opt.disabled = [ 1, 2, 3 ].slice( 0, opt.level );
        }
        if ( Util.isCorrectNumber( opt.disabled ) ) {
            opt.disabled = [ opt.disabled ];
        }
        if ( Array.isArray( opt.disabled ) && opt.disabled.length ) {
            for ( const level of [ ...new Set( opt.disabled ) ] ) {
                if ( Util.isCorrectNumber( level ) && level >= 1 && level <= 3 ) {
                    $result.eq( level - 1 ).addClass( "iPicker-disabled" );
                }
            }
        }

        /*
         ! 设置 placeholder
         # placeholder: <String | Array>
         */
        if ( selectTheme && Array.isArray( opt.placeholder ) ) {
            opt.placeholder.forEach(( v, i ) => {
                const input = $input.eq( i ).get();
                if ( input ) {
                    input.setAttribute( "placeholder", opt.placeholder[ i ] || Defaults.placeholder[ i ] );
                }
            })
        }
        if ( cascaderTheme || panelTheme ) {
            if ( typeof opt.placeholder !== "string" || !opt.placeholder.trim() ) {
                opt.placeholder = "请选择地区";
            }
            $input.eq( 0 ).get().setAttribute( "placeholder", opt.placeholder );
        }

        /*
         ! 设置结果展示框的圆角值
         # radius: <Number>
         # radius 可设置为零从而取消圆角效果
         */
        if ( Util.isCorrectNumber( opt.radius, true ) ) {
            $result.add( $input ).css( "borderRadius", `${ opt.radius }px` );
        }

        /*
         ! 设置清空按钮
         # clearable: <Boolean>
         # 清空机制：
         # - 对于 cascader 和 panel 主题
         #   -- 点击清空按钮时则直接清除组件已选数据
         #
         # - 对于 select 主题
         #   -- 点击清空按钮时会清除当前层级及其子级的相关数据
         */
        $result.find( ".clear-icon" ).hide();
        $result.each(function () {

            // 鼠标滑入滑出显示或隐藏清空按钮
            const el = $( this ).get();
            el.addEventListener("mouseenter", () => {
                const input = el.querySelector( "input" );
                if ( input ) {
                    if ( input.value ) {
                        $( this ).find( ".clear-icon" ).show().prev().hide();
                    }
                }
            })
            el.addEventListener("mouseleave", () => {  
                $( this ).find( ".clear-icon" ).hide().prev().show();
            })
        })
        const $clear = $target.find( ".clear-icon" );
        if ( !selectTheme ) {
            $clear.click(() => {
                $clear.hide().prev().show();
                iPicker.clear( uid );
                if ( onClearIsFunc ) {
                    opt.onClear();
                }
            })
        } else {
            $clear.each(function () {
                const $this = $( this );
                $this.click(function () {
                    $this.hide().prev().show();
                    const $parent = $this.parent();
                    const $ul = $parent.next().find( "ul" );
                    const index = +$ul.data( "index" );
                    $parent.find( "input" ).val( "" );
                    $ul.find( ".iPicker-list-active" ).removeClass( "iPicker-list-active" );
                    $parent
                        .parent()
                        .nextAll()
                        .find( "input" )
                        .val( "" )
                        .parent()
                        .next()
                        .find( "ul" )
                        .html( "" );

                    getCacheShow();
                    closeList( $parent.next() );
                    if ( onClearIsFunc ) {
                        opt.onClear();
                    }
                })
            })
        }
       
        /*
         ! 通过点击展示框来展开或关闭列表
         */
        $result.each(function () {
            $( this ).find( "input, .arrow-icon" ).click(function () {
                const $this = $( this ).parent();
                const $next = $this.next();
                const id = $this.parent().parent().data( "id" );

                // 关闭其它列表
                const $otherList = $( `.iPicker-target:not([data-id="${ id }"]) .iPicker-list` );
                if ( $otherList.length ) {
                    closeList( $otherList );
                }
                
                // 组件必须在 "启用" 状态下才有效
                if ( !$this.hasClass( "iPicker-disabled" ) ) {

                    // 列表中必须有数据
                    if ( !$next.find( "li" ).length ) {
                        return;
                    }

                    $this.toggleClass( "iPicker-result-active" );

                    if ( $next.hasClass( "iPicker-list-show" ) ) {
                        closeList( $next );
                    } else {
                        if ( panelTheme ) {
                            $target
                                .find( ".iPicker-panel-tab > div:first-child" )
                                .addClass( "iPicker-panel-tab-active" )
                                .siblings()
                                .removeClass( "iPicker-panel-tab-active" );
                            $target.find( ".iPicker-panel-content > ul:first-child" ).show().siblings().hide();
                        }

                        /* 
                         # 自动检测展示框的位置
                         # 实时调整下拉列表的位置
                        */
                        let flag = false;
                        const resultHeight = parseInt( $this.css( "height" ) );
                        function positionListener () {
                            if ( flag ) {
                                return;
                            }
                            flag = true;
                            $next.addClass( "iPicker-list-show-temporary" );
                            const bottom = document.documentElement.clientHeight - $this.get().getBoundingClientRect().bottom;
                            const height = parseInt( $next.css( "height" ) );
                            if ( bottom < height ) {
                                $next.css( "marginTop", `-${ height + resultHeight }px` ).addClass( "iPicker-list-ontop" ); 
                            } else {
                                $next.css( "marginTop", "0px" ).removeClass( "iPicker-list-ontop" );
                            }
                            flag = false;
                            $next.removeClass( "iPicker-list-show-temporary" );
                        }
                        positionListener();
                        window.addEventListener( "scroll", positionListener );
                        window.addEventListener( "resize", positionListener );

                        $next.addClass( "iPicker-list-show" ).removeClass( "iPicker-list-hide" );
                    }
                }
            })
        })

        /*
         ! 关闭列表函数
         # 含有对 strict 严格模式的判断
         */
        function closeList ( $list ) {
            if ( $list.hasClass( "iPicker-list-show" ) ) {
                $list
                    .addClass( "iPicker-list-hide" )
                    .removeClass( "iPicker-list-show" )
                    .prev()
                    .removeClass( "iPicker-result-active" );
                $list.show();
                Util.delayTimer( 200 ).then(() => {
                    $list.get().style.removeProperty( "display" );
                })
                
                if ( !selectTheme ) {
                    getCacheShow();
                }
                
                // 检测 strict 模式
                const $target = $list.parent().parent();
                const opt = CacheIPicker.options.get( $target.get() );
                if ( opt.strict ) {
                    
                    // 利用定时器进行延时处理
                    // 在列表关闭动画结束后执行相关程序
                    Util.delayTimer( 200 ).then(() => {
                        const [ code ] = CacheIPicker.value.get( $target.get() );
                        const codeLen = code.length;
                        
                        // 只有在至少选择了一个层级
                        // 但又没有完整选择全部指定的层级的情况下
                        // 才能执行后续程序
                        if ( codeLen && codeLen !== opt.level ) {
                            function promise () {
                                return new Promise(resolve => {
                                    if ( codeLen === 1 ) {
                                        if ( opt.level === 2 ) {
                                            resolve();
                                        } else {
                                            addList( $ul.eq( 1 ).find( "li:first-child" ).data( "code" ), 3 ).then(() => {
                                                resolve();
                                            });
                                        }
                                    } else {
                                        resolve();
                                    }
                                })
                            }
                            promise().then(() => {
                                $ul.each(function () {
                                    if ( !$( this ).find( ".iPicker-list-active" ).length ) {
                                        $( this ).find( "li:first-child" ).addClass( "iPicker-list-active" );
                                    }
                                })
                                getCacheShow();
                            })
                        }
                    })
                }
            }
        }
        
        /*
         ! 添加列表
         */
        function addList ( code, level ) {
            return new Promise(resolve => {
                Module.getData( code, level, opt, isInnerData ).then(res => {
                    Module.createList( res, opt, isInnerData ).then(content => {  
                        const $targetUL = $ul.eq( level - 1 );
                        $targetUL.html( content ).nextAll().html( "" );
                        if ( selectTheme ) {
                            $targetUL.parent().parent().nextAll().find( "ul" ).html( "" );
                        }
                        if ( cascaderTheme ) {
                            let size = 0;
                            $ul.each(function () {
                                if ( this.innerHTML ) {
                                    size++;
                                }
                            })
                            $list.css( "width", `${ 200 * size }px` );
                            $ul.eq( level - 1 ).show().nextAll().hide();
                        }
                        if ( panelTheme ) {
                            $ul.eq( level - 1 ).show().siblings().hide();
                            $target
                                .find( `.iPicker-panel-tab > div:nth-child(${ level })` )
                                .addClass( "iPicker-panel-tab-active" )
                                .siblings()
                                .removeClass( "iPicker-panel-tab-active" );
                        }

                        getCacheShow();

                        resolve();
                    });
                })
            })
        }

        /*
         ! 获取，存储，显示结果
         */ 
        function getCacheShow () {

            // 获取并存储选中结果
            const getSelected = Module.getSelected( $target );
            Module.cacheSelected( _target, getSelected );

            // 显示选中结果
            const separator = opt.separator.trim().charAt( 0 );
            function showResult ( result ) {
                if ( result ) {
                    if ( cascaderTheme || panelTheme ) {
                        if ( opt.onlyShowLastLevel ) {
                            result = result.split( separator ).slice( -1 )[ 0 ].trim();
                        }
                    }
                }
                return result;
            }

            // 显示选中结果
            if ( selectTheme ) {
                getSelected[ 1 ].forEach(( item, index ) => {
                    $input.eq( index ).val( showResult( item ) );
                })
            } else {
                const name = getSelected[ 1 ].join( ` ${ separator } ` );
                $input.eq( 0 ).val( showResult( name ) );
            }
            
            // 执行 onSelect 事件
            if ( onSelectIsFunc ) {
                if ( getSelected[ 1 ].length ) {
                    opt.onSelect( ...CacheIPicker.value.get( _target ) );
                }
            }
        }

        /*
         ! 自动获取第一层级的数据
         # 含有对 "默认选中项" 的处理
         */
        addList( ( isInnerData ? "86" : null ), 1 ).then(() => {
            _target.dataset.promise = "true";

            /*
             ! 设置默认选中项
             # selected <Array> 
             # 默认选中项中不能含有已被禁用的选项，即：
             # selected 数组中的值不能在 disabledItem 中也存在，否则无效
             */
            if ( Array.isArray( opt.selected ) && opt.selected.length ) {
                opt.selected = [ ...new Set( opt.selected ) ]
                for ( const code of opt.selected ) {
                    if ( opt.disabledItem.includes( code ) ) {
                        return;
                    }
                }
                !(function selected ( i ) {
                    addList( opt.selected[ i - 1 ], i + 1 ).then(() => {
                        i++;
                        if ( i < opt.level ) {
                            selected( i );
                        } else {
                            opt.selected.forEach(item => {
                                $target.find( `li[data-code="${ item }"]` ).addClass( "iPicker-list-active" );
                            })
                            getCacheShow();

                            // 执行 selectedCallback 函数
                            if ( Util.isFunction( opt.selectedCallback ) ) {
                                opt.selectedCallback();
                            }
                        }
                    })
                })( 1 );
            }
        });

        /*
         ! 点击选择事件
         */
        $target.click(event => {
            if ( event.target.nodeName.toLowerCase() !== "li" ) {
                return;
            }
            const $li = $( event.target );
            const $ul = $li.parent();
            if ( $li.hasClass( "iPicker-list-disabled" ) ) {
                return;
            }
            $li.addClass( "iPicker-list-active" ).siblings().removeClass( "iPicker-list-active" );
            addList( $li.data( "code" ), +$ul.data( "level" ) + 1 );

            // select 主题下，点击选择后自动关闭列表
            if ( selectTheme ) {
                closeList( $ul.parent() );
                $ul.parent().parent().nextAll().find( ".iPicker-result input" ).val( "" );
            }

            // cascader 和 panel 模式下，如果点击选择的是最后一级的数据
            // 则自动关闭列表
            if ( $ul.index() === opt.level - 1 ) {
                if ( cascaderTheme ) {
                    closeList( $ul.parent() );
                }
                if ( panelTheme ) {
                    closeList( $ul.parent().parent() );
                }
            }
        })

        /*
         ! cascader 主题下需要强制设置高度 
         */
        if ( cascaderTheme ) {
            $ul.css({
                minHeight: `${ opt.maxHeight }px`,
                maxHeight: `${ opt.maxHeight }px`
            });
        }
        
        // panel 主题下的切换
        if ( panelTheme ) {
            $target.find( ".iPicker-panel-tab > div" ).click(function () {
                const index = $( this ).index();
                if ( !$( this ).parent().next().find( "ul" ).eq( index ).find( "li" ).length ) {
                    return;
                }
                $( this )
                    .addClass( "iPicker-panel-tab-active" )
                    .siblings()
                    .removeClass( "iPicker-panel-tab-active" );
                $target
                    .find( ".iPicker-panel-content ul" )
                    .eq( $( this ).index() )
                    .show()
                    .siblings()
                    .hide();
            })
        }
        
        // 点击空白处隐藏列表
        $( document ).click(function ( event ) {
            $container.each(function ( i ) {
                if ( event.target !== this && !this.contains( event.target ) ) {  
                    closeList( $list.eq( i ) ); 
                }
            })
        })

        return uid;
    }

    /*
     ! 创建组件
     # 等同于 iPicker 函数
     */
    iPicker.create = ( target, options ) => {
        return iPicker( target, options );
    }

    /*
     ! 设置值
     # value: <Array>
     */
    iPicker.set = ( id, value ) => {
        const _target = CacheIPicker.target.get( id ); 
        if ( !id || !_target || !value || !Array.isArray( value ) || !value.length ) {
            return;
        }

        // 清除已选项
        iPicker.clear( id );
        
        // 如果目标元素已经设置了 data-promise 属性
        // 说明已经获取到了第一层级的数据
        // 可直接执行 fn 函数
        if ( _target.dataset.promise ) {
            fn();
        } else {

            // 尚未获取到数据时
            // 调用 MutationObserver 方法监听 data-promise 属性的变化
            // 以此来判断是否已经获取到了第一层级的数据
            // 当获取到数据时执行 fn 函数
            new MutationObserver(() => {
                fn();
            }).observe(_target, {
                attributes: true
            });
        }

        function fn () {
            const ul = _target.querySelectorAll( "ul" );
            !(function set ( i ) {
                const li = _target.querySelector( `[data-code="${ value[ i ] }"]` );
                if ( ul[ i + 1 ] ) {
                    
                    // 监听 ul 子元素的变化
                    // 一旦已经生成了列表
                    // 就可以执行后续操作
                    new MutationObserver(() => {
                        ++i;
                        if ( i < value.length ) {
                            set( i );
                        }
                    }).observe(ul[ i + 1 ], {
                        childList: true
                    });

                    li.click();
                } else {
                    li && li.click();
                }
            })( 0 );
        }
    }

    /*
     ! 获取值
     */
    iPicker.get = ( id, type ) => {
        const _target = CacheIPicker.target.get( id ); 
        if ( !id || !_target ) {
            return;
        }

        const result = CacheIPicker.value.get( _target );

        // 获取地区行政编码
        if ( type === "code" || type === undefined ) {
            return result[ 0 ];
        }

        // 获取地区名称
        if ( type === "name" ) {
            return result[ 1 ];
        }

        // 获取地区行政编码和名称
        if ( type === "all" ) {
            return result[ 2 ];
        }
    }

    /*
     ! 清空值
     */
    iPicker.clear = id => {
        const _target = CacheIPicker.target.get( id ); 
        if ( !id || !_target ) {
            return;
        }

        const $target = $( _target );
        const opt = CacheIPicker.options.get( _target );

        // 清空值
        CacheIPicker.value.set( _target, [ [], [], [] ] );

        $target.find( "input" ).val( "" );
        $target.find( "li" ).removeClass( "iPicker-list-active" );
        $target.find( "ul" ).each(function ( i ) {
            const $this = $( this );

            // 移除第一级以外的其它层级的内容
            if ( i ) {
                $this.html( "" );
                if ( opt.theme === "cascader" ) {
                    $this.parent().css( "width", "200px" );
                    $this.get().style.removeProperty( "display" );
                }
                
            }
        })
        if ( opt.theme === "panel" ) {
            $target
                .find( ".iPicker-panel-tab > div" )
                .eq( 0 )
                .addClass( "iPicker-panel-tab-active" )
                .siblings()
                .removeClass( "iPicker-panel-tab-active" );
            $target.find( ".iPicker-panel-content > ul" ).eq( 0 ).show().siblings().hide();
        }

        // 滚动条回顶
        $target.find( ".iPicker-list" ).get().scrollTop = 0;
        $target.find( "ul" ).get().scrollTop = 0;

        return id;
    }

    /*
     ! 重置组件
     */
    iPicker.reset = id => {
        const _target = CacheIPicker.target.get( id );
        if ( !id || !_target ) {
            return;
        }

        return iPicker( 
            CacheIPicker.originalElem.get( _target ), 
            CacheIPicker.options.get( _target ) 
        );
    }

    /*
     ! 销毁组件
     */
    iPicker.destroy = id => {
        const _target = CacheIPicker.target.get( id ); 
        if ( !id || !_target ) {
            return;
        }

        // 移除存储
        CacheIPicker.originalElem.delete( _target );
        CacheIPicker.value.delete( _target );
        CacheIPicker.options.delete( _target );
        CacheIPicker.id.delete( _target );
        CacheIPicker.target.delete( _target._iPicker_uid_ );

        // 移除自定义属性
        delete _target._iPicker_uid_;

        // 清空容器
        _target.innerHTML = "";

        // 当页面中没有 iPicker 组件时移除样式
        if ( !document.querySelector( ".iPicker-container" ) ) {
            $( `#${ styleId }` ).remove();
        }
    }

    /*
     ! 启用组件
     # level: <Boolean( true ) | Number | Array>
     */
    iPicker.enabled = ( id, level ) => {
        const _target = CacheIPicker.target.get( id );
        if ( !id || !_target || !level ) {
            return;
        }
        
        const $target = $( _target );
        const $result = $target.find( ".iPicker-result" );

        // 启用所有层级
        if ( level === true ) {
            $result.removeClass( "iPicker-disabled" );
        }
        
        // 启用指定的层级
        if ( Util.isCorrectNumber( level ) ) {
            level = [ level ];
        }
        if ( Array.isArray( level ) && level.length ) {
            level.forEach(v => {
                if ( Util.isCorrectNumber( v ) && v >= 1 && v <= 3 ) {
                    $result.eq( v - 1 ).removeClass( "iPicker-disabled" );
                }
            })
        }

        return id;
    }
    
    /*
     ! 禁用组件
     # level: <Boolean( true ) | Number | Array>
     */
    iPicker.disabled = ( id, level ) => {
        const _target = CacheIPicker.target.get( id );
        if ( !id || !_target || !level ) {
            return;
        }

        const $target = $( _target );
        const $result = $target.find( ".iPicker-result" );

        // 禁用所有层级
        if ( level === true ) {
            $result.addClass( "iPicker-disabled" );
        }

        // 禁用指定的层级
        if ( Util.isCorrectNumber( level ) ) {
            level = [ level ];
        }
        if ( Array.isArray( level ) && level.length ) {
            level.forEach(v => {
                if ( Util.isCorrectNumber( v ) && v >= 1 && v <= 3 ) {
                    $result.eq( v - 1 ).addClass( "iPicker-disabled" );
                }
            })
        }

        return id;
    }

    /*
     @ 检测 code 合法性
     @ 用于 enabledItem 和 disabledItem 方法
     */
    const checkCode = code => code.filter( item => typeof item === "string" && item.match( /^\d{6,12}$/ ) );

    /* 
     ! 启用全部或指定地区
     # code: <Boolean( true ) | Array>
     */
    iPicker.enabledItem = ( id, code ) => {
        const _target = CacheIPicker.target.get( id );
        if ( !id || !_target || !code ) {
            return;
        }

        // 观察器的配置
        const options = {
            childList: true,
            subtree: true
        };

        // 启用全部地区
        if ( code === true ) {
            new MutationObserver(() => {
                $( _target ).find( "li" ).removeClass( "iPicker-list-disabled" );
            }).observe( _target, options );
        }
        
        // 启用指定地区
        if ( Array.isArray( code ) && code.length ) {

            // 检测与去重
            code = checkCode( [ ...new Set( code ) ] );
            const codeLen = code.length;

            new MutationObserver(() => {
                for ( let i = 0; i < codeLen; i++ ) {
                    const li = _target.querySelector( `[data-code="${ code[ i ] }"]` );
                    if ( li ) {
                        li.classList.remove( "iPicker-list-disabled" );
                    }
                }
            }).observe( _target, options );
        }

        return id;
    }


    /* 
     ! 禁用全部或指定地区
     # code: <Boolean( true ) | Array>
     */
    iPicker.disabledItem = ( id, code ) => {
        const _target = CacheIPicker.target.get( id );
        if ( !id || !_target || !code ) {
            return;
        }

        // 观察器的配置
        const options = {
            childList: true,
            subtree: true
        };

        // 禁用全部地区
        if ( code === true ) {
            new MutationObserver(() => {
                $( _target ).find( "li" ).addClass( "iPicker-list-disabled" );
            }).observe( _target, options );
        }
        
        // 禁用指定地区
        if ( Array.isArray( code ) && code.length ) {

            // 检测与去重
            code = checkCode( [ ...new Set( code ) ] );
            const codeLen = code.length;

            new MutationObserver(() => {
                for ( let i = 0; i < codeLen; i++ ) {
                    const li = _target.querySelector( `[data-code="${ code[ i ] }"]` );
                    if ( li ) {
                        li.classList.add( "iPicker-list-disabled" );
                    }
                }
            }).observe( _target, options );
        }

        return id;
    }

    return iPicker;

});
