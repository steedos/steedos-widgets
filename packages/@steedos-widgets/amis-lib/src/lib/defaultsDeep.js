
import { toArray, mergeWith, isArray } from 'lodash';

export const defaultsDeep = (...args)=>{
    let output = {};
    toArray(args).reverse().forEach(item=> {
        mergeWith(output, item, (objectValue, sourceValue) => {
            return isArray(sourceValue) ? sourceValue : undefined;
        });
    });
    return output;
};