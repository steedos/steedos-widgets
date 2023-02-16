/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-01 11:47:56
 * @Description: 
 */
import { getRootUrl } from "../../steedos.client";
import { isArray, isNil } from 'lodash';

export function getSvgUrl(source, name) {
    var foo, url;
    foo = name != null ? name.split(".") : void 0;
    if (foo && foo.length > 1) {
      source = foo[0];
      if (!(source != null ? source.endsWith("-sprite") : void 0)) {
        source += "-sprite";
      }
      name = foo[1];
    }
    url = "/assets/icons/" + source + "/svg/symbols.svg#" + name;
    return `${getRootUrl()}${url}`;
}

export const safeRunFunction = (fun, args, defaultValue, _this) => {
  try {
    const Creator = window.Creator;
    const isCreator = !!(Creator && Creator.getObjectUrl);
    let regCreator = /\bSteedos\b|\bCreator\b|\bMeteor\b|\bSession\b/;
    if(!isCreator && regCreator.test(fun)){
      console.info("调用了Creator|Steedos|Meteor|Session变量的脚本不执行，直接按空值处理。");
      return "";
    }
    // TODO:移除Creator后，上面判断isCreator并返回空的逻辑可以去掉。
    let params = [];
    if(!isNil(args)){
      params = isArray(args) ? args : [args] ;
    }
    return fun.bind(_this || {})(...params);
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

export function safeEval(js){
	try{
    return eval(js)
	}catch (e){
		console.error(e, js);
	}
};