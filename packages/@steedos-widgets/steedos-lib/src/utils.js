/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-20 16:52:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-17 14:24:43
 * @Description: 
 */
import { isArray, isNil } from 'lodash';

export const safeRunFunction = (fun, args, defaultValue, _this) => {
    try {
      // const Creator = window.Creator;
      // const isCreator = !!(Creator && Creator.getObjectUrl);
      // let regCreator = /\bSteedos\b|\bCreator\b|\bMeteor\b|\bSession\b/;
      // if(!isCreator && regCreator.test(fun)){
      //   console.info("调用了Creator|Steedos|Meteor|Session变量的脚本不执行，直接按空值处理。", fun);
      //   return "";
      // }
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