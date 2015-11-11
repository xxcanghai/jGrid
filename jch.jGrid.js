//create:   2014-12-3
//update:   2015-4-9
//-------jch.jGrid-------
try {
    (function ($) {
        "use strict";
        window.jch = window.jch || {};
        var jch = window.jch;
        var core = jch.Core;

        //表格构造函数
        jch.jGrid = jGrid;
        function jGrid(config) {
            if (this === window.jch) return new window.jch.jGrid(config);
            config = $.extend(true, {
                element: $("<table>"),//要写入的jquery对象
                headers: [],//每列config，详下下方的config.headers
                toolbars: [],//工具栏config，详下下方的config.toolbars
                pager: null,//pagerDefaultConfig
                checkable: {
                    //是否含有复选框或单选钮
                    model: window.jch.jGrid.checkableModelEnum.none,//0无 1单选 2多选
                    index: 0,//复选框列的默认位置
                    width: "30px",//复选框列宽度
                    checkbox: {
                        //普通复选框
                        checked: false,//是否选中，布尔值或函数，函数第1个参数为单元格数据，第2个参数为行数据，第3个为单元格对象，返回布尔值来设定是否选中
                        enabled: true,//是否可用，布尔值或函数，函数第1个参数为单元格数据，第2个参数为行数据，第3个为单元格对象，返回布尔值来设定是否可用
                        //onCreateCheckbox: $.noop,//当创建复选框时触发，返回布尔值，设置复选框是否勾选 todo 转换成change函数
                        onCheckedChange: $.noop,//当checked属性变更后发生//原始名称checkedFn
                        onBeforeCheckedChange: $.noop,//当checked属性变更前发生
                        onEnabledChange: $.noop,//当enabled属性变更后发生
                        onBeforeEnabledChange: $.noop//当enabled属性变更前发生
                    },
                    checkall: {
                        //全选框
                        checked: false,//是否选中.布尔值或函数，函数无参数，返回布尔值来设定是否选中
                        enabled: true,//是否可用.布尔值或函数，函数无参数，返回布尔值来设定是否可用
                        onCheckedChange: $.noop,
                        onBeforeCheckedChange: $.noop,
                        onEnabledChange: $.noop,
                        onBeforeEnabledChange: $.noop
                    }
                },
                expand: {
                    //是否有行展开功能
                    model: window.jch.jGrid.expandModelEnum.none,//0无 1单项展开 2多项展开
                    index: null,//展开单元格在第几列，默认不传为最后一列(index优先级高于checkable.index)
                    width: "60px",//展开列宽度
                    onBeforeExpand: $.noop,//当准备展开时触发
                    onExpand: $.noop,//当展开后触发
                    onBeforeCollapse: $.noop,//当准备折叠时触发
                    onCollapse: $.noop//当折叠后触发
                },
                drag: {
                    //是否有行拖拽(来移动行位置)功能
                    model: window.jch.jGrid.dragModelEnum.none,//0无 1单行拖拽 2多行(打钩行)拖拽
                    index: 0,//拖拽单元格在第几列(index优先级高于expand.index)
                    width: "8px",//拖拽列宽度
                    delegateSelector: "[celltype='jCellDrag'] .dragBlock",//在表格中代理拖拽事件开始的选择器
                    onBeforeDrag: $.noop,//当鼠标点击并准备拖拽时发生，可返回false阻止拖拽
                    onDrag: $.noop,//当鼠标点击并未释放时（拖着行移动时）发生，可返回false阻止内部默认的显示行实时位置操作
                    onBeforeDrop: $.noop,//当鼠标释放，拖放操作完成前发生，可返回false阻止默认的行移动操作
                    onDrop: $.noop,//当鼠标释放，拖放操作完成后发生
                    onDragError: $.noop,//当拖拽操作失败时发生
                    onDragComplete: $.noop//当拖拽操作完成，浮动层隐藏后发生（无论拖拽操作是否成功都会触发）
                },
                sort: {
                    model: window.jch.jGrid.sortModelEnum.none,//排序模式，0无排序，1单页排序，2所有数据排序（仅前端分页）
                    onBeforeSort: $.noop,//在某列准备排序前发生
                    onSort: $.noop//在某列排序完成后发生
                },
                //--功能配置--
                config: {
                    isShowColHeader: true,//是否显示列头行
                    isShowColHeaderText: true,//是否显示列头文字
                    isShowFooter: true,//是否显示页脚行
                    isShowDefaultValue: true,//是否显示单元格默认值
                    isStaticPage: false,//是否静态分页(true前端分页，false后台分页)
                    defaultValue: "－"//全局单元格默认值内容(可在headers中单独设定以覆盖全局默认值)
                }
            }, config);
            var headerDefault = {
                text: "",//列头显示的文字
                field: "",//绑定数据的字段名称
                width: "",//列宽（css样式）
                name: undefined,//单元格名称key,默认值undefined，由jCell内部生产随机name
                value: null,//可以是一个回调函数或字符串，在cellCb前执行，用来在传给jCell前的数据源做处理,参数与cellCb一致。
                cellCb: null,//重新定义单元格内部内容的函数，默认为字段对应值。第1个参数为字段的值，第2个参数为当前‘行’对象,this为单元格实例化对象
                cellHeaderCb: null,//重新定义单元格内部内容的函数，默认为字段对应值。第1个参数为字段的值，第2个参数为当前‘行’对象,this为单元格实例化对象
                cellType: jch.jGrid.jCell,//单元格类型，需要继承jCell类型
                sortModel: null,//排序模式jGrid.sortModelEnum枚举（默认null为使用全局设定；可覆盖全局设定）
                sortbyModel: jch.jGrid.sortbyModelEnum.string,//排序依据（只在sortModel!=none时有效）或传一个函数自定义排序规则
                defaultValue: null//当单元格以默认方式显示且无内容时显示的默认值（只有当jGrid的config字段isShowDefaultValue=true时有效）
            };
            config.headers = $.map(config.headers, function (a) {
                return $.extend(true, $.extend(true, {}, headerDefault), a);
            });
            config.toolbars = $.map(config.toolbars, function (a) {
                return $.extend(true, $.extend(true, {}, headerDefault, { cellType: jch.jGrid.jCellToolBar }), a);
            });
            var _this = this;
            //--this prop--
            _this = $.extend(true, _this, config);
            _this.dataSource = []; //为服务器返回对象中的纯数据数组，在静态分页下表示当前显示的数据
            _this.dataSourceAll = []; //用户静态分页给外部返回完整数据，在后台分页的情况下于DataSource一致
            //--this method--
            _this.setData = setData;
            _this.getData = getData;
            _this.getRows = getRows;
            _this.getHeaderRow = getHeaderRow;
            _this.getFooterRow = getFooterRow;
            _this.getCheckedRow = getCheckedRow;
            _this.removeRowsByType = removeRowsByType;
            _this.clearRows = clearRows;
            _this.createRow = createRow;
            _this.insertRow = insertRow;
            _this.moveRows = moveRows;
            _this.showEmpty = showEmpty;
            _this.syncDataOrder = syncDataOrder;
            _this.columnSort = columnSort;
            _this.getPageIndex = getPageIndex;
            _this.checkall = checkall;
            _this.getCheckall = getCheckall;
            //--define--
            var rows = []; //存放表格所有[数据]行
            var dom = {
                table: config.element,
                thead: $("<thead>"),
                tbody: $("<tbody>"),
                tfoot: $("<tfoot>")
            };
            var jcbCheckall = window.jch.jCheckBox(_this.checkable.checkall); //[全选]复选框
            var headerRow, footerRow, toolbarRow;
            var jGridName = "jGrid_" + core.getRandomStr(16);

            init();

            function init() {
                _this.element.data({ jGrid: _this }).addClass("jGrid");
                setCheckbox();
                setExpand();
                setDrag();

                createGrid();

                if (core.isIE) {
                    fixIE();
                }
            }

            function setCheckbox() {
                //jgrid作用域下 this==window
                if (_this.checkable.model == window.jch.jGrid.checkableModelEnum.none) return;
                var chkIndex = _this.checkable.index;
                var checkboxFnArr = []; //储存原始函数数组
                var checkboxFnNameArr = [//原始函数名
                    "checked",
                    "enabled",
                    "onCheckedChange",
                    "onBeforeCheckedChange",
                    "onEnabledChange",
                    "onBeforeEnabledChange"
                ];
                var checkallFnArr = [];
                var checkallFnNameArr = [
                    "checked",
                    "enabled",
                    "onCheckedChange",
                    "onBeforeCheckedChange",
                    "onEnabledChange",
                    "onBeforeEnabledChange"
                ];
                $.each(checkboxFnNameArr, function (i, ns) {
                    checkboxFnArr[i] = core.getDataByNS(_this.checkable.checkbox, ns);
                });
                $.each(checkallFnNameArr, function (i, ns) {
                    checkallFnArr[i] = core.getDataByNS(_this.checkable.checkall, ns);
                });
                var checkallHeader = {
                    text: "",
                    field: "",
                    width: _this.checkable.width || "30px",
                    name: "checkbox",
                    defaultValue: null,
                    value: null,
                    sortModel: jch.jGrid.sortModelEnum.none,
                    cellType: jch.jGrid.jCellRowHeader,
                    cellHeaderCb: function (cdata, rdata) {
                        //this==jCellColHeader
                        var cellHeaderCbThis = this;
                        var $head = $("<div>");
                        this.element.empty();
                        this.element.data("jCheckBox", jcbCheckall);
                        $head.append(jcbCheckall.element);
                        $head.append($("<span>").addClass("checkallLabel").html("全选")); //全选
                        if (_this.checkable.model === jch.jGrid.checkableModelEnum.single || _this.checkable.checkall == null) {
                            //jcbCheckall.element.hide();
                            $head.hide();
                        }
                        return $head;
                    },
                    cellCb: function (cdata, rdata) {
                        //this=jCellRowHeader，对应config中的cellType: jch.jGrid.jCellRowHeader
                        var cellCbThis = this;
                        $.each(checkboxFnNameArr, function (i, ns) {
                            //this=ns
                            if (typeof (checkboxFnArr[i]) === "function") {
                                _this.checkable.checkbox[ns] = function () {
                                    //this=jCheckBox
                                    var args = Array.prototype.slice.call(arguments);
                                    return checkboxFnArr[i].apply(this, args.concat([cdata, rdata, cellCbThis]));
                                };
                            }
                        });
                        var jcb = window.jch.jCheckBox(_this.checkable.checkbox); //[普通]复选框
                        cellCbThis.element.data("jCheckBox", jcb);
                        jcb.element.data("jCell", cellCbThis);
                        jcbCheckall.subCheckBoxArr.push(jcb);
                        //设定单选还是多选模式
                        if (_this.checkable.model === jch.jGrid.checkableModelEnum.single) {
                            jcbCheckall.initRadioButtonGroupMode(jcbCheckall.subCheckBoxArr);
                        } else if (_this.checkable.model === jch.jGrid.checkableModelEnum.multiple) {
                            jcbCheckall.initCheckAllMode(jcbCheckall.subCheckBoxArr);
                        } else {
                            throw Error("jCheckBox workMode Error!");
                        }

                        return jcb.element;
                    }

                };

                if (!$.isNumeric(chkIndex = Number(chkIndex)) || chkIndex < 0 || chkIndex > _this.headers.length) { throw Error("checkable index error"); return; }
                _this.headers.splice(chkIndex, 0, checkallHeader);
            }

            function createGrid() {
                dom.table.empty();
                dom.table.append(createRowHeader());
                dom.table.append(createRowBody());
                dom.table.append(createRowFoot());
                createToolBar();
                return dom.table;
            }

            function createRowHeader() {
                dom.thead.empty();
                headerRow = new jRowColHeader(_this, {
                    headers: _this.headers,
                    rowData: _this.headers
                });
                headerRow._createRow(dom.thead);
                //rows.push(rowHeader);//2015年4月12日 取消列头行加入rows数组
                //dom.thead.append(headerRow.element);
                return dom.thead;
            }

            function createRowBody() {
                jcbCheckall.subCheckBoxArr.length = 0; //清空复选框
                dom.tbody.empty();
                clearRows(); //只删除body行，保留标题行和页脚行,用于初始化后的setData用
                $.each(_this.dataSource, function (i, rowData) {
                    var r = createRow(jch.jGrid.jRow, rowData);
                    insertRow(r, rows.length);
                });

                //---end---
                inspectCheckall();
                return dom.tbody;
            }

            function createRowFoot() {
                dom.tfoot.empty();
                footerRow = new jRowFooter(_this, {
                    //headers: [],
                    //rowData: {}


                });
                footerRow._createRow(dom.tfoot);
                //rows.push(rowFoot);//2015年4月12日 取消列头行加入rows数组
                //dom.tfoot.append(footerRow.element);
                return dom.tfoot;
            }

            function createToolBar() {
                toolbarRow = new jRowToolBar(_this, {
                    headers: _this.toolbars,
                    rowData: _this.toolbars
                });
                //如果是IE8则将工具栏添加入列头行最后一个单元格
                if (!$.support.leadingWhitespace) {
                    //IE8
                    toolbarRow._createRow(headerRow.getCell(headerRow.cells.length - 1).element);
                } else {
                    //标准
                    toolbarRow._createRow(dom.thead);
                }
                return dom.thead;
            }

            function setPager(total, index) {
                if (_this.pager == null) return;
                _this.pager.setData(total, index);
            }

            function setExpand() {
                var expCfg = _this.expand, expEnum = jch.jGrid.expandModelEnum, expModel = null;
                var expIndex = _this.expand.index == null ? _this.headers.length : _this.expand.index;
                var expHeader = {
                    text: "",//ExpandButton
                    field: "",
                    width: _this.expand.width || "60px",
                    name: "expand",
                    defaultValue: null,
                    value: null,
                    sortModel: jch.jGrid.sortModelEnum.none,
                    cellType: jch.jGrid.jCellExpandButton,
                    cellHeaderCb: function (cdata, rdata) {
                    },
                    cellCb: function (cdata, rdata, $exp) {
                        var _this = this, args = $.makeArray(arguments);
                        $exp.bind("click", function (e) {
                            return expandBtnClick.apply(this, [e, _this].concat(args));
                        });
                    }
                };

                if (!$.isNumeric(expIndex = Number(expIndex)) || expIndex < 0 || expIndex > _this.headers.length) { throw Error("expand index error"); return; }
                if (expCfg.model === expEnum.none) return null;
                if (expCfg.model === expEnum.single || expCfg.model === expEnum.multiple) {
                    expModel = expCfg.model;
                } else {
                    throw Error("expandModelEnum Error");
                }
                //var expOrgEventFnDic = {
                //    onBeforeExpand: $.noop,
                //    onExpand: $.noop,
                //    onBeforeCollapse: $.noop,
                //    onCollapse: $.noop
                //};

                //$.each(expOrgEventFnDic, function (eveName, fn) {
                //    expOrgEventFnDic[eveName] = expCfg[eveName];
                //    expCfg[eveName] = function replaceExpandEventCallback() {
                //        var $expBtn = this.getCell("expand").element.data("jCellExpandButton");
                //        return expOrgEventFnDic[eveName].apply(this, Array.prototype.slice.call(arguments).concat($expBtn));
                //    };
                //});

                //插入header中
                _this.headers.splice(expIndex, 0, expHeader);

                function expandBtnClick(e, cell, cdata, rdata, $exp) {
                    //this=$exp(DOM)
                    var isReturn = false;
                    var expCell;
                    if (cell.row.getIsExpand()) {
                        //关闭展开行
                        if (cell.row.collapse(_this.expand) === false) return;
                        $exp.removeClass("expand").addClass("collapse");
                    } else {
                        //开启展开行
                        if (expModel === expEnum.single) {
                            $.each(_this.getRows(jch.jGrid.jRow), function (i, r) {
                                if (r.getIsExpand()) {
                                    if (r.collapse(_this.expand) === false) {
                                        isReturn = true;
                                        return false;
                                    } else {
                                        //若关闭其他展开行成功，则设定关闭行的展开按钮的样式
                                        expCell = r.getCell("expand");
                                        if (expCell instanceof jch.jGrid.jCellExpandButton) {
                                            var $expbtn = expCell.element.data("jCellExpandButton");
                                            $expbtn.removeClass("expand").addClass("collapse");
                                        }
                                    }
                                }
                            });
                            if (isReturn) return;
                        }

                        if (cell.row.expand(_this.expand) === false) return;
                        $exp.removeClass("collapse").addClass("expand");
                    }
                }
            }

            function setDrag() {
                var dragCfg = _this.drag, dragEnum = jch.jGrid.dragModelEnum, dragModel = null;
                var dragIndex = _this.drag.index == null ? 0 : _this.drag.index;
                var isDragDown = false, dragDownPoint = { x: 0, y: 0 };//标示鼠标是否按下，以及鼠标按下时距离第一个拖拽行左上角的偏移量
                var srcRowArr = [], srcCurrRow = null;//鼠标按下时的被拖拽行(要移动位置的原始行)
                var $dgTable = $("<table class='jGrid'>");
                var $dgTbody = $("<tbody>");
                var $dgThead = $("<thead>");
                var $dragPop = $("<div class='dragPop' draggable='true'>").append($dgTable.append($dgTbody).append($dgThead));//拖拽时显示的弹出层
                var dragHeader = {
                    text: "",//DragButton
                    field: "",
                    width: _this.drag.width || "8px",
                    defaultValue: "",
                    name: "drag",
                    value: "",
                    sortModel: jch.jGrid.sortModelEnum.none,
                    cellType: jch.jGrid.jCellDrag,
                    cellHeaderCb: function (cdata, rdata) { },
                    cellCb: function (cdata, rdata, $dg) {
                        var _this = this, args = $.makeArray(arguments);
                    }
                };

                if (!$.isNumeric(dragIndex = Number(dragIndex)) || dragIndex < 0 || dragIndex > _this.headers.length) { throw Error("dragIndex index error"); return; }
                if (dragCfg.model === dragEnum.none) return null;
                if (dragCfg.model === dragEnum.single || dragCfg.model === dragEnum.multiple) {
                    dragModel = dragCfg.model;
                } else {
                    throw Error("dragModelEnum Error");
                }
                _this.headers.splice(dragIndex, 0, dragHeader);
                $dragPop
                    .bind("mousemove", tbodyMove)
                    .bind("mouseup", tbodyMouseUp);
                dom.tbody
                    .bind("mousemove", tbodyMove)
                    .bind("mouseleave", tbodyMouseLeave)
                    .bind("dragover", tbodyDragOver)
                    .bind("drop", tbodyDrop)
                    .bind("mouseup", tbodyMouseUp);
                //代理行事件
                //.delegate("tr", "mouseup", tbodyMouseUp);
                dom.table
                    //代理拖拽块事件
                    .delegate(dragCfg.delegateSelector, "selectstart", dgOnSelectStart)
                    .delegate(dragCfg.delegateSelector, "dragstart", dgOnDragStart)
                    .delegate(dragCfg.delegateSelector, "mousedown", dgMouseDown)
                    .delegate(dragCfg.delegateSelector, "dragend", dgOnDragEnd)
                    .delegate(dragCfg.delegateSelector, "drag", dgOnDrag);

                //在拖拽块上按下鼠标
                function dgMouseDown(e) {
                    //console.log("dgMouseDown");
                    if (e.which != 1) return;
                    isDragDown = true;
                    //获取要拖拽的当前行(一个)
                    srcCurrRow = $(this).closest("tr").data("jRow");
                    if (srcCurrRow.jgrid !== _this) return;//过滤掉表格内链的子表格点击事件
                    //获取要拖拽的行(多个)
                    if (dragModel == dragEnum.single) {
                        srcRowArr = [srcCurrRow];
                    } else if (dragModel == dragEnum.multiple) {
                        if (srcCurrRow.checked()) {
                            srcRowArr = getCheckedRow().slice();
                        } else {
                            //在多行拖拽模式下没有拖拽打钩行按照单行拖拽来处理
                            srcRowArr = [srcCurrRow];
                        }
                    } else {
                        throw new Error("dragModelEnum Error");
                    }
                    //将要拖拽的行全部收缩
                    if ($.grep(srcRowArr, function (r) { return r.collapse() === false; }).length > 0) {
                        _this.drag.onDragError.call(_this, 102, "无法拖拽！部分拖拽行无法收缩展开行");
                        _this.drag.onDragComplete.call(_this, false, $dragPop);
                        isDragDown = false;
                        return;
                    }
                    //设定浮动层相对鼠标的偏移量
                    var rectRow = srcRowArr[0].element.get(0).getBoundingClientRect();
                    dragDownPoint.x = e.pageX - rectRow.left;
                    dragDownPoint.y = e.pageY - rectRow.top;
                    //将要拖拽行的副本添加入浮动层
                    $dgTbody.empty();
                    $.each(srcRowArr, function (i, r) {
                        if (i > 0) {
                            var prevRow = srcRowArr[i - 1];
                            var offset = r.getIndex() - prevRow.getIndex();
                            if (Math.abs(offset) > 1) {
                                for (var j = 0; j < offset - 1; j++) {
                                    //添加空行
                                    $dgTbody.append($("<tr class='dragEmptyTr'>"));
                                }
                            }
                        }
                        $dgTbody.append(r.element.clone());
                    });
                    //将拖拽浮动层添加入表格
                    if ($dragPop.closest(dom.table).length == 0) {
                        $dgThead.prepend(getHeaderRow().element.clone());
                        $dragPop.find("th").empty();
                        $dragPop.appendTo(dom.table);
                    }
                    //设置浮动层宽度
                    $dragPop.css("width", dom.table.width());
                    //触发用户注册拖拽前事件
                    if (_this.drag.onBeforeDrag.call(_this, srcRowArr, $dragPop) === false) {
                        isDragDown = false;
                        $dragPop.hide();//todo 希望可以修改为当用户取消拖拽或拖拽结束后，dragPop从表格中删除
                        return;
                    }
                    //将所有要移动的行设置为半透明
                    $.each(srcRowArr, function (i, r) {
                        r.element.addClass("dargHidden");
                    });
                    //显示浮动层，开始拖拽
                    $dragPop.show();
                    //设置浮动层位置
                    dragPopMove(e);
                }

                //在表格中移动鼠标
                function tbodyMove(e) {
                    if (!isDragDown || e.which != 1) return;
                    //console.log("tbodyMove", e);
                    dragPopMove(e);
                }

                //在表格中释放鼠标
                function tbodyMouseUp(e) {
                    if (!isDragDown || e.which != 1) { return; }
                    console.log("tbodyMouseUp", e.target);
                    isDragDown = false;
                    var isSucc = false;
                    var $target = $(e.target);
                    var jrowData = null;
                    while ($target.length > 0) {
                        jrowData = $target.data("jRow");
                        if ($target.is("tr") && jrowData !== undefined && jrowData.jgrid === _this) {
                            isSucc = dragSuccess(jrowData);
                            break;
                        } else {
                            $target = $target.parents("tr").eq(0);
                        }
                    }
                    dragBack(isSucc);
                }

                //在表格中鼠标离开
                function tbodyMouseLeave(e) {
                    if (!isDragDown) { return; }
                    //console.log("tbodyMouseLeave");
                    var $outEle = $(e.relatedTarget);
                    if (e.relatedTarget == null || e.relatedTarget == undefined || $outEle.closest(".dragPop").length == 0) {
                        isDragDown = false;
                        dragBack(false);
                    }
                }

                //#region 原生拖拽事件
                //在tbody上方拖拽经过
                function tbodyDragOver(e) {
                    //console.log("tbodyDragOver", e);
                    //e.preventDefault();//浏览器默认不允许dom拖拽，使用e.preventDefault可使得允许使用原生拖拽
                }

                //拖拽在tbody上释放
                function tbodyDrop(e) {
                    //console.log("tbodyDrop", e);
                }

                //阻止选取文字
                function dgOnSelectStart(e) {
                    //console.log("dgOnSelectStart", e);
                    e.preventDefault();
                }

                //准备拖拽
                function dgOnDragStart(e) {
                    //console.log("dgOnDragStart", e);
                    e.preventDefault();//在Chrome下，需阻止DragStart事件才能使MouseMove事件生效
                    //var ev = e.originalEvent;
                    //ev.dataTransfer.setData("text", "");
                    //ev.dataTransfer.setDragImage($tr.get(0), 0, 0);
                }

                //拖拽结束
                function dgOnDragEnd(e) {
                    //console.log("dgOnDragEnd", e);
                }

                //拖拽中
                function dgOnDrag(e) {
                    //console.log("dgOnDrag", e);
                }
                //#endregion

                //移动弹出拖拽层位置
                function dragPopMove(e) {
                    var pagePoint = { x: e.pageX, y: e.pageY };
                    var tableRect = dom.table.get(0).getBoundingClientRect();
                    tableRect.x = tableRect.left;
                    tableRect.y = tableRect.top;
                    if (dragDownPoint.x < dragDownPoint.y) {
                        dragDownPoint.x = 0;
                    } else {
                        dragDownPoint.y = 0;
                    }
                    //触发onDrag事件，可由用户直接修改各个参数坐标值对象
                    var userPoint = _this.drag.onDrag.call(_this, e, pagePoint, tableRect, dragDownPoint);
                    var dstPoint = {
                        x: pagePoint.x - tableRect.x - dragDownPoint.x + 1,
                        y: pagePoint.y - tableRect.y - dragDownPoint.y + 1
                    };
                    if (userPoint === false) {
                        //返回false则阻止浮动层移动
                        return;
                    } else if ($.isPlainObject(userPoint)) {
                        //返回对象则使用用户返回的坐标对象作为浮动层坐标
                        dstPoint = $.extend(true, dstPoint, userPoint);
                    }
                    //浮动层坐标使用的是相对于表格的坐标值
                    $dragPop.css({ "left": dstPoint.x + "px", "top": dstPoint.y + "px" });
                }

                //放弃拖拽，还原原始状态
                function dragBack(isSuccess) {
                    $dragPop.css({ "left": "", "top": "" }).hide(0);
                    //$dgTbody.empty();
                    $.each(srcRowArr, function (i, r) {
                        r.element.removeClass("dargHidden");
                    });
                    srcRowArr = [];
                    srcCurrRow = null;
                    _this.drag.onDragComplete.call(_this, isSuccess, $dragPop);
                }

                //成功拖拽，准备行移动
                function dragSuccess(dstRow) {
                    if ((dstRow.constructor !== jch.jGrid.jRow)) {
                        _this.drag.onDragError.call(_this, 103, "不能移动到展开行");
                        return false;
                    }
                    if (dstRow.getIsExpand() && dstRow.collapse() === false) {
                        _this.drag.onDragError.call(_this, 104, "无法移动，移动目标行的展开行无法收缩");
                        return false;
                    }
                    var dstIndex = dstRow.getIndex();
                    var currIndex = srcCurrRow.getIndex();
                    var range = dstIndex - currIndex;
                    if (_this.drag.onBeforeDrop.call(_this, dstRow, srcRowArr, range) === false) {
                        return false;
                    }
                    if (moveRows(srcRowArr, range)) {
                        _this.drag.onDrop.call(_this, dstRow, srcRowArr, range);
                        return true;
                    } else {
                        _this.drag.onDragError.call(_this, 105, "部分行移动失败");
                        return false;
                    }
                }
            }

            function fixIE() {
                /// <summary>
                /// 修复IE系列浏览器的各种bug
                /// </summary>
                /// <returns type=""></returns>

                //if (!core.isIE) return;
                //#region 修复IE下td内任意元素设置百分比高度无效的bug
                //todo 需要在jGrid添加入DOM后获取行高*80%的值赋值到下面
                _this.element.attr("jgridname", jGridName);
                //var $script = createScriptNode("alert(8)", false);
                //$script.get(0).onload = function () {
                //    console.log("onload");
                //};
                //$script.get(0).onreadystatechange = function () {
                //    console.log("onreadystatechange");
                //};
                //$script.get(0).addEventListener("load", function() {
                //    console.log("Listener Load");
                //});
                //$("body").append($script);

                //(t.currentStyle? t.currentStyle : window.getComputedStyle(t, null)).height
                //var styleNode = createStyleNode(core.stringFormat(".jGrid[jgridname='{0}'] .jComplexCell table { height:{1} }", jGridName, "80px"));
                //headerRow.getCell(headerRow.cells.length - 1).element.append(styleNode);
                //#endregion 


            }

            function createStyleNode(styleStr) {
                /// <summary>
                /// 动态创建一个style标签
                /// </summary>
                /// <param name="styleStr">样式标签内容，即CSS代码</param>
                /// <returns type="">返回生成style标签</returns>

                var box;
                if (core.isIE) {
                    box = $("<div>").get(0);
                    box.innerHTML = core.stringFormat("_<style type=\"text/css\">{0}</style>", styleStr);
                    box.removeChild(box.firstChild);
                    return $(box.firstChild);
                } else {
                    box = $("<style>").prop("innerHTML", styleStr);
                    return box;
                }
            }

            function createScriptNode(scriptStr, isAutoDispose) {
                /// <summary>
                /// 动态创建一个script标签
                /// </summary>
                /// <param name="scriptStr">脚本内容，即JS字符串</param>
                /// <param name="isAutoDispose">是否执行完自动删除script标签</param>
                /// <returns type="">返回生成的script标签</returns>

                if (typeof (isAutoDispose) != "boolean") isAutoDispose = true;
                var script;
                var randomStr = core.getRandomStr(16);
                if (isAutoDispose) {
                    scriptStr += ";$(\"[jgridscript='" + randomStr + "']\").remove();";
                }

                if (core.isIE) {
                    script = $("<div>").get(0);
                    script.innerHTML = core.stringFormat("_<script type=\"text/javascript\">{0}</script>", scriptStr);
                    script.removeChild(script.firstChild);
                    return $(script.firstChild).attr("jgridscript", randomStr);
                } else {
                    script = $("<script>").prop({
                        "src": "/Scripts/jch/jGrid/emptyJs.js",
                        "async": "true",
                        "type": "text/javascript"
                        //"innerHTML": scriptStr
                    }).attr("jgridscript", randomStr);
                    return script;
                }
            }


            //#region Tools

            //将对象转换成字典
            function objectToDictionary(obj) {
                var arr = [], c;
                $.each(obj, function (i, o) {
                    c = {};
                    c[i] = o;
                    arr.push(c);
                });
                return arr;
            }

            //设置jcb的工作模式，jcb为要设置的对象，setModel为要设置的工作模式，isCheckAll为是否为全选钮
            function setCheckBoxWorkMode(jcb, setModel, isCheckAll) {
                var wmEnum = window.jch.jCheckBox.workModeEnum;
                var modelEnum = window.jch.jGrid.checkableModelEnum;
                switch (setModel) {
                    case modelEnum.single:
                        {
                            jcb.setWorkMode(isCheckAll ? wmEnum.radioButtonGroup : wmEnum.radioButton);
                            break;
                        }
                    case modelEnum.multiple:
                        {
                            jcb.setWorkMode(isCheckAll ? wmEnum.checkall : wmEnum.checkBox);
                            break;
                        }
                    default:
                        {
                            throw Error("jCheckBox workMode Error!");
                        }
                }
            }

            //将行的绝对index值转换为相对于某类型行的相对index
            function rowIndexAbsToRel(index, rowType) {
                var tmpRows = getRows(rowType);
                return $.inArray(rows[index], tmpRows);
            }

            //将相对于某类型的相对行index转换为全部行数的绝对index
            function rowIndexRelToAbs(index, rowType) {
                var tmpRows = getRows(rowType);
                return $.inArray(tmpRows[index], rows);
            }

            //#endregion

            //#region Method

            //设定表格当前数据源
            function setData(dataArr, pageIndex, total) {
                if (!$.isArray(dataArr)) throw Error("dataArr must be an array");
                if (!$.isNumeric(pageIndex)) throw Error("缺少pageIndex参数");
                if (!$.isNumeric(total)) throw Error("缺少total参数");
                pageIndex = parseInt(pageIndex);
                if (window.isNaN(pageIndex) || pageIndex < 0) pageIndex = 1;
                if (!$.isNumeric(total)) total = dataArr.length;
                total = parseInt(total);

                //此处使用深拷贝，即jGrid插件外数组变更，不会导致插件内数据源变更
                _this.dataSource = $.extend(true, [], dataArr);
                //而dataSourceAll与dataSource数组共用内存，即有一方修改，另一方自动变更
                _this.dataSourceAll = _this.dataSource;


                if (dataArr.length == 0) {
                    _this.showEmpty();
                } else {
                    dom.thead.show();
                    dom.tbody.show();
                    dom.tfoot.show();
                    dom.table.find(".jEmpty").hide();
                }

                //createRowFoot();
                setPager(total, pageIndex);
                if (_this.config.isStaticPage === true) { //前台分页
                    if (_this.pager instanceof jch.jGrid.jPager) {
                        var pageSize = _this.pager.config.pageSize;
                        var start = (pageIndex - 1) * pageSize;
                        var end = start + pageSize;
                        _this.dataSource = _this.dataSource.slice(start, end);
                    }
                    createRowBody();
                } else if (_this.config.isStaticPage === false) { //后台分页
                    //setSinglePageData(total, pageIndex);
                    createRowBody();
                } else {
                    throw Error("isStaticPage error");
                }
            }

            //获取当前表格的数据源
            function getData(isSingle) {
                syncDataOrder();
                if (_this.config.isStaticPage === false) { //后台分页
                    return _this.dataSource;
                } else if (_this.config.isStaticPage === true) {
                    if (!!isSingle) {
                        return _this.dataSource;
                    } else {
                        return _this.dataSourceAll;
                    }
                } else {
                    throw Error("isStaticPage error");
                }
            }

            //获取指定类型的行 rowType为行构造函数,不传参数为返回所有行(不包含列表头和页尾行)
            function getRows(rowType) {
                if (rowType === undefined || rowType === null) return rows;
                if ((rowType.prototype instanceof jch.jGrid.jRow) == false) rowType = jch.jGrid.jRow;
                var resRows = $.grep(rows, function (r, i) {
                    return r.constructor === rowType;
                });
                return resRows;
            }

            //获取列头行对象
            function getHeaderRow() {
                return headerRow;
            }

            //获取列尾行对象
            function getFooterRow() {
                return footerRow;
            }

            //获取选中的行,isChecked为是否打钩，默认为true,isEnabled为是否可用，默认为true
            //如果想获取所有【可用的】不管勾选还是没勾选，则传参数(null,true)
            function getCheckedRow(isChecked, isEnabled) {
                isChecked = (isChecked === undefined) ? true : isChecked;
                isEnabled = (isEnabled === undefined) ? true : isEnabled;
                var jcbArr = jcbCheckall.getSubCheckBoxArr(isEnabled, isChecked);
                var rowArr = $.map(jcbArr, function (jcb, i) {
                    return jcb.element.data("jCell").row;
                });
                rowArr = rowArr.sort(function (a, b) {
                    return a.getIndex() - b.getIndex();
                });
                return rowArr;
            }

            //删除指定类型的行,不传参数为删除所有，返回被删除的行
            function removeRowsByType(rowType) {
                var delRows = getRows(rowType).slice(); //创建数组副本
                $.each(delRows, function (i, r) {
                    r.remove();
                });
                return delRows;
            }

            //删除所有数据行,保留列头行和页尾行
            function clearRows() {
                var delRows = [].concat(removeRowsByType(jch.jGrid.jRow))
                    .concat(removeRowsByType(jch.jGrid.jRowExpand));
                return delRows;
            }

            //创建一个row对象
            function createRow(rowType, rowDataObj) {
                var row = new rowType(_this, {
                    headers: _this.headers,
                    rowData: rowDataObj//objectToDictionary(rowData)
                });
                return row;
            }

            //插入一行 row:jRow或子类的实例化行对象,index:要插入的索引位置,索引为相对于数据行
            function insertRow(row, index) {
                if ((row instanceof jch.jGrid.jRow) == false) return null;
                if (index === undefined) index = rows.length;
                if ((typeof (index) != "number") || index < 0 || index > rows.length) throw Error("参数index错误"); //illegal parameter \"index\"
                index = parseInt(index);
                //---appendRow----
                row._createRow(dom.tbody);
                rows.splice(rows.length, 0, row);//插入内容行数组
                //---moveRow---
                row.moveTo(index, true);//忽略检查（用于解决在多行展开模式下，在阻止关闭展开行的上一行展开时导致的无法展开）
                return row;
            }

            //校验DOM行和内存rows中的行是否一致
            function checkRows() {
                $.each(dom.tbody.children("tr"), function (i, tr) {
                    var trIndex = $(tr).index();
                    var jrowIndex = $.inArray($(tr).data("jRow"), getRows());
                    if (trIndex != jrowIndex) {
                        throw Error("IndexErr $tr:" + trIndex + " jRow:" + jrowIndex);
                    }
                });
            }

            //移动一行或某些行,rowArr为要移动的行数组，range>0则下移，range<0为上移，具体数字为移动范围
            function moveRows(rowArr, range) {
                if (!(rowArr instanceof Array)) {
                    rowArr = [rowArr];
                }
                var isSuccess = true;
                $.each(rowArr, function (i, r) {
                    if (!(r instanceof jch.jGrid.jRow)) return true;
                    if (range > 0) r = rowArr[rowArr.length - i - 1];
                    var dstIndex = r.getIndex() + range;
                    if (isNaN(dstIndex) || range == 0 || dstIndex < 0 || dstIndex > rows.length - 1) return false;
                    if ($.inArray(getRows()[dstIndex], rowArr) >= 0) return false;
                    if (r.moveTo(dstIndex) == null) {
                        isSuccess = false;
                    }
                });
                checkRows();
                return isSuccess;
            }

            //隐藏表格，显示一张小哭脸图片（一般用于无数据时的展示界面）
            //参数isShowSystemRow：是否显示系统行，如标题行，页码行等
            function showEmpty(isShowSystemRow) {
                isShowSystemRow = (typeof (isShowSystemRow) === "boolean") ? isShowSystemRow : false;
                var $jGrid = _this.element;
                if (isShowSystemRow) {
                    dom.tbody.hide();
                } else {
                    $jGrid.children().hide();
                }

                if ($jGrid.find(".jEmpty").length > 0) {
                    $jGrid.find(".jEmpty").show();
                } else {
                    $jGrid.append(
                        $("<td>").append(//fixIE8，在IE8下td元素才可以100%自适应宽
                            $("<div>").addClass("jEmpty_icon")
                        ).append(
                            $("<div>").text("当前没有任何内容").addClass("jEmpty_info")
                        ).addClass("jEmpty")
                    );
                }
            }

            //检查表格复选框当前是否应该打钩还是不打勾
            function inspectCheckall() {
                if (_this.checkable.model != window.jch.jGrid.checkableModelEnum.none) {
                    //重新刷新表格后,检查全选钮是否要勾选
                    jcbCheckall.inspectCheckAll();
                } else {
                    //nothing
                }
            }

            //将当前表格行顺序同步到数据源中
            function syncDataOrder() {
                var dataArr = [];
                var myrows = getRows(jch.jGrid.jRow);
                $.each(myrows, function (i, r) {
                    dataArr.push(r.rowData);
                });

                if (_this.config.isStaticPage === false) { //后台分页
                    _this.dataSource = dataArr;
                } else if (_this.config.isStaticPage === true) {
                    var startIdx = $.inArray(_this.dataSource[0], _this.dataSourceAll);
                    var endIdx = $.inArray(_this.dataSource[_this.dataSource.length - 1], _this.dataSourceAll);
                    var startArr = _this.dataSourceAll.slice(0, startIdx);
                    var endArr = _this.dataSourceAll.slice(endIdx + 1, _this.dataSourceAll.length);
                    var dataAllArr = startArr.concat(dataArr).concat(endArr);
                    _this.dataSource = dataArr;
                    _this.dataSourceAll = dataAllArr;
                } else {
                    throw Error("isStaticPage error");
                }
            }

            //按照某一列排序
            //todo 缺少可重置排序的功能
            function columnSort(columnIndex, sortbyModelOrFn, orderModel, isSingle) {
                columnIndex = Number(columnIndex);
                if (window.isNaN(columnIndex) || columnIndex < 0 || columnIndex > _this.headers.length) return false;
                if (sortbyModelOrFn == undefined) return false;
                if (typeof (isSingle) != "boolean") isSingle = true;
                var sortbyModel = sortbyModelOrFn;
                var sortbyEnum = jch.jGrid.sortbyModelEnum;
                var orderEnum = jch.jGrid.orderModelEnum;

                //检查排序顺序
                var isAsc;//是否为升序
                if (orderModel == orderEnum.asc) {
                    isAsc = true;
                } else if (orderModel == orderEnum.desc) {
                    isAsc = false;
                } else if (typeof (sortbyModel) !== "function") {
                    throw Error("orderModel error");
                }

                //检查排序依据
                var sortFn = $.noop;
                if (typeof (sortbyModel) === "function") {
                    sortFn = sortbyModel;
                } else if (sortbyModel == sortbyEnum.none) {
                    return false;
                } else if (sortbyModel == sortbyEnum.string) {
                    sortFn = function (a, b) {
                        return isAsc ? (a.localeCompare(b) > 0 ? true : false) : (b.localeCompare(a) > 0 ? true : false);//采用本地语言规则对比，中文采用拼音

                        //a = String(a);
                        //b = String(b);
                        //var aType = window.isNaN(Number(a)) ? "number" : "string";
                        //var bType = window.isNaN(Number(b)) ? "number" : "string";
                        ////如果两个参数均为字符串类型
                        //if (aType == "string" && bType == "string") {
                        //    return isAsc ? (a.localeCompare(b) > 0 ? true : false) : (b.localeCompare(a) > 0 ? true : false);//采用本地语言规则对比，中文采用拼音
                        //}
                        ////如果参数1为数字，参数2为字符串
                        //if (aType == "number" && bType == "string") {
                        //    return false;
                        //}
                        ////如果参数1为字符串，参数2为数字
                        //if (aType == "string" && bType == "number") {
                        //    return true;
                        //}
                        ////如果两个参数均为数字
                        //if (aType == "number" && bType == "number") {
                        //    if (a > b) return true;
                        //    if (a == b) return false;
                        //    if (a < b) return false;
                        //}

                        //localeCompare()方法的用法
                        //1、如果String对象按照字母顺序排在参数中的字符串之前，返回负数
                        //2、如果String对象按照字符顺序排在参数中的字符串之后，返回正数
                        //3、如果String对象等于参数中的字符串返回0
                    };
                } else if (sortbyModel == sortbyEnum.time) {
                    sortFn = function (a, b) {
                        return isAsc ? new Date(a) > new Date(b) : new Date(a) < new Date(b);
                    };
                } else if (sortbyModel == sortbyEnum.number) {
                    sortFn = function (a, b) {
                        return isAsc ? Number(a) > Number(b) : Number(a) < Number(b);
                    };
                } else {
                    throw Error("sortbyModel error");
                }

                //收缩所有行，准备排序
                var allRows = getRows().slice();//需创建副本
                var isCollapseSuccess = true;
                $.each(allRows, function (i, r) {
                    if (r.constructor === jch.jGrid.jRow && r.getIsExpand() && r.collapse() === false) {
                        isCollapseSuccess = false;
                        return false;
                    }
                });
                if (!isCollapseSuccess) {
                    return false;
                }

                //检查是否反序（解决的IE系列浏览器sort函数参数颠倒）
                var isReverse = false;
                [1, 2].sort(function (a, b) {
                    isReverse = a === 2;//火狐谷歌a为1，IEa为2
                });

                //开始排序
                var sortRows = isSingle ? getRows() : _this.dataSourceAll;//全部数据排序需要重新setData，当前页排序无需。
                sortRows.sort(function (a, b) {
                    if (isReverse) { var t = a; a = b; b = t; }
                    //按照数据源中的数据格式排序
                    var result = isSingle ?
                        sortFn(a.getCell(columnIndex).orgCellData, b.getCell(columnIndex).orgCellData, a.rowData, b.rowData, isAsc) : //当前页数据排序
                        sortFn(a[_this.headers[columnIndex].field], b[_this.headers[columnIndex].field], a.rowData, b.rowData, isAsc);//全部数据数据排序
                    if (isReverse) {
                        //FireFox支持sort函数返回布尔值，true为调换位置，false为不调换位置
                        //Chrome也支持sort函数返回布尔值，但是触发回调的a,b参数顺序有问题
                        //IE不支持sort函数返回布尔值，且a b对调，返回值也对调，此处将其标准化
                        return result ? -1 : 1;
                    } else {
                        return result ? 1 : -1;
                    }
                });

                if (isSingle) {
                    //将所有行移入临时容器再移动回来
                    var $temp = $("<tbody>");
                    $.each(sortRows, function (i, r) {
                        $temp.append(r.element);
                    });
                    $.each(sortRows, function (i, r) {
                        dom.tbody.append(r.element);
                    });
                    //检查内存行和DOM行索引是否一致
                    checkRows();
                } else {
                    _this.setData(_this.dataSourceAll, 1, _this.dataSourceAll.length);//显示全部数据排序后的第一页
                    //_this.setData(_this.dataSourceAll, _this.getPageIndex(), _this.dataSourceAll.length);//显示全部数据排序后的当前页
                }
                return true;
            }

            //获取当前表格显示的页码
            function getPageIndex() {
                if (_this.pager instanceof jch.jGrid.jPager) {
                    return _this.pager.getPageIndex();
                } else {
                    return 1;
                }
            }

            //获取或设置全选钮的选中状态
            function checkall(isChecked) {
                isChecked = (typeof (isChecked) === "boolean") ? isChecked : undefined;
                if (_this.checkable.model === window.jch.jGrid.checkableModelEnum.none) {
                    return (isChecked === undefined) ? false : null;//取值失败返回false，设置值失败返回null
                }

                if (isChecked === undefined) {
                    return jcbCheckall.getIsChecked();
                } else {
                    jcbCheckall.change(isChecked, false, null);
                }
            }

            //获取全选钮原始jCheckBox对象
            function getCheckall() {
                return jcbCheckall;
            }
            //#endregion

            return _this;
        }
        jch.jGrid.checkableModelEnum = {
            none: 0,//无复选框和单选钮
            single: 1,//单选钮
            multiple: 2//复选框
        };
        jch.jGrid.expandModelEnum = {
            none: 0,//无展开功能
            single: 1,//只能单一展开
            multiple: 2//可以多项展开
        };
        jch.jGrid.dragModelEnum = {
            none: 0,//无拖拽功能
            single: 1,//只能单行拖拽
            multiple: 2//允许多行拖拽(打钩行)
        };
        jch.jGrid.sortModelEnum = {//排序数据源
            none: 0,//不排序
            single: 1,//只对当前页排序（不重复触发单元格构造器）
            all: 2//对所有数据排序（只在前端分页中生效；会重绘所有单元格）
        };
        jch.jGrid.sortbyModelEnum = {//排序依据
            none: 0,//不排序
            string: 1,//依据字符排序（转换为字符串按ASCII码排序）
            time: 2,//依据时间排序（转换为时间对象排序）
            number: 3//依据数值排序（转换为数值排序）
        };
        jch.jGrid.orderModelEnum = {//排序顺序
            none: 0,
            asc: 1,//升序
            desc: 2//降序
        };

        //表格行(<tr>) 构造函数
        //tbody数据源：[{name:"张三"},{age:24},{sex:"男"}]
        jch.jGrid.jRow = jRow;
        function jRow(jgrid, cfg) {
            var config = $.extend(true, {
                element: $("<tr>"),
                headers: [],
                rowData: {}
            }, cfg);
            var _this = this;
            _this = $.extend(true, _this, config);
            _this.rowData = cfg.rowData || {}; //此处使用共用内存，使得行数据源与jGrid的数据源可同步修改
            _this.jgrid = jgrid; //当前航所在的jGrid表格
            _this.cells = []; //当前行所包含的所有单元格
            _this._expandRow = null; //当前行对应的展开行

            init();

            function init() {
                _this.element.data({ jRow: _this });
                _this.element.attr("rowtype", core.getFunctionName(_this.constructor));
            }


            //jch.jGrid.jCellExt = core.inheritParasitic(jCellExt, jCellIcon);
            //jch.jGrid.jCellExt = core.inheritParasitic(jCellExt, jCellIconText);
            //function jCellExt(row, config) {
            //    jCellIcon.call(this, row, config);
            //    jCellIconText.call(this, row, config);
            //    var _this = this;
            //    var _base1 = jCellIcon.prototype;
            //    var _base2 = jCellIconText.prototype;
            //    jCellExt.prototype._createCell = function () {
            //        var _this = this;
            //        _base1._createCell.call(_this);
            //        _base2._createCell.call(_this);
            //    };
            //    jCellExt.prototype._getTriggerCbArgs = function () {
            //        var _this = this;
            //        var a1 = _base1._getTriggerCbArgs.apply(_this, $.makeArray(arguments));
            //        var a2 = _base2._getTriggerCbArgs.apply(_this, $.makeArray(arguments));
            //        return a2.concat(a1);
            //    };
            //    return _this;
            //}
            jRow.prototype._createRow = function ($appendToBox) {
                var cell, _this = this;
                _this.element.appendTo($appendToBox);
                $.each(_this.headers, function (i, head) {
                    var userCellType = null;
                    if ($.isArray(head.cellType) && head.cellType.length == 1) head.cellType = head.cellType[0];
                    if (head.cellType === jCell || head.cellType.prototype instanceof jCell) {
                        userCellType = head.cellType;
                    } else if ($.isArray(head.cellType)) {
                        throw Error("cellType error"); //有一些问题，jCellUserExtend单元格重复创建问题，row中cells重复的问题等等，暂时先屏蔽
                        userCellType = function jCellUserExtend(row, config) {
                            var cellThis = this;
                            $.each(head.cellType, function (j, t) {
                                t.call(cellThis, row, config);
                            });
                            jCellUserExtend.prototype._createCell = function () {
                                var _this = this;
                                $.each(head.cellType, function (j, t) {
                                    t.prototype._createCell.call(_this);
                                });
                            };
                            jCellUserExtend.prototype._getTriggerCbArgs = function () {
                                var _this = this;
                                var cbArr = [], argus = arguments;
                                $.each(head.cellType, function (j, t) {
                                    cbArr = t.prototype._getTriggerCbArgs.apply(_this, $.makeArray(argus)).concat(cbArr);
                                });
                                return cbArr;
                            };
                        };
                        $.each(head.cellType, function (j, t) {
                            userCellType = core.inheritParasitic(userCellType, t);
                        });
                    } else {
                        return true;
                    }
                    cell = new userCellType(_this, {
                        cellData: (_this.rowData instanceof Array) ? _this.rowData[i] : _this.rowData[head.field],
                        cellIndex: i,
                        header: head,
                        name: head.name
                    });
                    cell._createCellBase();
                });
            };

            //删除当前行，返回被删除的行jRow对象
            jRow.prototype.remove = function () {
                var _this = this;
                var allrows = _this.jgrid.getRows();
                var index = _this.getIndex();
                if (allrows.length == 0) {
                    console.log("当前表格没有行");
                    return _this;
                }
                if (index < 0) {
                    console.log("当前行没有在表格当中");
                    return _this;
                }
                //------
                _this.element.remove();
                return allrows.splice(index, 1)[0];
            };

            //行上移一行 不传参为上移一行
            jRow.prototype.moveUp = function (range) {
                var _this = this;
                range = arguments.length == 0 ? 1 : range;
                return _this.moveTo(_this.getIndex() - range);
            };

            //行下移一行 不传参为下移一行
            jRow.prototype.moveDown = function (range) {
                var _this = this;
                range = arguments.length == 0 ? 1 : range;
                return _this.moveTo(_this.getIndex() + range);
            };

            //移动到指定位置
            jRow.prototype.moveTo = function (dstIndex, isIgnoreCheck) {
                var _this = this;
                var rows = _this.jgrid.getRows();//此处必须返回jgrid下的所有行rows
                var currIndex = _this.getIndex();
                var dstRow = null, expRowDstIndex = null;
                isIgnoreCheck = typeof (isIgnoreCheck) != "boolean" ? false : isIgnoreCheck;
                if (!isIgnoreCheck && _this.getIsExpand() && _this.collapse() === false) {
                    console.log("无法移动，当前行的展开行无法收缩");
                    return null;
                }
                if (currIndex < 0) { throw Error("当前行不在表格中无法移动"); return _this; }
                dstIndex = parseInt(dstIndex);
                if (isNaN(dstIndex) || rows.length == 0 || dstIndex < 0 || dstIndex > rows.length - 1 || currIndex == dstIndex) return _this;
                dstRow = rows[dstIndex];
                if ((dstRow instanceof jch.jGrid.jRow) == false) {
                    throw Error("移动目标行错误");
                }
                if (!isIgnoreCheck && dstRow.getIsExpand() && dstRow.collapse() === false) {
                    console.log("无法移动，移动目标行的展开行无法收缩");
                    return null;
                }
                if (currIndex < dstIndex) {
                    //下移
                    if (dstRow instanceof jch.jGrid.jRowExpand) { dstRow = rows[++dstIndex]; }
                    dstRow.element.after(_this.element);
                    expRowDstIndex = dstIndex - 1;
                } else {
                    //上移
                    if (dstRow instanceof jch.jGrid.jRowExpand) { dstRow = rows[--dstIndex]; }
                    dstRow.element.before(_this.element);
                    expRowDstIndex = dstIndex + 1;
                }
                //变更行数据源顺序
                replace(currIndex, dstIndex);
                //如果当前行已展开则展开行应该跟随变动
                if (_this.getIsExpand()) { expandRowMove(); }

                function replace(src, dst) {
                    //利用splice自动将数组中抽出的对象自动前移，然后再插入回去
                    var t = rows.splice(src, 1)[0];
                    rows.splice(dst, 0, t);
                }

                function expandRowMove() {
                    //移动展开行的位置
                    _this.getExpandRow().moveTo(expRowDstIndex);
                }
                return _this;
            };

            //获取当前行的索引值
            jRow.prototype.getIndex = function () {
                var _this = this;
                var rowarr = _this.jgrid.getRows();
                var index = $.inArray(_this, rowarr);
                return index;
            };

            //获取当前行符合条件的某一个单元格,参数arg可为index，name
            jRow.prototype.getCell = function (arg) {
                var _this = this;
                if (typeof (arg) == "number") {
                    return _this.cells[parseInt(arg)];
                } else if (typeof (arg) == "string") {
                    var cs = $.grep(_this.cells, function (c, i) {
                        return c.name == arg;
                    });
                    if (cs.length > 1) {
                        console.log("发现重名单元格，返回数据可能不准确！");
                    }
                    return cs.length > 0 ? cs[0] : null;
                }
                return null;
            };

            //获取当前行是否展开了
            jRow.prototype.getIsExpand = function () {
                var _this = this;
                return _this._expandRow !== null;
            };

            //获取当前行的展开行
            jRow.prototype.getExpandRow = function () {
                var _this = this;
                return _this._expandRow;
            };

            //展开当前行，即在当前行下方展开一个新行
            jRow.prototype.expand = function (expCfg) {
                var _this = this, expEnum = jch.jGrid.expandModelEnum;
                if (_this.constructor !== jch.jGrid.jRow) { console.log("当前行不能展开"); return null; } //只有纯数据行jRow才能展开
                if (_this.getIsExpand() === true) { return null; }//console.log("当前行已经展开，不能再展开");
                //-------
                expCfg = $.extend(true, $.extend(true, {}, _this.jgrid.expand), expCfg);
                if (expCfg.onBeforeExpand.apply(_this, [_this.rowData]) === false) { return false; }
                var expRow = _this.jgrid.createRow(jch.jGrid.jRowExpand, " "); //todo 默认内容
                _this.jgrid.insertRow(expRow, _this.getIndex() + 1);
                _this._expandRow = expRow;
                //_this.element.addClass("expand");
                expCfg.onExpand.apply(_this, [_this.rowData, expRow.cells[0]]);
                return expRow;
            };

            //收缩当前行所对应的展开行
            jRow.prototype.collapse = function (expCfg) {
                var _this = this;
                if (_this.constructor !== jch.jGrid.jRow) { console.log("当前行不能收缩"); return null; }
                if (_this.getIsExpand() === false) { return null; }//console.log("当前行已经收缩，不能再收缩");
                //-------
                expCfg = $.extend(true, $.extend(true, {}, _this.jgrid.expand), expCfg);
                var expRow = _this.getExpandRow();
                if (expRow.constructor !== jch.jGrid.jRowExpand) { throw Error("展开的行不存在"); }
                if (expCfg.onBeforeCollapse.apply(_this, [_this.rowData, expRow.cells[0]]) === false) { return false; }
                _this._expandRow.remove();
                _this._expandRow = null;
                //_this.element.removeClass("expand");
                expCfg.onCollapse.apply(_this, [_this.rowData]);
                return expRow;
            };

            //获取当前行是否勾选
            jRow.prototype.checked = function (isChecked) {
                var _this = this;
                isChecked = (typeof (isChecked) === "boolean") ? isChecked : undefined;
                var jcb = _this.getCheckBox();
                if (jcb === null || jcb === undefined) {
                    return (isChecked === undefined) ? false : null;//取值失败返回false，设置值失败返回null
                }

                if (isChecked === undefined) {
                    return jcb.getIsChecked();
                } else {
                    jcb.change(isChecked, false, null);
                }
            };

            //获取当前行的系统复选框jcb对象
            jRow.prototype.getCheckBox = function () {
                var _this = this;
                var jcbCell = _this.getCell("checkbox");
                if ((jcbCell instanceof jch.jGrid.jCell) === false) return null;
                var jcb = jcbCell.element.data("jCheckBox");
                if ((jcb instanceof jch.jCheckBox) === false) return null;
                return jcb;
            }

            return _this;
        }

        //表格表头行 构造函数
        //thead数据源：[{text:"姓名"},{text:"年龄"},{text:"性别"}]
        jch.jGrid.jRowColHeader = core.inheritParasitic(jRowColHeader, jRow);
        function jRowColHeader(jgrid, config) {
            jRow.call(this, jgrid, config); //继承基类jRow
            var _this = this, _base = jRow.prototype;

            jRowColHeader.prototype._createRow = function ($appendToBox) {
                var _this = this, cellHeader;
                //_base._createRow.call(_this);//调用基类的_createRow
                _this.element.appendTo($appendToBox);
                $.each(_this.headers, function (i, head) {
                    cellHeader = new jch.jGrid.jCellColHeader(_this, {
                        element: $("<th>"),
                        cellData: _this.rowData[i],
                        cellIndex: i,
                        header: head,
                        name: head.name
                    });
                    cellHeader._createCell();

                    //全局设定：是否显示列头行，优先级最高
                    if (_this.jgrid.config.isShowColHeader === false) {
                        cellHeader.element.find("*").hide();
                        _this.element.css({ "height": "0", "border-bottom": "none" });
                    }
                });
            };

            return _this;
        }

        //表格表尾行 构造函数
        jch.jGrid.jRowFooter = core.inheritParasitic(jRowFooter, jRow);
        function jRowFooter(jgrid, config) {
            jRow.call(this, jgrid, config); //继承基类jRow
            var _this = this, _base = jRow.prototype;

            jRowFooter.prototype._createRow = function ($appendToBox) {
                var _this = this, cellHeader;
                //_base._createRow.call(_this);//调用基类的_createRow
                _this.element.appendTo($appendToBox);
                cellHeader = new jch.jGrid.jCellPager(_this, {
                    element: $("<td>"),
                    //cellData: _this.rowData[i],
                    cellIndex: 0
                    //header: {}
                });
                cellHeader._createCell();

                //全局设定：是否显示列页脚行，优先级最高
                if (_this.jgrid.config.isShowFooter === false) {
                    _this.element.css("display", "none");
                }
            };

            return _this;
        }

        //展开的行 构造函数
        jch.jGrid.jRowExpand = core.inheritParasitic(jRowExpand, jRow);
        function jRowExpand(jgrid, config) {
            jRow.call(this, jgrid, config); //继承基类jRow
            var _this = this, _base = jRow.prototype;

            jRowExpand.prototype._createRow = function ($appendToBox) {
                //todo need expand
                var _this = this, cellExpand;
                //_base._createRow.call(_this);//调用基类的_createRow
                _this.element.appendTo($appendToBox);
                cellExpand = new jch.jGrid.jCellExpand(_this, {
                    element: $("<td>"),
                    cellData: _this.rowData,
                    cellIndex: 0
                    //header: {}
                });
                cellExpand._createCell();
            };

            return _this;
        }

        //表格工具栏行 构造函数
        jch.jGrid.jRowToolBar = core.inheritParasitic(jRowToolBar, jRow);
        function jRowToolBar(jgrid, config) {
            config.element = $("<div>");
            jRow.call(this, jgrid, config); //继承基类jRow
            var _this = this, _base = jRow.prototype;

            jRowToolBar.prototype._createRow = function ($appendToBox) {
                var cell, _this = this;
                ////_base._createRow.call(_this);//调用基类的_createRow

                _this.element.appendTo($appendToBox);
                $.each(_this.headers, function (i, head) {
                    var userCellType = head.cellType;
                    if (head.cellType !== jCell && !(head.cellType.prototype instanceof jCell)) {
                        return true;
                    }
                    cell = new userCellType(_this, {
                        cellData: _this.rowData[i],
                        cellIndex: i,
                        header: head
                    });
                    cell._createCellBase();
                });
            };

            return _this;
        }

        //普通单元格(<td>) 构造函数
        jch.jGrid.jCell = jCell;
        function jCell(row, cfg) {
            var _this = this;
            var config = $.extend(true, {
                element: $("<td>"),
                cellData: "",
                cellIndex: -1,
                name: core.getFunctionName(_this.constructor) + "_" + core.getRandomStr(16),
                header: {}
            }, cfg);
            _this = $.extend(true, _this, config);
            _this.cellData = cfg.cellData;
            _this.row = row;
            _this.orgCellData = $.isPlainObject(_this.cellData) ? $.extend(true, {}, _this.cellData) :
                $.isArray(_this.cellData) ? $.extend(true, [], _this.cellData) : _this.cellData;


            jCell.prototype._init = function () {
                var _this = this;
                _this.element.empty();
                _this.element.data({ "jCell": _this });
                _this.element.attr("celltype", core.getFunctionName(_this.constructor));
            };

            //行对象 调用创建单元格方法
            jCell.prototype._createCellBase = function () {
                var _this = this;
                _this._triggerValueCb();
                _this._createCell();
                _this._triggerCellCb();
            };

            //触发单元格value回调(如果有)
            jCell.prototype._triggerValueCb = function (cbExtraArgs) {
                var _this = this;
                var cellResult = core.getValueByFnOrArg(_this.header.value, _this, [_this.cellData, _this.row.rowData].concat($.makeArray(arguments)));
                if (cellResult === undefined || cellResult === null) return cellResult; //函数无返回值或没传value参数则不做任何操作
                _this.cellData = cellResult;
                return cellResult;
            };

            //触发单元格cellCb回调(如果有)
            jCell.prototype._triggerCellCb = function () {
                var _this = this;
                var cellResult = core.getValueByFnOrArg(_this.header.cellCb, _this, [_this.cellData, _this.row.rowData].concat(_this._getTriggerCbArgs()));
                if (cellResult === undefined || cellResult === null) return cellResult;
                if (cellResult instanceof jQuery || core.isDomElement(cellResult)) {
                    _this.element.empty().append(cellResult);
                } else {
                    _this.element.empty().html(cellResult).attr("title", cellResult);
                }
                return cellResult;
            };

            //创建单元格(可被重写)参数celldata可重写单元格所需数据源
            jCell.prototype._createCell = function (celldata) {
                var _this = this;
                var cellResult = null;
                var defaultval = ""; //默认值
                //具体列默认值设定优先级高于全局默认值设定
                if (_this.row.jgrid.config.isShowDefaultValue) {
                    if (_this.header.defaultValue) {
                        defaultval = _this.header.defaultValue;
                    } else {
                        defaultval = _this.row.jgrid.config.defaultValue;
                    }
                }

                //设定单元格值的默认值
                if (_this.cellData === null || _this.cellData === undefined) {
                    cellResult = defaultval;
                } else {
                    cellResult = String(_this.cellData);
                    cellResult = cellResult.length == 0 ? defaultval : cellResult;
                }

                //在子类中可重定义_this.cellData的值
                if (celldata != undefined) {
                    cellResult = celldata;
                }
                var $span = $("<span>").html(cellResult).addClass("jCell");
                _this.element.data("jCellCore", $span); //设定核心单元格对象
                _this.element.append($span).attr("title", cellResult);
                return _this.element;
            };

            //获取需要触发单元格回调函数的参数列表
            jCell.prototype._getTriggerCbArgs = function (cbExtraArgs) {
                var _this = this;
                return $.makeArray(arguments);
            };

            //获取当前单元格核心数据jquery元素。返回null为不存在或被替换掉。
            jCell.prototype.getCore = function () {
                var _this = this;
                var $span = _this.element.data("jCellCore");
                if ($span == undefined || !($span instanceof jQuery) || $span.closest("[celltype]").length == 0) {
                    return null;
                }
                return $span;
            };

            //开启或关闭单元格编辑功能
            jCell.prototype.edit = function (isEdit, callbackOrConfig) {
                /// <summary>
                /// 获取或设定单元格编辑模式 不传参为获取当前是否在编辑模式，传参为[开启/关闭]编辑模式
                /// </summary>
                /// <param name="isEdit">开启还是关闭 编辑模式</param>
                /// <param name="callbackOrConfig">配置对象{callback回调函数,width定宽,height定高,result内部[确定/取消]流程,cellData要更新的数据源}</param>
                /// <returns type="boolean">返回布尔值为成功开启/关闭了编辑模式，返回null为操作失败（如已经开启了编辑再执行开启编辑模式）</returns>    

                var _this = this, $editBox = $(), currIsEdit = _this.getIsEdit();
                var $span = _this.getCore();
                if (callbackOrConfig == undefined) callbackOrConfig = {};
                if (typeof (isEdit) != "boolean") isEdit = !currIsEdit;
                if ($span == undefined || !($span instanceof jQuery) || $span.closest("[celltype]").length == 0) {
                    return null;
                }
                if (isEdit == currIsEdit) {
                    return null;
                }
                var editcfg = $.extend(true, {
                    callback: $.noop,//当编辑框准备关闭时触发的事件，回传三个参数： result是点击确定还是取消, $input.val()新文本值, $box编辑框jquery对象
                    width: "",//编辑框固定宽度值
                    height: "",//编辑框固定高度值
                    result: false,//重写插件内部流程，传true则强制执行用户点了[确定]流程，传false执行[取消]流程。用于ajax成功后可手动让插件认定你是点击了确定关闭的而更新数据
                    cellData: ""//重写单元格内部数据源
                }, (typeof (callbackOrConfig) == "function" ? { callback: callbackOrConfig } : callbackOrConfig));

                if (isEdit == true) {
                    //开启编辑模式
                    $span.hide(0);
                    _this.element.data("isEdit", true);
                    //$editBox = creatEditBox($span.text(), compCb, editcfg.callback);
                    $editBox = creatEditBox(_this.cellData, compCb, editcfg.callback);
                    $editBox.css({ "width": editcfg.width, "height": editcfg.height });
                    $span.after($editBox);
                    //$editBox.find(".ebText").focus();
                    _this.element.data("editBox", $editBox);
                    return true;
                } else {
                    //关闭编辑模式
                    compCb(editcfg.result, editcfg.cellData);
                    return false;
                }

                function compCb(result, newData) {
                    /// <summary>
                    /// 内部complete流程
                    /// </summary>
                    /// <param name="result">是确定退出还是取消退出</param>
                    /// <param name="newData">要更新的新数据源</param>

                    if (result) {
                        //如果点击[确认]退出则更新数据源
                        _this.setData(newData);
                    } else {
                        //nothing
                    }
                    //不管result真假都还原界面
                    $span.show(0);
                    _this.element.data("isEdit", false);
                    var $eb = _this.element.data("editBox");
                    if ($eb instanceof jQuery) $eb.remove(0);
                    _this.element.removeData("editBox");
                }

                function creatEditBox(text, completeCb, userCb) {
                    if (text == undefined) text = "";
                    if (typeof (userCb) != "function") userCb = $.noop;
                    if (typeof (completeCb) != "function") completeCb = $.noop;
                    var $box = $("<div>");
                    var $ltCont = $("<div>"); //layoutContent
                    var $ltLeft = $("<div>");
                    var $ltRight = $("<div>");
                    var $input = $("<input>");
                    var $cancel = $("<span>");
                    var $enter = $("<span>");
                    $box.addClass("jCellEditBox");
                    $ltCont.addClass("ltCont");
                    $ltLeft.addClass("ltLeft");
                    $ltRight.addClass("ltRight");
                    $input.keydown(textKeyDown).addClass("ebText").attr({ type: "text" }).val(text);
                    $enter.click(enterClick).text("√").addClass("btn btn-primary ebEnter");
                    $cancel.click(cancelClick).text("×").addClass("btn btn-default ebCancel");

                    $box.append($ltCont.append($ltLeft.append($input))).append($ltRight.append($enter).append($cancel));
                    return $box;

                    function cancelClick(e) {
                        triggerCallback(false);
                    }

                    function enterClick(e) {
                        triggerCallback(true);
                    }

                    function textKeyDown(e) {
                        if (e.keyCode == 13) { //按下回车
                            triggerCallback(true);
                        } else if (e.keyCode == 27) { //按下ESC
                            triggerCallback(false);
                        }
                    }

                    function triggerCallback(result) {
                        if (userCb.call(_this, result, $input.val(), $box) === false) return;
                        completeCb(result, $input.val());
                    }
                }
            };

            //获取单元格是否为编辑模式
            jCell.prototype.getIsEdit = function () {
                var _this = this;
                var $txt = _this.getCore();
                //单元格没有核心文字不可能开启编辑模式，遂直接返回false
                if ($txt == null) {
                    return false;
                }


                var isedit = _this.element.data("isEdit");
                if (isedit == undefined || isedit == false) {
                    return false;
                } else if (isedit == true) {
                    return true;
                } else {
                    throw Error("isEdit Error!");
                }
            };

            //重设单元格数据源，刷新显示,会重新触发value及cellCb等单元格回调函数
            jCell.prototype.setData = function (data) {
                var _this = this;
                //todo 变更行数据，变更当前数据源，变更_this属性，重新调用cellCb等函数刷新显示
                _this.cellData = data;
                _this.orgCellData = $.isPlainObject(_this.cellData) ? $.extend(true, {}, _this.cellData) :
                                    $.isArray(_this.cellData) ? $.extend(true, [], _this.cellData) : _this.cellData;

                if (_this.row.rowData instanceof Array) {
                    _this.row.rowData[_this.cellIndex] = _this.cellData;
                } else {
                    _this.row.rowData[_this.header.field] = _this.cellData;
                }

                _this._init();
                _this._createCellBase();
            };

            //需要放在原型函数定义后执行
            init();

            function init() {
                _this._init();
                _this.row.element.append(_this.element);
                _this.row.cells.push(_this);
            }

            return _this;
        }

        //列头单元格 构造函数【只能由程序内部调用，外部不要使用此类型】
        jch.jGrid.jCellColHeader = core.inheritParasitic(jCellColHeader, jCell);
        function jCellColHeader(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellColHeader.prototype._createCell = function (celldata) {
                var _this = this, tmpCellData = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this,$.makeArray(arguments));//调用基类的创建函数
                var $title = $("<span>").html(tmpCellData["text"]);
                var sortEnum = jch.jGrid.sortModelEnum;
                var sortModel = _this.header.sortModel == null ?
                    row.jgrid.sort.model : _this.header.sortModel;
                _this.element.append($title).data("jCellColHeader", $title)
                    .attr("title", tmpCellData["text"])
                    .attr("field", tmpCellData["field"])
                    .css("width", tmpCellData["width"]);

                //若给headers直接设定了允许排序则生成排序；若没有给具体headers设定而全局设定中设置了允许排序则也生成排序
                if (sortModel !== sortEnum.none) {
                    //添加排序元素
                    var $sort = $("<span>").addClass("sort").addClass("default");
                    _this.element.append($sort).data("sort", $sort)
                        .delegate("", "click", function jCellColHeaderSortClick(e) {
                            var sortbyEnum = jch.jGrid.sortbyModelEnum;
                            var orderEnum = jch.jGrid.orderModelEnum;
                            var isSingle = sortModel == sortEnum.single;

                            var $st = $(this).data("sort");
                            if ($st.is(".default")) {
                                $st.removeClass("default").addClass("asc");
                                row.jgrid.columnSort(_this.cellIndex, _this.header.sortbyModel, orderEnum.asc, isSingle);
                            } else if ($st.is(".asc")) {
                                $st.removeClass("asc").addClass("desc");
                                row.jgrid.columnSort(_this.cellIndex, _this.header.sortbyModel, orderEnum.desc, isSingle);
                            } else if ($st.is(".desc")) {
                                $st.removeClass("desc").addClass("asc");
                                row.jgrid.columnSort(_this.cellIndex, _this.header.sortbyModel, orderEnum.asc, isSingle);
                                //todo  缺少还原默认排序功能,暂时改为只能升序降序两项切换
                                //$st.removeClass("desc").addClass("default");
                                //row.jgrid.columnSort(_this.cellIndex, _this.header.sortbyModel, orderEnum.asc);
                            } else {
                                throw Error("sort model error");
                                //$st.removeClass("asc").removeClass("desc").addClass("default");
                            }

                            //当执行某列排序时将其他列排序规则都重置为default默认模式
                            $.each(row.jgrid.getHeaderRow().cells, function (i, c) {
                                var $s = $(c.element).data("sort");
                                if (($s instanceof jQuery) == false || $s === $st) return true;
                                $s.removeClass("asc").removeClass("desc").addClass("default");
                            });
                        });
                }

                //全局设定：是否显示列头单元格文字，优先级低于列头回调函数(可通过cellHeaderCb函数覆盖此操作)
                if (_this.row.jgrid.config.isShowColHeaderText === false) {
                    _this.element.attr("title", "").find("*").hide();
                }

                var cellResult = null;
                if (typeof (_this.header.cellHeaderCb) === "function") {
                    cellResult = _this.header.cellHeaderCb.call(_this, tmpCellData, _this.row.rowData);
                    if (cellResult === undefined) {
                        //函数无返回值或返回undefined则不做任何操作
                    } else if (cellResult instanceof jQuery || core.isDomElement(cellResult)) {
                        _this.element.empty().append(cellResult);
                    } else {
                        _this.element.empty().append($("<span>").html(cellResult)).attr("title", cellResult);
                    }
                }
            };
            return _this;
        }

        //行头单元格 构造函数【只能由程序内部调用，外部不要使用此类型】
        jch.jGrid.jCellRowHeader = core.inheritParasitic(jCellRowHeader, jCell);
        function jCellRowHeader(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellRowHeader.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this, $.makeArray(arguments));//调用基类的创建函数
            };
            return _this;
        }

        //表格页脚单元格 构造函数【只能由程序内部调用，外部不要使用此类型】
        jch.jGrid.jCellPager = core.inheritParasitic(jCellPager, jCell);
        function jCellPager(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype, jgrid = _this.row.jgrid;
            jCellPager.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this,$.makeArray(arguments));//调用基类的创建函数
                _this.element.attr("colspan", jgrid.headers.length);

                var pg = null;
                var oldBeforeFn = null;
                if ($.isPlainObject(jgrid.pager)) {
                    oldBeforeFn = jgrid.pager.onBeforePageChange;
                    jgrid.pager.onBeforePageChange = newBeforeFn;

                    pg = new jch.jGrid.jPager(jgrid.pager);
                } else if (jgrid.pager instanceof jch.jGrid.jPager) {
                    pg = jgrid.pager;
                } else {
                }
                jgrid.pager = pg;
                if (pg != null) {
                    _this.element.append(pg.element).data("jPager", pg);
                }


                function newBeforeFn(dstIndex, oldIndex) {
                    var result;
                    if ($.isFunction(oldBeforeFn)) {
                        result = oldBeforeFn.apply(this, $.makeArray(arguments));
                    }
                    if (result === false) return result;
                    if (jgrid.config.isStaticPage === true) {
                        jgrid.syncDataOrder();
                        jgrid.setData(jgrid.dataSourceAll, dstIndex, jgrid.dataSourceAll.length);
                    }
                    //后台翻页时重置所有列排序为default模式(在后台分页或单页排序模式下重置)
                    if (row.jgrid.config.isStaticPage == false || row.jgrid.sort.model == jch.jGrid.sortModelEnum.single) {
                        $.each(row.jgrid.getHeaderRow().cells, function (i, c) {
                            var $s = $(c.element).data("sort");
                            if (($s instanceof jQuery) == false) return true;
                            $s.removeClass("asc").removeClass("desc").addClass("default");
                        });
                    }
                    return result;
                }
            };
            return _this;
        }

        //展开行的单元格【只能由程序内部调用，外部不要使用此类型】
        jch.jGrid.jCellExpand = core.inheritParasitic(jCellExpand, jCell);
        function jCellExpand(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            //重写基类_createCell函数
            jCellExpand.prototype._createCell = function (celldata) {
                //todo..
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                _this.element.attr("colspan", _this.row.jgrid.headers.length).removeAttr("title");
                //var $btn = $("<button>").addClass("jCellExpand btn btn-primary").css("width", "100%");

                //_this.element.wrapInner($btn);
                //$btn = _this.element.children("button").eq(0);
                //_this.element.data("jCellExpand", $btn);
            };
            //jCellExpand.prototype._getTriggerCbArgs = function () {
            //    var _this = this;
            //    var $btn = _this.element.data("jCellExpand");
            //    return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($btn));
            //};

            return _this;
        }

        //拖拽行的单元格【只能由程序内部调用，外部不要使用此类型】
        jch.jGrid.jCellDrag = core.inheritParasitic(jCellDrag, jCell);
        function jCellDrag(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            //重写基类_createCell函数
            jCellDrag.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                var $dg = $("<div>").addClass("dragBlock").attr("draggable", true);
                _this.element.prepend($dg);
                _this.element.data("jCellDrag", $dg);
            };
            jCellDrag.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $dg = _this.element.data("jCellDrag");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($dg));
            };

            return _this;
        }

        //单选钮的单元格[数据源：布尔值，是否选中]
        jch.jGrid.jCellRadio = core.inheritParasitic(jCellRadio, jCell);
        function jCellRadio(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellRadio.prototype._createCell = function (celldata) { //重写基类_createCell函数
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this,$.makeArray(arguments)); //调用基类的创建函数
                var jcb = window.jch.jCheckBox();
                jcb.setWorkMode(window.jch.jCheckBox.workModeEnum.radioButton);
                jcb.change(cellResult);
                _this.element.data("jCheckBox", jcb);
                _this.element.append(jcb.element);
            };

            jCellRadio.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var jcb = _this.element.data("jCheckBox");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat(jcb));
            };
            return _this;
        }

        //含有图片的单元格[数据源：图片URL]
        jch.jGrid.jCellIcon = core.inheritParasitic(jCellIcon, jCell);
        function jCellIcon(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellIcon.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this,$.makeArray(arguments)); //调用基类的创建函数
                var $img = $("<img>").addClass("jCellIcon").attr("src", cellResult);
                _this.element.data("jCellIcon", $img);
                _this.element.append($img);
            };

            jCellIcon.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $img = _this.element.data("jCellIcon");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($img));
            };
            return _this;
        }

        //带复选框的单元格 构造函数[数据源：布尔值，是否选中]
        jch.jGrid.jCellCheckBox = core.inheritParasitic(jCellCheckBox, jCell);
        function jCellCheckBox(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellCheckBox.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this,$.makeArray(arguments)); //调用基类的创建函数
                var jcb = window.jch.jCheckBox();
                jcb.change(cellResult);
                _this.element.data("jCheckBox", jcb);
                _this.element.append(jcb.element);
            };

            jCellCheckBox.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var jcb = _this.element.data("jCheckBox");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat(jcb));
            };
            return _this;
        }

        //双行字段，表现为两行，第一行为列头文字，第二行字段值
        jch.jGrid.jCellField = core.inheritParasitic(jCellField, jCell);
        function jCellField(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            jCellField.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                var $title = $("<b>").text(_this.header.text);
                _this.element.prepend($("<br>")).prepend($title);
                _this.element.data("jCellField", $title);
            };
            jCellField.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $title = _this.element.data("jCellField");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($title));
            };
            return _this;
        }

        //单行字段，表现为两行，第一行为列头文字，第二行字段值
        jch.jGrid.jCellSingleField = core.inheritParasitic(jCellSingleField, jCellField);
        function jCellSingleField(row, config) {
            jCellField.call(this, row, config); //继承基类jCellField
            var _this = this, _base = jCellField.prototype;
            jCellSingleField.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                _this.element.find("br").last().remove();
            };
            return _this;
        }

        //复合型单元格，显示主要字段，单元格内横向跨越多列子单元格[特殊字段：colspan=跨越单元格数量]
        jch.jGrid.jCellComplexTitle = core.inheritParasitic(jCellComplexTitle, jCell);
        function jCellComplexTitle(row, config) {
            jCell.call(this, row, config);
            var _this = this, _base = jCell.prototype;
            jCellComplexTitle.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments));
                var $wraptd = $("<td>"); //最外层替代的包裹td
                //设定跨越的'次要字段'单元格数
                if (!$.isNumeric(_this.header.colspan)) {
                    var colspan = $.grep(_this.row.headers, function (hd, i) {
                        return hd.cellType === jch.jGrid.jCellComplexField;
                    }).length;
                    _this.header.colspan = colspan;
                }
                _this.header.colspan = parseInt(_this.header.colspan);
                $wraptd.addClass("jComplexCell").attr("colspan", _this.header.colspan + 1);
                _this.element.attr("colspan", _this.header.colspan);
                //逐级包裹元素
                _this.element.wrap($wraptd).wrap($("<table>")).wrap($("<tbody>")).wrap($("<tr class='jCellComplexTitleTr'>")).wrapInner($("<b>"));
                _this.element.closest(".jCellComplexTitleTr").after($("<tr class='jCellComplexFieldTr'>"));
                _this.element.closest("table").prepend($("<thead><tr style='height:0;'></thead>"));
            };
            return _this;
        }

        //复合型单元格，显示次要字段，表现为两行，第一行为列头文字，第二行字段值
        jch.jGrid.jCellComplexField = core.inheritParasitic(jCellComplexField, jCellField);
        function jCellComplexField(row, config) {
            jCellField.call(this, row, config); //继承基类jCellField
            var _this = this, _base = jCellField.prototype;
            jCellComplexField.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                if (_this.cellIndex <= 0) return; //对于第二行字段，不能位于第一个，即它前方必须有一个第一行字段
                var $fieldTr = $(); //要追加入紧邻前方的'主要字段'行
                var prevHeaders = $.grep(_this.row.jgrid.headers, function (a, i) { return i < _this.cellIndex; });
                $.each(prevHeaders, function (i, a) {
                    var idx = prevHeaders.length - i - 1;
                    var $titleTd = _this.row.cells[idx].element;
                    var $th = $("<th>").attr({ "name": _this.name }).css("width", _this.header.width);
                    var $thInTr;
                    if (prevHeaders[idx].cellType === jch.jGrid.jCellComplexTitle) {
                        $fieldTr = $titleTd.closest(".jCellComplexTitleTr").siblings(".jCellComplexFieldTr").eq(0);
                        if ($fieldTr.length > 0) {
                            //若当前td不存在于复合行中，再追加进去
                            if ($.inArray(_this.element.get(0), $.makeArray($fieldTr.children())) < 0) {
                                $fieldTr.append(_this.element);
                            }
                            //若当前th不存在于复合表格thead中，再追加进去
                            $thInTr = $titleTd.closest("table").find("thead tr:eq(0)");
                            if ($thInTr.find("[name='" + _this.name + "']").length == 0) {
                                $thInTr.append($th);
                            }
                        }
                        return false;
                    }
                });

                //复合型单元格次要字段应该在内链表格中占宽，遂在外层表格中清除th宽度
                _this.row.jgrid.getHeaderRow().cells[_this.cellIndex].element.css({ width: "0", padding: "0", margin: "0" });
            };
            return _this;
        }

        //按钮单元格[数据源：按钮文字,btnType：按钮类型]
        jch.jGrid.jCellButton = core.inheritParasitic(jCellButton, jCell);
        function jCellButton(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            //重写基类_createCell函数
            jCellButton.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                var $btn = $("<button>").addClass("jCellButton btn btn-primary").css("width", "100%");
                if (_this.header.btnType != undefined) {
                    $btn.removeClass("btn-primary").addClass("btn-" + _this.header.btnType);
                }
                _this.element.wrapInner($btn);
                $btn = _this.element.children("button").eq(0);
                _this.element.data("jCellButton", $btn);
            };
            jCellButton.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $btn = _this.element.data("jCellButton");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($btn));
            };
            //启用或禁用按钮
            jCellButton.prototype.enabled = function (isEnable) {
                //todo enabled功能
                console.log("enabled");
            };
            //获取当前单元格按钮是否可用
            jCellButton.prototype.getIsEnabled = function (isEnable) {
                //todo enabled功能
                console.log("enabled");
            };
            return _this;
        }

        //展开按钮单元格[数据源：无,expand:是否展开]
        jch.jGrid.jCellExpandButton = core.inheritParasitic(jCellExpandButton, jCell);
        function jCellExpandButton(row, config) {
            jCell.call(this, row, config); //继承基类jCell
            var _this = this, _base = jCell.prototype;
            //重写基类_createCell函数
            jCellExpandButton.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                //_base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                var $exp = $("<span>").addClass("jCellExpandButton");
                //console.log(_this.header)
                if (_this.header.expand === true) {
                    $exp.addClass("expand");
                } else {
                    $exp.addClass("collapse");
                }
                _this.element.append($exp);
                _this.element.data("jCellExpandButton", $exp);
            };
            jCellExpandButton.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $exp = _this.element.data("jCellExpandButton");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($exp));
            };
            return _this;
        }

        //图标+文字单元格[数据源：文字，特殊字段：icon=图标URL]
        jch.jGrid.jCellIconText = core.inheritParasitic(jCellIconText, jCellIcon);
        function jCellIconText(row, config) {
            jCellIcon.call(this, row, config); //继承基类jCellIcon
            var _this = this, _base = jCellIcon.prototype;
            //重写基类_createCell函数
            jCellIconText.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                var url = core.getValueByFnOrArg(_this.header.icon, _this, [cellResult, _this.row.rowData]);
                _base._createCell.apply(_this, $.makeArray(arguments).concat(url)); //调用基类的创建函数
                _base.__proto__._createCell.apply(_this, $.makeArray(arguments)); //调用jCell基类的创建函数
                var $text = _this.getCore();
                if ($text instanceof jQuery) {
                    //$text.css("margin-left", "8px");
                }
            };
            jCellIconText.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $text = _this.getCore();
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat([$text]));
            };
            return _this;
        }

        //工具栏单元格 图标+文字[数据源：文字，特殊字段：icon=图标URL，isCheckSelected=是否自动校验含有打钩项,没有打钩项则弹出提示框，onClick=注册点击事件]
        jch.jGrid.jCellToolBar = core.inheritParasitic(jCellToolBar, jCellIconText);
        function jCellToolBar(row, config) {
            jCellIconText.call(this, row, config); //继承基类jCellIconText
            var _this = this, _base = jCellIconText.prototype;
            //重写基类_createCell函数
            jCellToolBar.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                _this.element.wrapInner($("<a>").addClass("jCellToolBar")).css({ width: _this.header.width });
                var $a = _this.element.children(".jCellToolBar");
                _this.element.data("jCellToolBar", $a);
                //todo _this.header.isCheckSelected***
            };
            jCellToolBar.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $a = _this.element.data("jCellToolBar");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat([$a]));
            };

            /*
            //指定控件上的文本和图像彼此之间的相对位置。
            public enum TextImageRelation
            {
                //指定图像和文本共享控件上的同一空间。
                Overlay = 0,
                //指定图像垂直显示在控件文本的上方。
                ImageAboveText = 1,
                //指定文本垂直显示在控件图像的上方。
                TextAboveImage = 2,
                //指定图像水平显示在控件文本的前方。
                ImageBeforeText = 4,
                //指定文本水平显示在控件图像的前方。
                TextBeforeImage = 8
            }
            */
            return _this;
        }

        //头像+性别单元格[数据源：头像URL，特殊字段：gender=(0无/1男/2女)]
        jch.jGrid.jCellAvatar = core.inheritParasitic(jCellAvatar, jCellIcon);
        function jCellAvatar(row, config) {
            jCellIcon.call(this, row, config); //继承基类jCellIcon
            var _this = this, _base = jCellIcon.prototype;
            //重写基类_createCell函数
            jCellAvatar.prototype._createCell = function (celldata) {
                var _this = this, cellResult = (celldata === undefined) ? _this.cellData : celldata;
                _base._createCell.apply(_this, $.makeArray(arguments)); //调用基类的创建函数
                var $img = $("<span>").addClass("jCellAvatar");
                var $box = $("<span>").addClass("jCellAvatarBox");
                var gender = core.getValueByFnOrArg(_this.header.gender, _this, [cellResult, _this.row.rowData]);
                var genderClass = "";
                if ($.isNumeric(gender)) {
                    gender = parseInt(gender);
                    genderClass = (gender == 1) ? "iconMale" : (gender == 2) ? "iconFemale" : "";
                    $img.addClass(genderClass);
                } else {
                    $img.css("background-image", "url('" + gender + "')");
                }
                $box.append(_this.element.find("*")).append($img);
                _this.element.data("jCellAvatar", $img);
                _this.element.append($box);
            };
            jCellAvatar.prototype._getTriggerCbArgs = function () {
                var _this = this;
                var $img = _this.element.data("jCellAvatar");
                return _base._getTriggerCbArgs.apply(_this, $.makeArray(arguments).concat($img));
            };
            return _this;
        }

        //表格分页控件 构造函数
        jch.jGrid.jPager = jPager;
        function jPager(config) {
            config = $.extend(true, {
                element: $("<div>"),
                onBeforePageChange: $.noop,
                onPageChanged: $.noop,
                pageSize: 5,
                navPageSize: 5
            }, config);

            var _this = this;
            var totalCount = 0; //表格总记录数
            var pageIndex = 1; //表格当前页码
            var pageNum = 1; //表格总页数
            var navIndex = 1; //翻页当前页码
            var startItem = 0; //
            var endItem = 0;


            var sortEnum = {
                //翻页顺序枚举
                prev: -1,
                current: 0,
                next: 1
            };

            init();

            function init() {
                _this.config = config;
                _this.element = config.element;
                //--Method--
                _this.setData = setData;
                _this.reset = reset;
                _this.getPageIndex = getPageIndex;
                //--init--
                _this.element.data("jPager", _this);
                createNav();
                bind();
            }

            function createNav() {
                _this.element.empty();

                _this.element.append(
                    $("<span>").addClass("pageInfo")
                ).append(
                    $("<span>").append(
                        $("<input type='text'>").addClass("pageSearch_text")
                    ).append(
                        $("<input type='button' value='跳转'>").addClass("pageSearch_btn btn btn-primary").click(function () {
                            var pageindex = parseInt(_this.element.find(".pageSearch_text").val());
                            if (!isNaN(pageindex)) {
                                gotoPage(pageindex);
                            } else {
                                _this.element.find(".pageSearch_text").val("");
                            }
                        })
                    ).addClass("pageSearch")
                ).append(
                    $("<span>").append(
                        //第一页
                        $("<a>").addClass("pagerItem firstBtn").attr({ "title": "第一页" }).click(function () {
                            gotoPage(1);
                        })
                    ).append(
                        //页码上一页
                        $("<a>").addClass("pagerItem pagePrevBtn").attr({ "title": "页码上一页" }).click(function () {
                            pageShowPage(sortEnum.prev);
                        })
                    ).append(
                        //上一页
                        $("<a>").addClass("pagerItem prevBtn").attr({ "title": "上一页" }).click(function () {
                            listShowPage(sortEnum.prev);
                        })
                    ).append(
                        //页码显示
                        $("<a>").addClass("pageItemBox")
                    ).append(
                        //下一页
                        $("<a>").addClass("pagerItem nextBtn").attr({ "title": "下一页" }).click(function () {
                            listShowPage(sortEnum.next);
                        })
                    ).append(
                        //页码下一页
                        $("<a>").addClass("pagerItem pageNextBtn").attr({ "title": "页码下一页" }).click(function () {
                            pageShowPage(sortEnum.next);
                        })
                    ).append(
                        //最后一页
                        $("<a>").addClass("pagerItem lastBtn").attr({ "title": "最后一页" })
                    ).addClass("pager")
                ).addClass("jPager");
            }

            function bind() {
                //防止快速点击前后翻页时而选中文字
                _this.element.bind("selectstart", function (e) {
                    var ev = e || window.event;
                    var target = ev.target || ev.srcElement;
                    if (target.tagName.toLowerCase() == "a") {
                        e.preventDefault();
                    }
                });
            }


            //页码翻页
            function pageShowPage(sort) {
                navIndex = navIndex + sort * 1;
                navIndex = correctData(navIndex, 1, pageNum);
                setNavPage(totalCount, navIndex);
            }

            //表格翻页
            function listShowPage(sort) {
                var dstIndex = pageIndex + sort * 1;
                pageChangeFn(dstIndex);
            }

            //跳转某一页
            function gotoPage(pageindex) {
                if (typeof pageindex != "number") return;
                var dstIndex = pageindex;
                pageChangeFn(dstIndex);
            }

            //翻页事件
            function pageChangeFn(dstIndex) {
                dstIndex = correctData(dstIndex, 1, pageNum);
                if (1 <= dstIndex && dstIndex <= pageNum) {
                    if (config.onBeforePageChange.call(_this, dstIndex, pageIndex) === false) {
                        //console.log("阻止翻页");
                        return;
                    }
                } else {
                    throw new Error("dstIndex error");
                }
                pageIndex = dstIndex;
                setData(totalCount, pageIndex);
                config.onPageChanged.call(_this, pageIndex);
            }

            //绑定数据
            function setData(total, index) {
                if (total <= 0) {
                    reset();
                } else {
                    totalCount = total; //Pager全局变量
                    pageIndex = index; //Pager全局变量
                    pageNum = Math.ceil(total / config.pageSize); //Pager全局变量

                    _this.element.find(".lastBtn").unbind("click").click(function () {
                        gotoPage(pageNum);
                    });

                    //设置显示页码
                    navIndex = toNavIndex(index);
                    //检验页码
                    pageIndex = correctData(pageIndex, 1, pageNum);
                    navIndex = correctData(navIndex, 1, toNavIndex(pageNum));
                    setNavPage(totalCount, navIndex);
                    //设置当页信息
                    setPageInfo(totalCount, pageIndex);
                }
            }

            //获取当前页码值
            function getPageIndex() {
                return pageIndex;
            }

            //设置翻页页码
            function setNavPage(total, navindex) {
                navindex = correctData(navindex, 1, toNavIndex(pageNum));
                var $pageItemBox = _this.element.find(".pageItemBox");
                $pageItemBox.empty();
                for (var i = 1; i <= config.navPageSize; i++) {
                    var showPage = (navindex - 1) * config.navPageSize + i;
                    if (showPage <= pageNum) {
                        $pageItemBox.append(
                            $("<a>").text(showPage).addClass(showPage === pageIndex ? "pagerItem borderChecked" : "pagerItem").click((function (n) {
                                return function () { gotoPage(n); }
                            }(showPage))
                            ));
                    } else {
                        break;
                    }
                }
            }

            //设置当页信息
            function setPageInfo(total, index) {
                var $pageInfo = _this.element.find(".pageInfo");
                $pageInfo.empty();
                var start = total <= 0 ? startItem : (index - 1) * config.pageSize + 1;
                var end = endItem;
                if (total > 0) end = correctData(start + config.pageSize - 1, 1, totalCount);
                $pageInfo.append(
                    $("<span>").text("显示" + start + "-" + end + "条，")
                ).append(
                    $("<span>").text("共" + total + "条")
                );
            }

            //重置pager数据为初始值
            function reset() {
                totalCount = 0;
                pageIndex = 1; //表格当前页码
                pageNum = 1; //表格总页数
                navIndex = 1; //翻页当前页码
                startItem = 0; //
                endItem = 0;
                setNavPage(totalCount, pageIndex);
                setPageInfo(totalCount, navIndex);
            }

            //表格pageIndex转化为页码pageIndex
            function toNavIndex(tableIndex) {
                var navindex = tableIndex % config.navPageSize === 0 ? tableIndex / config.navPageSize : parseInt(tableIndex / config.navPageSize) + 1;
                return navindex;
            }

            //数据范围矫正
            function correctData(val, min, max) {
                return val < min ? min : val > max ? max : val;
            }

            return _this;

        }
    }(jQuery));
} catch (e) { }
/*
//#region类继承模型

//定义基类
function Super(arg) {
    var _this = this;//基类实例化对象
    var myname='';//私有变量
    _this.name = '';//基类属性(子类可继承属性)
           
    init();//基类构造函数
    function init() {
        _this.name += "1";
        privateFn();//私有函数
    }
           
    //私有函数
    function privateFn() {
        _this.name += "2";
    }
           
    //基类方法（子类可继承、可重写、可在子类中重写后调基类方法）
    Super.prototype.overrideCreate = function () {
        _this.name += "3";
    };
           
    //基类方法（子类可继承、可重写、但不可在重写后调基类方法）
    _this.create = function () {
    };
           
    return _this;
}

//设定继承关系
core.inheritParasitic(Sub, Super);//(子类名, 基类名)

//定义子类
function Sub(arg) {
    //基类名.call(this, arg);//继承基类
    Super.call(this, arg);
    var _this = this;//子类实例化对象    
    var _base = Super.prototype;//基类对象
           
    _this.create();//调用基类方法
           
    //重新基类方法，并定义为可继续被继承并被基类调用的方法
    Super.prototype.overrideCreate = function () {
        _base.overrideCreate.call(_this);//调用基类的原方法(被重写的方法)
        _this.name += "4";//name最终为1234
    };
           
    return _this;
}
//#endregion
*/


/*
//#region 重要：关于this与_this的使用
//--正确--
function F() {
    var _this = this;
    _this.data = { f: 0 };
    _this.get = get;
    function get() {
        return _this.data;
    }
}
var f1 = new F(), f2 = new F();
console.log("F",f1.data === f2.data);//false
console.log("F",f1.get() === f2.get());//false


//--错误--
function G() {
    var _this = this;
    _this.data = { g: 0 };
    G.prototype.get = function () {
        return _this.data;
    };
}
var g1 = new G(), g2 = new G();
console.log("G",g1.data === g2.data);//false
console.log("G",g1.get() === g2.get());//true 错了！！


//--G改正--
function H() {
    var _this = this;
    _this.data = { h: 0 };

    H.prototype.get = function () {
        //改正方案1：将_this改为this
        //原始：return _this.data;
        //替换为：return this.data;

        //改正方案2：新增_this指向为当前函数的this
        //原始：return _this.data;
        //替换为：var _this=this;return _this.data;

        var _this = this;//方案2
        return _this.data;
    };
}
var h1 = new H(), h2 = new H();
console.log("G改",h1.data === h2.data);//false
console.log("G改",h1.get() === h2.get());//false 对了！！

//#endregion
*/
