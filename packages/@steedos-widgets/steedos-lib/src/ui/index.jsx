/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-08-14 16:52:49
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
import { compact, isEmpty } from 'lodash';

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
    },
    getKeywordsSearchFilter: (keywords, allowSearchFields) => {
      const keywordsFilters = [];
      if (keywords && allowSearchFields) {
        var keyValues = keywords.split(/\s+/);//按空格分隔转为数组
        keyValues = compact(keyValues);//移除空字符串元素
        allowSearchFields.forEach(function (key, index) {
          let everyFieldFilters = [];
          if(keyValues.length == 1){
            // 长度为1时说明没有空格分隔，直接赋值简化处理，而不是push，可以让输出的过滤条件少套一层无意义的数组
            everyFieldFilters = [key, "contains", keyValues[0]];
          }
          else{
            keyValues.forEach(function(valueItem, valueIndex){
              everyFieldFilters.push([key, "contains", valueItem]);
              if (valueIndex < keyValues.length - 1) {
                everyFieldFilters.push('or');
              }
            });
          }
          if(everyFieldFilters.length){
            keywordsFilters.push(everyFieldFilters);
            if (index < allowSearchFields.length - 1) {
              keywordsFilters.push('or');
            }
          }
        })
      };
      return keywordsFilters;
    },
    getFormulaVariables: (fields, hasGlobal = true) => {
      const variables = [];
      if (!isEmpty(fields)) {
        variables.push({
          "label": "表单字段",
          "children": [

          ]
        });
        lodash.forEach(fields,function (field) {
          variables[0].children.push({
            "label": field.label,
            "value": field.name
          })
        })
      }
      if (hasGlobal) {
        variables.push({
          "label": "全局变量",
          "children": [
            {
              "label": "用户ID",
              "value": "global['userId']"
            },
            {
              "label": "工作区ID",
              "value": "global['spaceId']"
            },
            {
              "label": "只读/编辑模式",
              "value": "global['mode']"
            },
            {
              "label": "用户",
              "children": [
                {
                  "label": "姓名",
                  "value": "global['user']['name']"
                },
                {
                  "label": "邮件",
                  "value": "global['user']['email']"
                },
                {
                  "label": "语言",
                  "value": "global['user']['language']"
                },
                {
                  "label": "简档",
                  "value": "global['user']['profile']"
                },
                {
                  "label": "权限集",
                  "value": "global['user']['roles']"
                },
                {
                  "label": "主部门ID",
                  "value": "global['user']['organization']['_id']"
                },
                {
                  "label": "部门(多选)",
                  "value": "global['user']['organizations']"
                },
                {
                  "label": "部门(含上级)",
                  "value": "global['user']['organizations_parents']" 
                },
                {
                  "label": "主分部ID",
                  "value": "global['user']['company_id']"
                },
                {
                  "label": "分部(多选)",
                  "value": "global['user']['company_ids']"  
                },
                {
                  "label": "人员ID",
                  "value": "global['user']['spaceUserId']"
                },
                {
                  "label": "是否是工作区管理员",
                  "value": "global['user']['is_space_admin']"
                }
              ]
            }
          ]
        });
      }
      return variables;
    }
})