/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../Core/jch.Core.d.ts" />
declare module jch {
    interface jCheckBoxSetting {
        element?: JQuery;
        checked?: boolean | (() => boolean);
        enabled?: boolean | (() => boolean);
        onCheckedChange?(chkState: boolean, e: Event): void;
        onBeforeCheckedChange?(chkState: boolean, e: Event): boolean | void;
        onEnabledChange?(enbState: boolean): void;
        onBeforeEnabledChange?(enbState: boolean): boolean | void;
    }
    class jCheckBox {
        static workModeEnum: {
            normal: string;
            checkBox: string;
            checkall: string;
            radioButton: string;
            radioButtonGroup: string;
        };
        static styleModeEnum: {
            checkBox: string;
            radioButton: string;
        };
        static checkState: {
            unchecked: number;
            checked: number;
            indeterminate: number;
        };
        static enabledState: {
            disabled: number;
            enabled: number;
        };
        static attrEnum: {
            jchecked: string;
            jenabled: string;
            styleMode: string;
            workMode: string;
        };
        config: jCheckBoxSetting;
        element: JQuery;
        subCheckBoxArr: jCheckBox[];
        private workModeEnum;
        private styleModeEnum;
        private checkedListener;
        private workMode;
        private styleMode;
        constructor(cfg: jCheckBoxSetting);
        private init();
        /**
         * 创建DOM结构
         * @returns
         */
        private createDom();
        /**
         * 进行DOM事件绑定
         * @returns
         */
        private bind();
        /**
         * 检查当前浏览器是否有Function.prototype.bind函数，如没有则手动实现(兼容IE8)
         * @returns
         */
        private checkFunctionBind();
        /**
         * 事件绑定，会将当前实例化对象的this传到事件处理函数的最后一个参数
         * @param {Function} fn 普通事件处理函数
         * @param {Object} thisobj 当前实例化对象
         * @returns
         */
        private eventBind(fn, thisobj);
        /**
         * click事件响应函数
         * @param {Event} e 事件对象
         * @returns
         */
        private checkBoxClick(e, me);
        /**
         * selectstart事件响应函数，防止因快速点击而出现的选中周围文字
         * @param {Event} e 事件对象
         * @returns
         */
        private checkBoxSelectStart(e, me);
        /**
         * 获取当前是否选中
         * @returns
         */
        getIsChecked(): boolean;
        /**
         * 获取当前是否可用
         * @returns
         */
        getIsEnabled(): boolean;
        /**
         * 根据布尔值字符串返回布尔值
         * @param {string} attrName 布尔值字符串
         * @returns
         */
        private getBoolByAttr(attrName);
        /**
         * 变更当前选中状态
         * @param {boolean} chkState 要变更为的状态(是否选中)，省略此参数则自动切换到另一种状态
         * @param {boolean = false} isCheckAllTrigger 是否为全选组触发
         * @param {Event} e 事件对象
         * @returns
         */
        change(chkState?: boolean, isCheckAllTrigger?: boolean, e?: Event): void;
        /**
         * 变更当前可用状态
         * @param {boolean = true} enbState 要变更的状态，不传参则视为 启用
         * @returns
         */
        enabled(enbState?: boolean): void;
        /**
         * 获取当前的工作模式
         * @returns
         */
        getWorkMode(): string;
        /**
         * 设置当前复选框的工作模式
         * @param {string} wm 工作模式枚举值
         * @returns
         */
        setWorkMode(wm: string): void;
        /**
         * 设置当前复选框的显示模式
         * @param {string} sm 显示模式枚举
         * @returns
         */
        setStyleMode(sm: string): void;
        /**
         * 根据工作模式获取当前的显示模式
         * @param {string} wm 工作模式枚举
         * @returns
         */
        private getStyleModeByWorkMode(wm);
        /**
         * 刷新样式显示（用于解决IE8的css样式无法及时应用的bug）
         * @returns
         */
        private refreshStyle();
        /**
         * 设定勾选监听器，用于全选功能
         * @param {Function} fn 监听器函数
         * @returns
         */
        setCheckedListener(fn: (targetJcb: jCheckBox, e: Event, chkState: boolean) => void): void;
        /**
         * 将复选框初始化为“全选”复选框
         * @param {jCheckBox[]} jcbarr 子复选框数组
         * @returns
         */
        initCheckAllMode(jcbarr: jCheckBox[]): void;
        /**
         * 将复选框初始化为单选钮组的管理者，此操作会使当前复选框隐藏
         * @param {jCheckBox[]} jcbarr 子单选钮数组
         * @returns
         */
        initRadioButtonGroupMode(jcbarr: jCheckBox[]): void;
        /**
         * 检查“全选”钮下属的复选框是否都选中或都不选
         * @param {jCheckBox} targetJcb 当前点击的jcb对象
         * @param {Event} e 原生事件对象
         * @param {boolean} chkState 是否选中
         * @returns
         */
        inspectCheckAll(targetJcb: jCheckBox, e: Event, chkState: boolean): void;
        /**
         * 将“单选”钮组其他选项全都设置为不选
         * @param {jCheckBox} targetJcb 点击单选钮的jcb对象
         * @param {Event} e 原生事件对象
         * @param {boolean} chkState 是否选中
         * @returns
         */
        private inspectRadioButtonGroup(targetJcb, e, chkState);
        /**
         * 根据指定条件获取子复选框
         * @param {boolean} isEnabled 是否可用，不传则状态均可
         * @param {boolean} isChecked 是否选中，不传则是否选中均可
         * @returns
         */
        getSubCheckBoxArr(isEnabled?: boolean, isChecked?: boolean): jCheckBox[];
    }
}
