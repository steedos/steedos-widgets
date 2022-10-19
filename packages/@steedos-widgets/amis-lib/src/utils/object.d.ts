export declare function createObject(superProps?: {
    [propName: string]: any;
}, props?: {
    [propName: string]: any;
}, properties?: any): object;
export declare function cloneObject(target: any, persistOwnProps?: boolean): any;
export declare function extendObject(target: any, src?: any, persistOwnProps?: boolean): any;
export declare function isObject(obj: any): any;
export declare function setVariable(data: {
    [propName: string]: any;
}, key: string, value: any, convertKeyToPath?: boolean): void;
export declare function deleteVariable(data: {
    [propName: string]: any;
}, key: string): void;
export declare function pickValues(names: string, data: object): any;
