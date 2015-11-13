/// <reference path="../../typings/jquery/jquery.d.ts" />
declare module jch {
    module Core {
        var isIE: boolean;
        var isIE678: boolean;
        var isIE67: boolean;
        /**
         * 寄生组合式继承,使得subType继承superType
         * @param {any} subType 子类
         * @param {any} superType 基类
         */
        function inheritParasitic(subType: any, superType: any): any;
        /**
         * 原型式继承
         * @param {any} obj
         */
        function inheritOriginal(obj: any): any;
        /**
         * 组合式继承
         * @param {any} subType 子类
         * @param {any} superType 基类
         */
        function inheritCombine(subType: any, superType: any): any;
        /**
         * 根据命名空间获取数据。
         * 例：参数为 {a:{b:3}},"a.b" 可得到3。
         * 数组可用 点数字 来获取。例： {a:[{b:1},{b:2}]},"a.0.b" 可得到1
         * 若obj不为对象或数组则返回null；若没有匹配到指定数据返回undefined
         * @param {Object} obj 要获取数据的源对象
         * @param {string} ns 点分隔命名空间字符串，请用.n代替[n]
         */
        function getDataByNS(obj: Object, ns: string): any;
        /**
         * 获取指定函数的函数名称（用于兼容IE）
         * @param {Function} fun 任意函数
         */
        function getFunctionName(fun: Function): string;
        /**
         * 从某个可能是函数的值变量中获取值（多用于插件config）
         * @param {Function|any} obj 某个可能是函数或对象的变量
         * @param {Object} fnThis 调用这个函数的this值
         * @param {any[]} argsArr 调用这个函数的参数列表
         */
        function getValueByFnOrArg(obj: Function | any, fnThis?: Object, argsArr?: any[]): any;
        /**
         * 用正则表达式实现html转码
         * @param {string = ""} str 要编码的字符串
         */
        function htmlEncode(str?: string): string;
        /**
         * 用正则表达式实现html解码
         * @param {string = ""} str 要解码的字符串
         */
        function htmlDecode(str?: string): string;
        /**
         * 获得一个任意长度的随机字符串
         * @param {number = 8} count 随机字符串长度，默认长度8
         */
        function getRandomStr(count?: number): string;
        /**
         * 字符串格式化
         * @param {string} str 含格式替换符的字符串
         * @param {any[]} args 要被替换的对象
         */
        function stringFormat(str: string, ...args: any[]): string;
        /**
         * 根据布尔值字符串返回布尔值
         * @param {boolean|string} boolStr 可能是布尔值的字符串
         * @param {any} defaultValue 如果不是一个布尔值将返回此值，若此值未设定将抛出异常
         */
        function getBoolByStr(boolStr: boolean | string, defaultValue?: any): boolean | any;
        /**
         * 获取某对象是否为原生DOM对象
         * @param {Element} obj 要检测的对象
         */
        function isDomElement(obj: Element): boolean;
        /**
         * 兼容IE的原生添加事件方法
         * @param {EventTarget} element DOM对象
         * @param {string} eventType 事件名称
         * @param {Function} listener 事件响应函数
         * @param {boolean} useCapture 是否为捕获模式，默认为false
         */
        function addEvent(element: EventTarget, eventType: string, listener: (e?: Event) => any, useCapture?: boolean): void;
        /**
         * 检查当前浏览器是否有Function.prototype.bind函数，如没有则手动实现(兼容IE8)
         * @returns
         */
        function checkFunctionBind(): void;
        /**
         * 将this对象绑定到指定函数的最后一个参数
         * 通常用于将某插件的实例化对象的this绑定到事件响应函数中
         * @param {Function} fn 普通事件处理函数
         * @param {Object} thisobj 当前实例化对象
         * @returns
         */
        function eventBindThis(fn: Function, thisobj: Object): any;
    }
}
