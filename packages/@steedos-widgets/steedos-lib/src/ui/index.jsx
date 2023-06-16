/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-06-13 18:23:02
 * @Description: 
 */
import { message, notification, Button, Space} from 'antd';
import {Modal, Drawer} from './modal'
import { SObject } from './sObject';
import { ListView } from './listView';
import { Router } from './router';
import { render } from './render';
import { getFieldDefaultValue } from './defaultValue';
import { getTreeOptions } from './tree';
import { getClosestAmisComponentByType, isFilterFormValuesEmpty } from './amis';

export const SteedosUI = Object.assign({}, {
    render: render,
    Router,
    ListView,
    Object: SObject,
    Modal, 
    Drawer,
    refs: {},
    getRef(name){
      return SteedosUI.refs[name];
    },
    router:{
      // TODO: 简易处理
      go: (action, to)=>{
        const {type, objectName, recordId } = action || {};
        const router = window.FlowRouter;
  
        if(to){
          if(router){
            return router.go(to);
          }
          /* TODO: 补充处于nextjs环境下的跳转
          else if(){
            return router.push(to);
          }
          */
          else{
            return window.open(to);
          }
        }
  
        if(router){
          router.reload();
        }else{
          console.warn('暂不支持自动跳转', action)
        }
      },
      reload: ()=>{
        console.log('reload')
      }
    },
    message,
    notification,
    components: {
      Button, Space
    },
    getRefId: ({type, appId, name})=>{
      switch (type) {
        case 'listview':
          return `amis-${appId}-${name}-listview`;
        case 'form':
          return `amis-${appId}-${name}-form`;
        case 'detail':
          return `amis-${appId}-${name}-detail`;
        default:
          return `amis-${appId}-${name}-${type}`;
      }
    },
    reloadRecord: ()=>{
      if(window.FlowRouter){
        return window.FlowRouter.reload();
      }else{
        // TODO 调用steedos object form 的 reload action
      }
    },
    getFieldDefaultValue,
    getTreeOptions,
    getClosestAmisComponentByType,
    isFilterFormValuesEmpty,
    getSearchFilter: (data)=>{
      var searchableFilter = [];
      _.each(data, (value, key)=>{
          if(!_.isEmpty(value) || _.isBoolean(value)){
              if(_.startsWith(key, '__searchable__between__')){
                  searchableFilter.push([`${key.replace("__searchable__between__", "")}`, "between", value])
              }else if(_.startsWith(key, '__searchable__')){
                  if(_.isString(value)){
                      searchableFilter.push([`${key.replace("__searchable__", "")}`, "contains", value])
                  }else if(_.isObject(value) && value.o){
                    // reference_to是数组的lookup字段
                    let leftKey = `${key.replace("__searchable__", "")}`;
                    let lookupFieldFilter = [[leftKey + "/o", "=", value.o]];
                    if(value.ids.length){
                      lookupFieldFilter.push([leftKey + "/ids", "=", value.ids])
                    }
                    searchableFilter.push(lookupFieldFilter)
                  }
                  else{
                      searchableFilter.push([`${key.replace("__searchable__", "")}`, "=", value])
                  }
              }
          }
      });
      return searchableFilter;
    }
})