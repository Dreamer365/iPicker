/*!
 * iPicker v3.0.0
 * Copyright (C) 2020, ZG
 * Released under the MIT license.
 */
!(( global, factory ) => {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
    typeof define === "function" && define.amd ? define( factory ) :
    ( global = global || self, global.iPicker = factory() );
})( typeof window !== "undefined" ? window : this, global => {

    "use strict";

    // 必须支持 Promise
    if ( typeof window.Promise !== "function" || typeof Promise.resolve() !== "object" ) {
        throw new Error( "当前浏览器不支持 Promise" );
    }

    // 工具
    const util = {

        // 检测类型
        type: obj => Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase(),

        // 判断 - 不为空的纯对象
        isCorrectObject: obj => !!( util.type( obj ) === "object" && Object.keys( obj ).length ),

        // 判断 - 非负整数或正整数
        isCorrectNumber: ( num, zero ) => !!( util.type( num ) === "number" && ( !zero ? num > 0 : num => 0 ) && num % 1 === 0 ),

        // 判断 - 函数
        isFunction: func => util.type( func ) === "function",

        // 生成唯一 id
        uid: () => `iPicker_${ Math.random().toString( 36 ).substr( 2, 10 ) + Date.now() }`,

        // 合并参数
        mergeParams ( params = {}, defaults ) {
            const result = {};
            for ( const key in defaults ) {
                const v = params[ key ];
                result[ key ] = v === 0 ? v : ( v || defaults[ key ] );
            }
            return result;
        },

        // 延时定时器
        delayTimer ( delay = 0 ) {
            return new Promise(resolve => {
                const timer = window.setTimeout(() => {
                    window.clearTimeout( timer );
                    resolve();
                }, delay)
            })
        }
    };

    // DOM 系统
    const buildDom = function ( domArray ) {
        const length = domArray[ 0 ] ? domArray.length : 0;
        this.length = length;
        for ( let i = 0; i < length; i++ ) {
            this[ i ] = domArray[ i ];
        }
        return this;
    }
    const $ = selector => {
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
        attr ( name, value ) {
            return this.each(function () {
                this.setAttribute( name, value );
            })
        },
        css ( name, value ) {
            const _this = this[ 0 ];
            function getStyle ( elem, prop ) {
                return document.defaultView.getComputedStyle( elem, null ).getPropertyValue( prop );
            }

            // 获取样式
            if ( typeof name === "string" && !value ) {
                return getStyle( _this, name );
            }

            // 设置样式
            function setCSS ( el, _name, _value ) {
                el.style[ _name ] = _value;
            }
            return this.each(function () {
                if ( name && value ) {
                    setCSS( this, name, value );
                }
                if ( util.isCorrectObject( name ) && !value ) {
                    for ( const key in name ) {
                        setCSS( this, key, name[ key ] );
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
        first () {
            return $( this[ 0 ] );
        },
        prev () {
            const prevArr = [];
            this.each(function () {
                const p = this.previousElementSibling;
                p && prevArr.push( p );
            });
            return $( prevArr );
        },
        next () {
            const nextArr = [];
            this.each(function () {
                const n = this.nextElementSibling;
                n && nextArr.push( n );
            });
            return $( nextArr );
        },
        parent () {
            const parentArr = [];
            this.each(function () {
                parentArr.push( this.parentNode );
            });
            return $( parentArr );
        },
        find ( dom ) {
            const findArr = [];
            this.each(function () {
                const node = this.querySelectorAll( dom );
                for ( var i = 0, j = node.length; i < j; i++ ) {
                    ( node [ i ].nodeType === 1 ) && findArr.push( node[ i ] );
                }
            });
            return $( findArr );
        },
        data ( name, value ) {
            return !value ? this[ 0 ].dataset[ name ] : this.each(function () {
                this.dataset[ name ] = value;
            })
        },
        remove () {
            return this.each(function () {
                this.parentNode && this.parentNode.removeChild( this );
            })
        },
        prepend ( content ) {
            return this.each(function () {
                this.insertAdjacentHTML( "afterbegin", content );
            })
        },
        append ( content ) {
            return this.each(function () {
                this.insertAdjacentHTML( "beforeend", content );
            })
        },
        after ( content ) {
            return this.each(function () {
                this.insertAdjacentHTML( "afterend", content );
            })
        }
    };

    // head
    const $head = $( "head" );

    // 默认配置
    const defaults = {
        theme: "select",
        data: {
            props: {
                code: "code",
                name: "name"
            },
            source: null
        },
        level: 3,
        width: 200,
        maxHeight: 300,
        disabled: false,
        selected: [],
        selectedCallback: () => {},
        placeholder: [ "省", "市", "区" ],
        radius: 4,
        activeStyle: {
            color: "#00b8ff",
            borderColor: "#00b8ff",
            backgroundColor: "#f5f5f5"
        },
        separator: "/",
        strict: false,
        onlyShowLastLevel: false,
        arrowTheme: "arrow",
        onSelect: () => {}
    };

    // 存储 iPicker 信息
    const cacheIPicker = {
        storage: new Map(),  // ( id: target )
        options: new Map(),  // ( target: options )
        value: new Map(),    // ( target: value )
        id: new Map()        // ( target: id )
    };
    
    // 创建 iPicker
    const iPicker = ( target, options ) => {

        // 获取目标元素 ( 仅对匹配到的第一个元素生效 )
        const $target = $( target ).first();
        const _target = $target.get();

        // 生成 ( 或获取 ) 唯一标识符
        const ID = cacheIPicker.id.get( _target ) || util.uid();

        // 参数合法性检测
        if ( 
            !target || 
            !_target || 
            !options ||
            !util.isCorrectObject( options ) || 
            !util.isCorrectObject( options.data ) || 
            !options.data.source ||
            ( !util.isFunction( options.data.source ) && typeof options.data.source !== "object" )
        ) {
            return;
        }

        // 将自定义参数与默认参数进行合并
        const opt = util.mergeParams( options, defaults );

        // 存储主题模式
        const [ selectTheme, cascaderTheme ] = [
            opt.theme === "select",
            opt.theme === "cascader"
        ];

        // 判断 onSelect 是否为函数
        const onSelectIsFunc = util.isFunction( opt.onSelect );

        // 判断是否为内置数据源
        const isInnerData = !util.isFunction( opt.data.source );

        // 判断是否设置了有效的默认值
        const hasSelected = !!( Array.isArray( opt.selected ) && opt.selected.length === opt.level );

        // 存储主题模式
        $target.data( "theme", selectTheme ? "select" : "cascader" );
        
        // 存储 strict
        $target.data( "strict", opt.strict ? "true" : "false" );

        // 生成组件结构
        const buildIPicker = () => {
            let picker = "";
            if ( util.isCorrectNumber( opt.level ) && opt.level >= 1 && opt.level <= 3 ) {
                function createTmpl ( index, insertUL ) {
                    return `
                        <div class="iPicker-container" data-index="${ index }">
                            <div class="iPicker-result">
                                <input type="text" readonly autocomplete="off" spellcheck="false">
                                <i${ opt.arrowTheme === "arrow-outline" ? ' class="arrow-outline"' : '' }></i>
                            </div>
                            <div class="iPicker-list">
                                ${ insertUL }
                            </div>  
                        </div>
                    `;
                }
                function createUL ( index ) {
                    return `<ul data-index="${ index }"></ul>`;
                }
                if ( selectTheme ) {
                    for ( let i = 0; i < opt.level; i++ ) {
                        picker += createTmpl( i, createUL( i ) );
                    }
                }
                if ( cascaderTheme ) {
                    let ul = "";
                    for ( let i = 0; i < opt.level; i++ ) {
                        ul += createUL( i );
                    }
                    picker = createTmpl( 0, ul );
                }
            }
            return picker;
        }

        // 关闭列表
        const closeList = elem => {
            $( elem ).each(function () {
                const $this = $( this );
                if ( $this.hasClass( "iPicker-list-show" ) ) {
                    $this
                        .addClass( "iPicker-list-hide" )
                        .removeClass( "iPicker-list-show" )
                        .prev().removeClass( "iPicker-result-active" );
                    
                    // 如果是 cascader 主题并且设置了 string: true
                    // 则会在关闭下拉列表时检查是否选择了正确的结果
                    // 即：检查所选结果的层级是否与 level 属性设置的层级相同
                    // 如果不相同，则选择无效，组件会进行重置，恢复其初始状态
                    const $parent = $this.parent().parent();
                    if ( $parent.data( "theme" ) === "cascader" && $parent.data( "strict" ) === "true" ) {
                        if ( cacheIPicker.value.get( $target.get() )[ 0 ].length !== opt.level ) {
                            $target.find( "input" ).val( "" );
                            util.delayTimer( 200 ).then(() => {
                                iPicker.reset( ID );
                            })
                        }
                    }
                }
            })
        }
        
        // 添加 <style>
        $( "#iPicker-style" ).remove();
        $head.prepend( `
            <style id="iPicker-style">.iPicker-container,.iPicker-container *{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent}.iPicker-container *{margin:0;padding:0}.iPicker-container{position:relative;float:left;width:200px;height:34px;font-size:14px;cursor:pointer}.iPicker-container:not(:last-child){margin-right:10px}.iPicker-result{overflow:hidden;height:34px;border:#d6d6d6 solid 1px;border-radius:4px;background:#fff;color:#000;white-space:nowrap;transition:border-color .2s}.iPicker-result input{pointer-events:none;width:100%;cursor:pointer;display:block;height:32px;background-color:#fff;border:0;outline:0;padding:0 30px 0 12px}.iPicker-result input::-webkit-input-placeholder{color:#aaa}.iPicker-result-active:not(.iPicker-disabled),.iPicker-result:not(.iPicker-disabled):hover{border:${ defaults.activeStyle.borderColor } solid 1px}.iPicker-result i{position:absolute;top:0;right:0;display:block;width:30px;height:34px}.iPicker-result i::before{position:absolute;top:0;right:2px;display:block;width:28px;height:100%;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc2OTk1MjQ3Njc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUzNS40NjY2NjcgODEyLjhsNDUwLjEzMzMzMy01NjMuMmMxNC45MzMzMzMtMTkuMiAyLjEzMzMzMy00OS4wNjY2NjctMjMuNDY2NjY3LTQ5LjA2NjY2N0g2MS44NjY2NjdjLTI1LjYgMC0zOC40IDI5Ljg2NjY2Ny0yMy40NjY2NjcgNDkuMDY2NjY3bDQ1MC4xMzMzMzMgNTYzLjJjMTIuOCAxNC45MzMzMzMgMzQuMTMzMzMzIDE0LjkzMzMzMyA0Ni45MzMzMzQgMHoiIHAtaWQ9IjI2NTEiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=);background-position:center;background-repeat:no-repeat;content:"";opacity:.5;transition:transform .2s;transform:scale(.55)}.iPicker-result i.arrow-outline::before{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA1MDYzNzA0MzAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0NDMiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiA3MzBjLTYuNCAwLTEyLjgtMi40LTE3LjctNy4zbC0zODYtMzg2Yy05LjgtOS44LTkuOC0yNS42IDAtMzUuNCA5LjgtOS44IDI1LjYtOS44IDM1LjQgMEw1MTIgNjY5LjZsMzY4LjMtMzY4LjNjOS44LTkuOCAyNS42LTkuOCAzNS40IDAgOS44IDkuOCA5LjggMjUuNiAwIDM1LjRsLTM4NiAzODZjLTQuOSA0LjktMTEuMyA3LjMtMTcuNyA3LjN6IiBmaWxsPSIjMzMzMzMzIiBwLWlkPSIzNDQ0Ij48L3BhdGg+PC9zdmc+);transform:scale(.72);opacity:.9}.iPicker-result-active i::before{transform:scale(.55) rotate(180deg)}.iPicker-result-active i.arrow-outline::before{transform:scale(.72) rotate(180deg)}.iPicker-disabled{cursor:not-allowed;background:#f2f5fa;color:#898989;border-color:#dfdfdf}.iPicker-disabled input{background:#f2f5fa;color:#898989}.iPicker-result.iPicker-disabled i{opacity:.5}.iPicker-list{position:relative;z-index:10;display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;background:#fff;box-shadow:rgba(0,0,0,.1) 0 2px 6px;transform-origin:center top;animation-timing-function:ease-in-out;animation-duration:.2s;animation-fill-mode:forwards}.iPicker-cascader .iPicker-list{overflow-y:hidden;padding:0;max-height:300px}.iPicker-list li,.iPicker-list ul{width:100%;display:block;margin:0;padding:0}.iPicker-list ul{float:left}.iPicker-cascader ul{width:200px;overflow-y:auto;overscroll-behavior:contain}.iPicker-cascader ul:not(:last-child){border-right:#e6e6e6 solid 1px}.iPicker-list li{position:relative;display:block;padding:6px 12px;list-style:none;transition:.25s;overflow:hidden;clear:both;word-break:break-all}.iPicker-list li:first-child{margin-top:8px}.iPicker-list li:last-child{margin-bottom:8px}.iPicker-list li *{pointer-events:none}.iPicker-list li span{display:block;float:left}.iPicker-list li i{display:block;position:absolute;top:50%;right:10px;width:8px;height:8px;margin-top:-4px;border-top:#666 solid 1px;border-right:#bbb solid 1px;transform:scale(.8) rotate(45deg)}.iPicker-list li.iPicker-list-active,.iPicker-list li:hover{background:${ defaults.activeStyle.backgroundColor };color:${ defaults.activeStyle.color }}.iPicker-list-active{cursor:default}.iPicker-list.iPicker-list-hide,.iPicker-list.iPicker-list-show{display:block}.iPicker-list.iPicker-list-show{animation-name:iPickerShow}.iPicker-list.iPicker-list-hide{animation-name:iPickerHide}@keyframes iPickerShow{from{opacity:0;transform:scaleY(0)}to{opacity:1;transform:scaleY(1)}}@keyframes iPickerHide{from{opacity:1;transform:scaleY(1)}to{opacity:0;transform:scaleY(0)}}</style>
        ` );

        // 如果自定义了 activeStyle 则动态添加对应的 <style>
        if (  
            util.isCorrectObject( opt.activeStyle ) && 
            !document.querySelector( `[data-id="${ ID }"]` ) 
        ) {
            $( "#iPicker-style" ).after( `
                <style data-id="${ ID }" class="iPicker-style-custom-active-color">.iPicker-container[data-id="${ ID }"] .iPicker-result-active:not(.iPicker-disabled),.iPicker-container[data-id="${ ID }"] .iPicker-result:not(.iPicker-disabled):hover{border-color:${ opt.activeStyle.borderColor }}.iPicker-container[data-id="${ ID }"] .iPicker-list li.iPicker-list-active,.iPicker-container[data-id="${ ID }"] .iPicker-list li:hover{background-color:${ opt.activeStyle.backgroundColor };color:${ opt.activeStyle.color }}</style>
            ` );
        }
        
        // onSelect 事件可执行的标记
        let onSelectFlag = true;

        // 存储数据
        cacheIPicker.storage.set( ID, _target );
        cacheIPicker.options.set( _target, opt );
        cacheIPicker.value.set( _target, [] );
        cacheIPicker.id.set( _target, ID );

        // 添加组件
        $target.html( buildIPicker() );
        
        // 获取基本元素
        const $container = $target.find( ".iPicker-container" );
        const $result = $target.find( ".iPicker-result" );
        const $input = $target.find( "input" );
        const $list = $target.find( ".iPicker-list" );

        // 如果自定义了 activeStyle 则需要添加唯一标识
        if ( util.isCorrectObject( opt.activeStyle ) ) {
            $container.data( "id", ID );
        }  
        
        // cascader 主题添加类
        if ( cascaderTheme ) {
            $container.addClass( "iPicker-cascader" );
        }

        // 列表最大高度 ( 有效值 >= 46 )
        let maxHeight = 0;
        if ( util.isCorrectNumber( opt.maxHeight ) ) {
            maxHeight = `${ opt.maxHeight >= 46 ? parseInt( opt.maxHeight ) : 46 }px`;
            if ( selectTheme ) {
                $list.css( "maxHeight", maxHeight );
            }
        }

        // 选择框宽度 ( 有效值 >= 90 )
        if ( util.isCorrectNumber( opt.width ) ) {
            $container.css( "width", `${ opt.width >= 90 ? parseInt( opt.width ) : 90 }px` );
        }

        // 禁用指定的选择框
        if ( opt.disabled ) {
            let arr = [];
            if ( opt.disabled === true ) {
                arr = [ 1, 2, 3 ];
            } else if ( Array.isArray( opt.disabled ) && opt.disabled.length ) {
                arr = opt.disabled;
            } else if ( util.isCorrectNumber( opt.disabled ) ) {
                arr = [ opt.disabled ];
            }
            for ( const level of arr ) {
                if ( util.isCorrectNumber( level ) && level >= 1 && level <= 3 ) {
                    $result.each(function ( i ) {
                        if ( i === level - 1 ) {
                            $( this ).addClass( "iPicker-disabled" );
                        }
                    })
                } else {
                    break;
                }
            }
        }

        // 设置 placeholder
        if ( selectTheme && Array.isArray( opt.placeholder ) ) {
            opt.placeholder.forEach(( v, i ) => {
                $input.eq( i ).attr( "placeholder", opt.placeholder[ i ] || defaults.placeholder[ i ] );
            })
        }
        if ( cascaderTheme ) {
            if ( typeof opt.placeholder !== "string" || !opt.placeholder.trim() ) {
                opt.placeholder = "请选择地区";
            }
            $input.first().attr( "placeholder", opt.placeholder );
        }

        // 给列表添加标识
        $list.data( "id", util.uid() );

        // 设置结果展示框的圆角值
        if ( util.isCorrectNumber( opt.radius, true ) ) {
            $result.css( "borderRadius", `${ opt.radius }px` );
        }

        // 通过点击展示框展开和关闭列表
        $result.click(function () {
            const $this = $( this );
            const $next = $this.next();

            // 关闭其它列表
            closeList( `.iPicker-list:not([data-id="${ $next.data( "id" ) }"])` );

            if ( !$this.hasClass( "iPicker-disabled" ) ) {
                $this.toggleClass( "iPicker-result-active" );
                if ( $next.hasClass( "iPicker-list-show" ) ) {
                    closeList( $next.get() );
                } else {
                    $next.addClass( "iPicker-list-show" ).removeClass( "iPicker-list-hide" );
                }
            }
        })

        // 获取数据
        const cacheCustomData = new Map();
        let cacheInnerData = null;
        function getData ( code, level ) {
            return new Promise(resolve => {
            
                // 自定义数据源
                if ( !isInnerData ) {
                    const hasCache = cacheCustomData.get( code );
                    if ( hasCache ) {
                        resolve( hasCache );
                    } else {
                        opt.data.source( code, level ).then(res => {
                            cacheCustomData.set( code, res );
                            resolve( res );
                        })
                    }
                } else {

                    // 内置数据源
                    if ( !cacheInnerData ) {
                        opt.data.source.then(res => {
                            cacheInnerData = res;
                            resolve( res[ code ] );
                        })
                    } else {
                        resolve( cacheInnerData[ code ] );
                    }
                }
            })
        }

        // 生成菜单
        function createList ( data ) {
            return new Promise(resolve => {
                let list = "";
                if ( !isInnerData ) {
                    const { code, name } = opt.data.props || {};
                    data.forEach(obj => {
                        list += `
                            <li data-code="${ obj[ code ] }" data-name="${ obj[ name ] }">
                                <span>${ obj[ name ] }</span>
                                ${ ( opt.theme === "cascader" ? '<i></i>' : '' ) }
                            </li>
                        `;
                    })
                } else {
                    for ( const key in data ) {  
                        list += `
                            <li data-code="${ key }" data-name="${ data[ key ] }">
                                <span>${ data[ key ] }</span>
                                ${ ( opt.theme === "cascader" ? '<i></i>' : '' ) }
                            </li>
                        `;
                    }
                }
                resolve( list );
            })
        }

        // 存储选中结果
        function cacheSelected () {
            const [ code, name, map ] = [ [], [], [] ];
            $target.find( ".iPicker-list-active" ).each(function () {
                const dataCode = $( this ).data( "code" );
                const dataName = $( this ).data( "name" );
                dataCode && code.push( dataCode );
                dataName && name.push( dataName );
                ( dataCode && dataName ) && map.push({
                    code: dataCode,
                    name: dataName
                });
                cacheIPicker.value.set( _target, [ code, name, map ] );
            })
        }

        // 显示选中项
        function showSelected ( name, level ) {
            $input.eq( selectTheme ? level - 1 : 0 ).val( name );
        }

        // select 主题
        if ( selectTheme ) {
            $target.click(function ( event ) {
                const $li = $( event.target );
                if ( $li.get().nodeName.toLowerCase() === "li" ) {
                    const $ul = $li.parent();
                    const $thisList = $ul.parent();
                    const $thisContainer = $thisList.parent();
                    const ulIndex = +$ul.data( "index" );

                    // 选中项高亮显示
                    $ul.find( "li" ).removeClass( "iPicker-list-active" );
                    $li.addClass( "iPicker-list-active" );
                    const $prev = $thisList.prev();

                    // 关闭列表
                    closeList( $thisList.get() );

                    // 清空后面列表的内容和选中值
                    $container.each(function ( i ) {
                        if ( i > $thisContainer.data( "index" ) ) {
                            $( this ).find( "input" ).val( "" );
                            $( this ).find( "ul" ).html( "" );
                        }
                    })

                    // 向后一个列表添加 list
                    const $nextContainer = $thisContainer.next();
                    let promise = null;
                    if ( $nextContainer ) {

                        // 加入延时防止后续列表的滚动条不能回顶
                        promise = new Promise(resolve => {
                            util.delayTimer().then(() => {
                                getData( $li.data( "code" ), ulIndex + 1 ).then(res => {
                                    createList( res ).then(content => {
                                        $nextContainer.find( "ul" ).html( content );
                                        resolve();
                                    })
                                })
                            })
                        })
                    }

                    // 开启了 strict 模式
                    // 会自动选中后一个列表的第一个选项
                    if ( opt.strict ) {
                        if ( promise ) {
                            promise.then(() => {
                                const $el = $nextContainer.find( "li:first-child" ).get();
                                if ( $el ) {
                                    $el.click();
                                }
                            })
                        }
                    }

                    // 存储选中结果
                    // 显示选中内容
                    cacheSelected();
                    showSelected( $li.find( "span" ).text().trim(), ulIndex + 1 );

                    // onSelect 事件
                    if ( onSelectIsFunc && onSelectFlag ) {

                        // 执行 onSelect 事件
                        opt.onSelect.call( $li, ...cacheIPicker.value.get( _target ) );
                    }
                }
            })
        }

        // cascader 主题
        if ( cascaderTheme ) {
            const $firstUL = $list.find( "ul" ).first();
            const ulWidth = $firstUL.css( "width" );
            if ( maxHeight ) {

                // 向第一级列表添加最大高度
                $firstUL.css( "maxHeight", maxHeight );
            }

            // 向列表添加宽度
            $list.css( "width", ulWidth );

            $list.click(function ( event ) {
                const $li = $( event.target );
                if ( $li.get().nodeName.toLowerCase() === "li" ) {
                    const $ul = $li.parent();
                    const code = $li.data( "code" );
                    const ulIndex = +$ul.data( "index" );
                    if ( $ul.next().length ) {

                        // 移除当前列表后面的所有列表
                        !(function removeNextList () {
                            const $nextList = $ul.next();
                            if ( $nextList.length ) {
                                $nextList.remove();
                                if ( $ul.next().length ) {
                                    removeNextList();
                                }
                            }
                        })();
                    }

                    let promise = null;
                    if ( $list.find( "ul" ).length < opt.level ) {

                        // 向当前列表后面添加新列表
                        // 并重新计算 list 宽度
                        promise = new Promise(resolve => {
                            getData( code, ulIndex + 1 ).then(res => {
                                createList( res ).then(content => {
                                    $list.append( `<ul data-index="${ ulIndex + 1 }">${ content }</ul>` );
                                    resolve();
                                }).then(() => {
                                    const $allUL = $list.find( "ul" );
                                    $list.css( "width", `${ $allUL.length * parseInt( ulWidth ) }px` );

                                    // 向新列表添加高度限制
                                    if ( maxHeight ) {
                                        $allUL.css({
                                            minHeight: maxHeight,
                                            maxHeight: maxHeight
                                        });
                                    }
                                    // 移除最后一级列表的箭头
                                    if ( $list.find( "ul" ).length === opt.level ) {
                                        $list.find( "ul:last-child i" ).remove();
                                    }
                                })
                            })
                        })
                    } else {

                        // 如果点击的是最后一个列表
                        // 则自动关闭全部列表
                        // 使用延时让后续代码先执行
                        util.delayTimer().then(() => {
                            closeList( $list.get() );
                        })
                    }

                    // 选中项高亮显示
                    $ul.find( "li" ).removeClass( "iPicker-list-active" );
                    $li.addClass( "iPicker-list-active" );

                    // 存储选中结果
                    // 显示选中内容
                    cacheSelected();
                    let result = cacheIPicker.value.get( _target )[ 1 ].join( ` ${ ( opt.separator + "" ).charAt( 0 ) } ` );
                    if ( opt.onlyShowLastLevel ) {
                        const lastIndexOf = result.lastIndexOf( opt.separator + " " );
                        if ( lastIndexOf > 0 ) {
                            result = result.substr( result.lastIndexOf( opt.separator + " " ) + 2 );
                        }
                    }
                    showSelected( result, 1 );

                    // onSelect 事件
                    if ( onSelectIsFunc && onSelectFlag ) {

                        // 执行 onSelect 事件
                        opt.onSelect.call( $li, ...cacheIPicker.value.get( _target ) );
                    }
                }
            })
        }

        // 自动加载第一级数据
        getData( isInnerData ? "86" : null, 1 ).then(res => {
            createList( res ).then(content => {
                const $ul = $target.find( "ul" );
                $ul.first().html( content );

                // 设置了默认值
                if ( hasSelected ) {
                    (function create ( i ) {    
                        if ( i < opt.level - 1 ) {
                            getData( opt.selected[ i ], i + 1 ).then(res => {
                                createList( res ).then(content => {
                                    $ul.eq( i + 1 ).html( content );
                                    create( ++i );
                                })
                            })
                        } else {
                            opt.selected.forEach(code => {
                                $ul.find( `[data-code="${ code }"]` ).addClass( "iPicker-list-active" );
                            })
                            let cascaderResult = "";
                            $target.find( ".iPicker-list-active" ).each(function ( i ) {
                                if ( selectTheme ) {
                                    showSelected( $( this ).data( "name" ), i + 1 );
                                } 
                                if ( cascaderTheme ) {
                                    cascaderResult += `${ $( this ).find( "span" ).text() } ${ ( opt.separator + "" ).trim().charAt( 0 ) } `;
                                }
                            })
                            cacheSelected();
                            if ( cascaderTheme ) {
                                const $allUL = $list.find( "ul" );
                                $list.css( "width", `${ $allUL.length * parseInt( $allUL.first().css( "width" ) ) }px` );
                                showSelected( cascaderResult.substr( 0, cascaderResult.length - 2 ), 1 );
                            }
                            if ( util.isFunction( opt.selectedCallback ) ) {
                                opt.selectedCallback( ...cacheIPicker.value.get( _target ) );
                            }
                        }
                    })( 0 );
                }
            })
        })

        // 点击空白处隐藏列表
        $( document ).click(function ( event ) {
            $container.each(function ( i ) {
                if ( event.target !== this && !this.contains( event.target ) ) {
                    closeList( $list.eq( i ).get() ); 
                }
            })
        })

        return ID;
    }

    // 获取选中结果
    iPicker.get = ( id, type ) => {
        const $target = cacheIPicker.storage.get( id );
        if ( !id || !$target ) {
            return;
        }
        const result = cacheIPicker.value.get( $target );
        if ( !type || type === "code" ) {
            return result[ 0 ];
        }
        if ( type === "name" ) {
            return result[ 1 ];
        }
        if ( type === "all" ) {
            return result[ 2 ];
        }
    }

    // 清空选择
    iPicker.clear = id => {
        const _target = cacheIPicker.storage.get( id );
        const $target = $( _target );
        if ( !id || !_target ) {
            return;
        }
        cacheIPicker.value.get( _target, [ [], [], [] ] );
        $target.find( "input" ).val( "" );
        $target.find( ".iPicker-list-active" ).removeClass( "iPicker-list-active" );
        $target.find( ".iPicker-container" ).each(function ( i ) {
            if ( i ) {
                $( this ).find( "ul" ).html( "" );
            }
        })
            
        // cascader 主题
        if ( $target.find( ".iPicker-cascader" ).length ) {
                $target.find( "ul" ).each(function ( i ) {
                    i && $( this ).html( "" );
                })
            }

            // 滚动条回顶
            $target.find( ".iPicker-list" ).get().scrollTop = 0;
            $target.find( "ul" ).get().scrollTop = 0;
    }

    // 重置组件
    iPicker.reset = id => {
        const _target = cacheIPicker.storage.get( id );
        if ( !id || !_target ) {
            return;
        }
        iPicker( _target, cacheIPicker.options.get( _target ) );
    }

    // 销毁组件
    iPicker.destroy = id => {
        const _target = cacheIPicker.storage.get( id );
        if ( !id || !_target ) {
            return;
        }
        $( _target ).html( "" );
        const deleteSuccessFlag = cacheIPicker.delete( id );
        if ( deleteSuccessFlag ) {
            if ( !$( ".iPicker-container" ).length ) {
                $( "#iPicker-style, .iPicker-style-custom-active-color" ).remove();
            }
        }
    }

    // 启用组件
    iPicker.enabled = ( id, level ) => {
        const _target = cacheIPicker.storage.get( id );
        if ( !id || !_target ) {
            return;
        }
        $( _target ).each(function () {
            const $disabled = $( this ).find( ".iPicker-disabled" );
            if ( $disabled.length ) {
                if ( !level || level === true || $( this ).find( ".iPicker-cascader" ).length ) {
                    $disabled.removeClass( "iPicker-disabled" );
                } else {
                    if ( util.isCorrectNumber( level ) ) {
                        level = [ level ];
                    }
                    if ( Array.isArray( level ) && level.length ) {
                        level.forEach(v => {
                            if ( v >= 1 && v <= 3 ) {
                                $disabled.eq( v - 1 ).removeClass( "iPicker-disabled" );
                            }
                        })
                    }
                }
            }
        })
    }

    // 禁用组件
    iPicker.disabled = ( id, level ) => {
        const _target = cacheIPicker.storage.get( id );
        if ( !id || !_target ) {
            return;
        }
        $( _target ).each(function () {
            const $result = $( this ).find( ".iPicker-result" );
            if ( $result.length ) {
                if ( !level || level === true || $( this ).find( ".iPicker-cascader" ).length ) {
                    $result.addClass( "iPicker-disabled" );
                } else {
                    if ( util.isCorrectNumber( level ) ) {
                        level = [ level ];
                    }
                    if ( Array.isArray( level ) && level.length ) {
                        level.forEach(v => {
                            if ( v >= 1 && v <= 3 ) {
                                $result.eq( v - 1 ).addClass( "iPicker-disabled" );
                            }
                        })
                    }
                }
            }
        })
    }

    return iPicker;
});
