
import { toArray, mergeWith, isArray } from 'lodash';

// lodash的defaultsDeep函数有bug，无法正确合并值为数值的节点，重写修正该函数
// 源码出处：https://github.com/nodeutils/defaults-deep
export const defaultsDeep = (...args)=>{
    let output = {};
    toArray(args).reverse().forEach(item=> {
        mergeWith(output, item, (objectValue, sourceValue) => {
            return isArray(sourceValue) ? sourceValue : undefined;
        });
    });
    return output;
};