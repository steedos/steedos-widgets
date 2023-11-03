/*
 * @LastEditTime: 2023-11-03 16:48:19
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as _ from 'lodash';
import { isFunction, isNumber, isBoolean, isString, isNil } from 'lodash';
import { safeRunFunction, safeEval } from '../utils';
import { isExpression, parseSingleExpression } from '../expression';

/**
  把原来的默认值公式表达式转换成新的表达式语法，原来的表达式语法如下所示：
  ==========
  取一个字段的值：使用“{”和“}” (注意都是半角)将字段名扩起来，如：{price}
  基于当前用户的系统变量：包括姓名、角色、部门等
  ID: {userId}
  姓名：{user.name}
  所在部门（当申请人属于多个部门时，为所在主部门的全路径）： {user.organization.fullname}
  所在部门（最底层部门名）： {user.organization.name}
  角色名： {user.roles}
  手机： {user.mobile}
  固定电话： {user.work_phone}
  职务： {user.position}
  取当前工作区的信息
  ID: {spaceId}
  ===========
 * @param express 
 */
const getCompatibleDefaultValueExpression = (express, multiple) => {
    const reg = /^\{\w+(\.*\w+)*\}$/;//只转换{}包着的老语法，新语法是两层大括号{{}}，不运行转换
    const reg2 = /^{{[\s\S]*}}$/; //转换{{ function(){} }} 或 {{ (item)=>{} }}
    let result = express;
    if (reg.test(express)) {
        if (express.indexOf("userId") > -1 || express.indexOf("spaceId") > -1 || express.indexOf("user.") > -1 || express.indexOf("now") > -1 || express.indexOf("today") > -1) {
            result = `{${express}}`.replace("{{", "{{global.");
        }
        else {
            result = `{${express}}`.replace("{{", "{{formData.");
        }
        if (multiple) {
            // 如果是多选字段，则返回值应该加上中括号包裹，表示返回数组
            result = result.replace(/\{\{(.+)\}\}/, "{{[$1]}}")
        }
    }
    if(reg2.test(express) && (express.indexOf('function')>-1 || express.indexOf('=>')>-1)){
        // 使用正则表达式提取函数
        let regex = /\{\{([\s\S]*)\}\}/;
        let matches = regex.exec(express);
        if (matches && matches.length > 1) {
            let functionCode = matches[1];
            result = eval("(" + functionCode + ")")();
        }
    }
    return result;
}

export const getFieldDefaultValue = (field, globalData) => {
    if (!field) {
        return null
    }

    let defaultValue = field.defaultValue;

    if (field._defaultValue) {
        defaultValue = safeEval(`(${field._defaultValue})`);
    }
    if (isFunction(defaultValue)) {
        defaultValue = safeRunFunction(defaultValue, [], null, { name: field.name });
    }
    if (_.isString(defaultValue)) {
        // 支持{userId}这种格式
        defaultValue = getCompatibleDefaultValueExpression(defaultValue, field.multiple);
    }
    // const isFormula = _.isString(defaultValue) && defaultValue.startsWith("{{");
    const isFormula = isExpression(defaultValue);
    if (isFormula) {
        // 支持{{global.user.name}}这种公式
        // globalData中传入原来 window.Creator?.USER_CONTEXT || {}, {now: new Date()} 这种逻辑，可以从amis的数据链中取变量global的值
        if(field.type === "date"){
            // 日期类型字段，兼容老代码配置的now，值应该存储为today
            defaultValue = defaultValue.replace(/\bglobal.now\b/g, "global.today");
        }
        defaultValue = parseSingleExpression(defaultValue, {}, "#", globalData)
        // defaultValue = `\$${defaultValue.substring(1, defaultValue.length - 1)}`
    }
    switch (field.type) {
        case 'select':
            const dataType = field.data_type || 'text';
            if (defaultValue && !isFormula && !field.multiple) {
                if (dataType === 'text' && !isString(defaultValue)) {
                    defaultValue = String(defaultValue);
                } else if (dataType === 'number' && isString(defaultValue)) {
                    defaultValue = Number(defaultValue);
                } else if (dataType === 'boolean' && isString(defaultValue)) {
                    // defaultValue = defaultValue === 'false' ? false : true;
                    defaultValue = defaultValue.toLowerCase() === 'true' || defaultValue === '1';
                }
            }
            break;
        case 'number':
            if(isString(defaultValue)){
                defaultValue = Number(defaultValue);
            }
            break;
        case 'boolean':
            if (isString(defaultValue)) {
                defaultValue = defaultValue.toLowerCase() === 'true' || defaultValue === '1';
            }
            else if(!isBoolean(defaultValue)){
                // 未设置值时默认给定false值，这样字段必填时就不会校验不通过
                defaultValue = false;
            }
            break;
        default:
            break;
    }

    return defaultValue;
}
