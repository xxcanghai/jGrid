declare module jch {
    interface jEnumObject {
        get?(enumName: any, errMsg?: any): any;
        tryGet?(enumName: any, defaultValue?: any): any;
        getName?(enumValue: any, errMsg?: any): any;
        tryGetName?(enumValue: any, defaultValue?: any): any;
        check?(value: any, errMsg?: any): any;
    }
    /**
     * jEnum扩展型枚举对象
     * @param {jEnumObject} enumObj 原始枚举对象
     */
    function jEnum(enumObj: jEnumObject): jEnumObject;
}
