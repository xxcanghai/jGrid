///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../Core/jch.Core.ts"/>
"use strict";
//create:   2014-12-5
//update:   2015-9-16
//-----jch.jCheckBox----
var jch;
(function (jch) {
    var jCheckBox = (function () {
        function jCheckBox(cfg) {
            this.config = null;
            this.element = null;
            this.subCheckBoxArr = [];
            this.workModeEnum = jch.jCheckBox.workModeEnum;
            this.styleModeEnum = jch.jCheckBox.styleModeEnum;
            this.checkedListener = $.noop;
            this.workMode = jCheckBox.workModeEnum.normal;
            this.styleMode = jCheckBox.styleModeEnum.checkBox;
            if (!(this instanceof jch.jCheckBox))
                return new jch.jCheckBox(cfg);
            //!+ ***jCheckBox默认选项***
            var dft = {
                element: $("<span>"),
                checked: false,
                enabled: true,
                //--Event--
                //所有事件内this指向为jCheckBox
                onCheckedChange: $.noop,
                onBeforeCheckedChange: $.noop,
                onEnabledChange: $.noop,
                onBeforeEnabledChange: $.noop //当enabled属性变更前发生，参数1个 enbState为即将变更为的布尔值可用状态
            };
            this.config = $.extend(true, dft, cfg);
            this.element = this.config.element;
            //检查重复定义
            if (this.element.data("jCheckBox") instanceof jch.jCheckBox) {
                return this.element.data("jCheckBox");
            }
            //初始化
            this.init();
        }
        jCheckBox.prototype.init = function () {
            this.checkFunctionBind();
            this.createDom();
            this.bind();
        };
        /**
         * 创建DOM结构
         * @returns
         */
        jCheckBox.prototype.createDom = function () {
            var c = this.config;
            var enabled = ((typeof (c.enabled) === "function") ? !!(c.enabled.call(this)) : !!c.enabled).toString();
            var checked = ((typeof (c.checked) === "function") ? !!(c.checked.call(this)) : !!c.checked).toString();
            var attrEm = jch.jCheckBox.attrEnum;
            this.element.addClass("jCheckBox").attr(attrEm.jenabled, enabled).attr(attrEm.jchecked, checked).attr(attrEm.workMode, this.workMode).attr(attrEm.styleMode, this.styleMode).data("jCheckBox", this);
        };
        /**
         * 进行DOM事件绑定
         * @returns
         */
        jCheckBox.prototype.bind = function () {
            this.element.bind("click", this.eventBind(this.checkBoxClick, this));
            this.element.bind("selectstart", this.eventBind(this.checkBoxSelectStart, this));
        };
        /**
         * 检查当前浏览器是否有Function.prototype.bind函数，如没有则手动实现(兼容IE8)
         * @returns
         */
        jCheckBox.prototype.checkFunctionBind = function () {
            if (typeof (Function.prototype.bind) === "function")
                return;
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }
                var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
                }, fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();
                return fBound;
            };
        };
        /**
         * 事件绑定，会将当前实例化对象的this传到事件处理函数的最后一个参数
         * @param {Function} fn 普通事件处理函数
         * @param {Object} thisobj 当前实例化对象
         * @returns
         */
        jCheckBox.prototype.eventBind = function (fn, thisobj) {
            if (thisobj === undefined)
                return fn;
            return function () {
                return fn.apply(this, Array.prototype.slice.call(arguments).concat(thisobj));
            };
        };
        /**
         * click事件响应函数
         * @param {Event} e 事件对象
         * @returns
         */
        jCheckBox.prototype.checkBoxClick = function (e, me) {
            if (me.getIsEnabled() == false)
                return;
            me.change(!me.getIsChecked(), false, e);
        };
        /**
         * selectstart事件响应函数，防止因快速点击而出现的选中周围文字
         * @param {Event} e 事件对象
         * @returns
         */
        jCheckBox.prototype.checkBoxSelectStart = function (e, me) {
            e.preventDefault();
        };
        /**
         * 获取当前是否选中
         * @returns
         */
        jCheckBox.prototype.getIsChecked = function () {
            return this.getBoolByAttr(jch.jCheckBox.attrEnum.jchecked);
        };
        /**
         * 获取当前是否可用
         * @returns
         */
        jCheckBox.prototype.getIsEnabled = function () {
            return this.getBoolByAttr(jch.jCheckBox.attrEnum.jenabled);
        };
        /**
         * 根据布尔值字符串返回布尔值
         * @param {string} attrName 布尔值字符串
         * @returns
         */
        jCheckBox.prototype.getBoolByAttr = function (attrName) {
            var str = this.element.attr(attrName).toLowerCase();
            var bool = (str == true.toString()) ? true : (str == false.toString()) ? false : null;
            if (typeof (bool) == "boolean") {
                return bool;
            }
            else {
                throw Error("BoolStr Error!");
            }
        };
        /**
         * 变更当前选中状态
         * @param {boolean} chkState 要变更为的状态(是否选中)，省略此参数则自动切换到另一种状态
         * @param {boolean = false} isCheckAllTrigger 是否为全选组触发
         * @param {Event} e 事件对象
         * @returns
         */
        jCheckBox.prototype.change = function (chkState, isCheckAllTrigger, e) {
            if (isCheckAllTrigger === void 0) { isCheckAllTrigger = false; }
            if (chkState === undefined)
                chkState = !this.getIsChecked();
            chkState = !!chkState;
            if (chkState === this.getIsChecked()) {
                return;
            }
            if (this.workMode == this.workModeEnum.radioButton && chkState == false && !isCheckAllTrigger)
                return; //单选钮不允许取消选择
            if (this.workMode == this.workModeEnum.radioButtonGroup) {
                throw Error("radioButtonGroup action error!");
                return;
            } //单选钮组模式，不允许操作
            if (this.config.onBeforeCheckedChange.call(this, chkState, e) === false) {
                return;
            }
            this.element.attr(jch.jCheckBox.attrEnum.jchecked, chkState.toString());
            this.refreshStyle();
            this.config.onCheckedChange.call(this, chkState, e);
            if (!isCheckAllTrigger) {
                //如果当前工作模式为 全选模式
                if (this.workMode == this.workModeEnum.checkall) {
                    //console.log("workModeEnum.checkall");
                    $.each(this.getSubCheckBoxArr(true), function (i, a) {
                        if ((a instanceof jch.jCheckBox) === false)
                            return true;
                        a.change(chkState, true, e);
                    });
                }
                //console.log("change", this.element);
                this.checkedListener(this, e, chkState);
            }
        };
        /**
         * 变更当前可用状态
         * @param {boolean = true} enbState 要变更的状态，不传参则视为 启用
         * @returns
         */
        jCheckBox.prototype.enabled = function (enbState) {
            if (enbState === void 0) { enbState = true; }
            enbState = !!enbState;
            if (enbState === this.getIsEnabled())
                return;
            if (this.config.onBeforeEnabledChange.call(this, enbState) === false) {
                return;
            }
            this.element.attr(jch.jCheckBox.attrEnum.jenabled, enbState.toString());
            this.refreshStyle();
            this.config.onEnabledChange.call(this, enbState);
        };
        /**
         * 获取当前的工作模式
         * @returns
         */
        jCheckBox.prototype.getWorkMode = function () {
            return this.workMode;
        };
        /**
         * 设置当前复选框的工作模式
         * @param {string} wm 工作模式枚举值
         * @returns
         */
        jCheckBox.prototype.setWorkMode = function (wm) {
            if (this.workMode != this.workModeEnum.checkall) {
                this.workMode = wm;
            }
            this.element.attr(jch.jCheckBox.attrEnum.workMode, wm);
            this.setStyleMode(this.getStyleModeByWorkMode(wm));
        };
        /**
         * 设置当前复选框的显示模式
         * @param {string} sm 显示模式枚举
         * @returns
         */
        jCheckBox.prototype.setStyleMode = function (sm) {
            this.styleMode = sm;
            this.element.attr(jch.jCheckBox.attrEnum.styleMode, sm);
            this.refreshStyle();
        };
        /**
         * 根据工作模式获取当前的显示模式
         * @param {string} wm 工作模式枚举
         * @returns
         */
        jCheckBox.prototype.getStyleModeByWorkMode = function (wm) {
            var sm = "";
            if (wm.match(/normal|check/) != null) {
                return this.styleModeEnum.checkBox;
            }
            else if (wm.match(/radio/) != null) {
                return this.styleModeEnum.radioButton;
            }
            else {
            }
            return sm;
        };
        /**
         * 刷新样式显示（用于解决IE8的css样式无法及时应用的bug）
         * @returns
         */
        jCheckBox.prototype.refreshStyle = function () {
            this.element.css("background-image", "url('')").css("background-image", "");
        };
        /**
         * 设定勾选监听器，用于全选功能
         * @param {Function} fn 监听器函数
         * @returns
         */
        jCheckBox.prototype.setCheckedListener = function (fn) {
            this.checkedListener = fn;
        };
        /**
         * 将复选框初始化为“全选”复选框
         * @param {jCheckBox[]} jcbarr 子复选框数组
         * @returns
         */
        jCheckBox.prototype.initCheckAllMode = function (jcbarr) {
            this.setWorkMode(this.workModeEnum.checkall);
            this.subCheckBoxArr = $.extend(true, [], jcbarr);
            var me = this;
            $.each(this.subCheckBoxArr, function (i, a) {
                if ((a instanceof jch.jCheckBox) === false)
                    return true;
                a.setWorkMode(me.workModeEnum.checkBox);
                //需要inspectCheckAll函数在全选对象的上下文执行，遂必须使用bind绑定执行作用域
                a.setCheckedListener(me.inspectCheckAll.bind(me));
            });
        };
        /**
         * 将复选框初始化为单选钮组的管理者，此操作会使当前复选框隐藏
         * @param {jCheckBox[]} jcbarr 子单选钮数组
         * @returns
         */
        jCheckBox.prototype.initRadioButtonGroupMode = function (jcbarr) {
            this.setWorkMode(this.workModeEnum.radioButtonGroup);
            this.subCheckBoxArr = $.extend(true, [], jcbarr);
            var me = this;
            $.each(this.subCheckBoxArr, function (i, a) {
                if ((a instanceof jch.jCheckBox) === false)
                    return true;
                a.setWorkMode(me.workModeEnum.radioButton);
                a.setCheckedListener(me.inspectRadioButtonGroup.bind(me));
            });
        };
        /**
         * 检查“全选”钮下属的复选框是否都选中或都不选
         * @param {jCheckBox} targetJcb 当前点击的jcb对象
         * @param {Event} e 原生事件对象
         * @param {boolean} chkState 是否选中
         * @returns
         */
        jCheckBox.prototype.inspectCheckAll = function (targetJcb, e, chkState) {
            var subCbNum = this.getSubCheckBoxArr(true).length; //所有可用项
            var checkedNum = this.getSubCheckBoxArr(true, true).length; //可用的勾选项
            var uncheckedNum = this.getSubCheckBoxArr(true, false).length; //可用的没选项
            if (subCbNum == 0) {
                //下属没有复选框，什么都不做
                return;
            }
            else if (checkedNum == subCbNum) {
                //勾选 全选钮
                this.change(true, true, e);
            }
            else if (uncheckedNum == subCbNum) {
                //取消勾选 全选钮
                this.change(false, true, e);
            }
            else if (checkedNum + uncheckedNum == subCbNum) {
                //取消勾选 全选钮
                this.change(false, true, e);
            }
            else {
                throw Error("jCheckBox inspectCheckAll Error!");
            }
        };
        /**
         * 将“单选”钮组其他选项全都设置为不选
         * @param {jCheckBox} targetJcb 点击单选钮的jcb对象
         * @param {Event} e 原生事件对象
         * @param {boolean} chkState 是否选中
         * @returns
         */
        jCheckBox.prototype.inspectRadioButtonGroup = function (targetJcb, e, chkState) {
            //*注意：此函数需要在[单选钮组]对象上执行
            var subCb = this.getSubCheckBoxArr(true); //所有可用项
            $.each(subCb, function (i, cb) {
                if (cb !== targetJcb) {
                    //console.log(cb.element, targetJcb.element, false);
                    cb.change(false, true);
                }
                else {
                }
            });
        };
        /**
         * 根据指定条件获取子复选框
         * @param {boolean} isEnabled 是否可用，不传则状态均可
         * @param {boolean} isChecked 是否选中，不传则是否选中均可
         * @returns
         */
        jCheckBox.prototype.getSubCheckBoxArr = function (isEnabled, isChecked) {
            //过滤子对象中的非jcb对象
            this.subCheckBoxArr = $.grep(this.subCheckBoxArr, function (a, i) {
                return a instanceof jch.jCheckBox;
            });
            if (!isBool(isEnabled) && !isBool(isChecked)) {
                return this.subCheckBoxArr;
            }
            else if (isBool(isEnabled) && !isBool(isChecked)) {
                return $.grep(this.subCheckBoxArr, function (a, i) {
                    return a.getIsEnabled() === isEnabled;
                });
            }
            else if (!isBool(isEnabled) && isBool(isChecked)) {
                return $.grep(this.subCheckBoxArr, function (a, i) {
                    return a.getIsChecked() === isChecked;
                });
            }
            else if (isBool(isEnabled) && isBool(isChecked)) {
                return $.grep(this.subCheckBoxArr, function (a, i) {
                    return a.getIsChecked() === isChecked && a.getIsEnabled() === isEnabled;
                });
            }
            else {
                return this.subCheckBoxArr;
            }
            function isBool(arg) {
                return typeof (arg) === "boolean";
            }
        };
        jCheckBox.workModeEnum = {
            //jCheckBox工作模式
            normal: "normal",
            checkBox: "checkBox",
            checkall: "checkall",
            radioButton: "radioButton",
            radioButtonGroup: "radioButtonGroup" //单选钮管理者（隐藏）
        };
        jCheckBox.styleModeEnum = {
            //jCheckBox的显示样式
            checkBox: "checkBox",
            radioButton: "radioButton" //单选钮
        };
        jCheckBox.checkState = {
            //复选框状态
            unchecked: 0,
            checked: 1,
            indeterminate: 2 //不确定(中间黑点)
        };
        jCheckBox.enabledState = {
            //复选框启用禁用状态
            disabled: 0,
            enabled: 1 //启用
        };
        jCheckBox.attrEnum = {
            jchecked: "jchecked",
            jenabled: "jenabled",
            styleMode: "stylemode",
            workMode: "workmode"
        };
        return jCheckBox;
    })();
    jch.jCheckBox = jCheckBox;
})(jch || (jch = {}));
//# sourceMappingURL=jch.jCheckBox.js.map