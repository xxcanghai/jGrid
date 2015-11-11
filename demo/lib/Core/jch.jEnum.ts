
/*
    jch.jEnum
    createTime：2015年5月21日
    updateTime：2015年5月21日
    

    //*******使用方法*********
    var sexEnum = jch.jEnum({
        "enum_1": "男",
        "enum_2": "女"
    });
    sexEnum["enum_1"]     ->  男
    sexEnum.get("enum_1") ->  男
    sexEnum["enum_0"]     ->  undefined（JS原始用法不受影响，不报错）
    sexEnum.get("enum_0") ->  抛出异常
    
    JS原始方括号用法问题在于当服务器返回数据不符合枚举值时，不报错，不容易发现错误
    使用jEnum对原始对象扩展的get方法可以在查询失败时抛出异常，易用调试和发现bug
    同时不影响原有枚举对象的使用，可当做正常对象使用
    *注意：此插件因对原对象做了扩展，遂尽量不要使用for in或其他each来遍历返回的对象。
*/
module jch {
    export interface jEnumObject {
        get? (enumName, errMsg?);
        tryGet? (enumName, defaultValue?);
        getName? (enumValue, errMsg?);
        tryGetName? (enumValue, defaultValue?);
        check? (value, errMsg?);
    }
    /**
     * jEnum扩展型枚举对象
     * @param {jEnumObject} enumObj 原始枚举对象
     */
    export function jEnum(enumObj: jEnumObject): jEnumObject {
        if (typeof (enumObj) !== "object") throw Error("jEnum 'enumObj' error");

        /**
         * 根据枚举名获取枚举值。找不到对应枚举将抛出异常
         * @param {string} enumName 要查询的枚举名
         * @param {string} errMsg 抛出的错误信息
         * @returns
         */
        enumObj.get = function (enumName: string, errMsg: string = "jEnum error, '" + enumName + "' is undefined"): number|any {
            var _this = this;
            if (_this !== enumObj) throw Error("jEnum error, 错误的调用方式");
            if (typeof (enumName) !== "string") throw Error("jEnum error, 'enumName' must be a string");
            if (enumName in _this) {
                return _this[enumName];
            } else {
                throw Error(errMsg);
            }
        };

        /**
         * 根据枚举名尝试获取枚举值，不抛出异常，找不到对应枚举将返回设定的默认值
         * @param {string} enumName 要查询的枚举名
         * @param {any} defaultValue 查询失败后返回的值，若不传则返回undefined
         * @returns
         */
        enumObj.tryGet = function (enumName: string, defaultValue: any = undefined): any {
            var _this = this;
            if (_this !== enumObj) throw Error("jEnum error, 错误的调用方式");
            if (typeof (enumName) !== "string") throw Error("jEnum error, 'enumName' must be a string");
            if (enumName in _this) {
                return _this[enumName];
            } else {
                return defaultValue;
            }
        };

        /**
         * 根据枚举值获取枚举名,只返回第一个匹配项。找不到将抛出异常
         * @param {any} enumValue 要查询的枚举值
         * @param {string} errMsg 抛出的错误信息
         * @returns
         */
        enumObj.getName = function (enumValue: any, errMsg: string = "jEnum 'getName' error, '" + enumValue + "' is undefined"): string {
            var _this = this;
            if (_this !== enumObj) throw Error("jEnum error, 错误的调用方式");
            if (arguments.length === 0) throw Error("jEnum error, 'enumValue' not found");
            var enumName: string = null;
            for (var i in _this) {
                if (enumValue === _this[i]) {
                    enumName = i;
                    break;
                }
            }
            if (enumName !== null) {
                return enumName;
            } else {
                throw Error(errMsg);
            }
        };

        /**
         * 根据枚举值尝试获取枚举名,只返回第一个匹配项。找不到对应枚举将返回设定的默认值
         * @param {any} enumValue 要查询的枚举值
         * @param {any} defaultValue 查询失败后返回的值，若不传则返回undefined
         * @returns
         */
        enumObj.tryGetName = function (enumValue: any, defaultValue: any = undefined): string|any {
            var _this = this;
            if (_this !== enumObj) throw Error("jEnum error, 错误的调用方式");
            if (arguments.length === 0) throw Error("jEnum error, 'enumValue' not found");
            var enumName = null;
            for (var i in _this) {
                if (enumValue === _this[i]) {
                    enumName = i;
                    break;
                }
            }
            if (enumName !== null) {
                return enumName;
            } else {
                return defaultValue;
            }
        };

        /**
         * 检查指定枚举值是否存在于当前枚举中，如果存在则返回传入的value值，如果不存在则抛出异常
         * @param {any} value 要查询的枚举值
         * @param {string} errMsg 抛出的错误信息
         * @returns
         */
        enumObj.check = function (value: any, errMsg: string = "jEnum error, checkValue error"): any {
            var _this = this;
            if (_this !== enumObj) throw Error("jEnum error, 错误的调用方式");
            if (_this.tryGetName(value, null) !== null) {
                return value;
            } else {
                throw Error(errMsg);
            }
        };

        return enumObj;
    }
}
