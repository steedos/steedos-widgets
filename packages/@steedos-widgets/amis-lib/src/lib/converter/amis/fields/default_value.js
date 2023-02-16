import * as _ from 'lodash';

export function getFieldDefaultValue(field, readonly, ctx) {
    if (!field) {
        return null
    }

    if (readonly) {
        return null
    }
    
    let defaultValue = field.defaultValue;
    const isFormula = _.isString(defaultValue) && defaultValue.startsWith("{{");
    // TODO:{userId}这种格式未支持
    if(isFormula){
        // 支持{{global.user.name}}这种公式
        defaultValue = `\$${defaultValue.substring(1, defaultValue.length -1)}`
    }
    switch (field.type) {
        case 'select':
            const dataType = field.data_type || 'text';
            if(defaultValue && !isFormula){
                if(dataType === 'text'){
                    defaultValue = String(defaultValue);
                }else if(dataType === 'number'){
                    defaultValue = Number(defaultValue);
                }else if(dataType === 'boolean'){
                    defaultValue = defaultValue === 'false' ? false : true;
                }
            }
            break;
        default:
            break;
    }

    return defaultValue;
}
