/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-10-25 17:35:18
 */
export const isExpression = function (func) {
  var pattern, reg1, reg2;
  if (typeof func !== 'string') {
    return false;
  }
  pattern = /^{{(.+)}}$/;
  reg1 = /^{{(function.+)}}$/;
  reg2 = /^{{(.+=>.+)}}$/;
  if (typeof func === 'string' && func.match(pattern) && !func.match(reg1) && !func.match(reg2)) {
    return true;
  }
  return false;
};

const getMoment = ()=>{
  if(window.amisRequire){
    return window.amisRequire("moment");
  }else if(window.moment){
    return window.moment;
  }
}

export const parseSingleExpression = function (func, formData, dataPath, global) {
  if (global) {
    let now = new Date();
    let moment = getMoment();
    let today = moment().utc();
    today.set("hours",0);
    today.set("minutes",0);
    today.set("seconds",0);
    today = today.toDate();
    Object.assign(global, {
      now,
      today
    });
  }
  var error, funcBody, getParentPath, getValueByPath, globalTag, parent, parentPath, str;
  getParentPath = function (path) {
    var pathArr;
    if (typeof path === 'string') {
      pathArr = path.split('.');
      if (pathArr.length === 1) {
        return '#';
      }
      pathArr.pop();
      return pathArr.join('.');
    }
    return '#';
  };
  getValueByPath = function (formData, path) {
    if (path === '#' || !path) {
      return formData || {};
    } else if (typeof path === 'string') {
      return _.get(formData, path);
    } else {
      console.error('path has to be a string');
    }
  };
  if (formData === void 0) {
    formData = {};
  }
  parentPath = getParentPath(dataPath);
  parent = getValueByPath(formData, parentPath) || {};
  if (typeof func === 'string') {
    funcBody = func.substring(2, func.length - 2);
    globalTag = '__G_L_O_B_A_L__';
    str = '\n    return ' + funcBody.replace(/\bformData\b/g, JSON.stringify(formData).replace(/\bglobal\b/g, globalTag)).replace(/\bglobal\b/g, JSON.stringify(global)).replace(new RegExp('\\b' + globalTag + '\\b', 'g'), 'global').replace(/rootValue/g, JSON.stringify(parent));
    try {
      return Function(str)();
    } catch (_error) {
      error = _error;
      console.log(error, func, dataPath);
      return func;
    }
  } else {
    return func;
  }
};