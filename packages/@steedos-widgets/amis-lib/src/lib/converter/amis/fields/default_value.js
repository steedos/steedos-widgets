import * as _ from 'lodash';

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
    let result = express;
    if (reg.test(express)) {
        if (express.indexOf("userId") > -1 || express.indexOf("spaceId") > -1 || express.indexOf("user.") > -1 || express.indexOf("now") > -1) {
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
    return result;
}

export function getFieldDefaultValue(field, readonly, ctx) {
    if (!field) {
        return null
    }

    if (readonly) {
        return null
    }

    let defaultValue = field.defaultValue;
    if(_.isString(defaultValue)){
        defaultValue = getCompatibleDefaultValueExpression(defaultValue, field.multiple);
    }
    const isFormula = _.isString(defaultValue) && defaultValue.startsWith("{{");
    // TODO:{userId}这种格式未支持
    if (isFormula) {
        // 支持{{global.user.name}}这种公式
        defaultValue = `\$${defaultValue.substring(1, defaultValue.length - 1)}`
    }
    switch (field.type) {
        case 'select':
            const dataType = field.data_type || 'text';
            if (defaultValue && !isFormula) {
                if (dataType === 'text') {
                    defaultValue = String(defaultValue);
                } else if (dataType === 'number') {
                    defaultValue = Number(defaultValue);
                } else if (dataType === 'boolean') {
                    defaultValue = defaultValue === 'false' ? false : true;
                }
            }
            break;
        default:
            break;
    }

    return defaultValue;
}
