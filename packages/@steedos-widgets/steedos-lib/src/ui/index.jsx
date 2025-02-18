/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-06-10 14:16:02
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
    /**
     * 传入amis form data，返回用于crud/picker列表顶部表单搜索中用的form values
     * @param {*} data amis form data，不带__searchable__前缀
     * @param {*} fields 对象的字段定义，可以传入对象uiSchema接口返回的fields属性
     * @returns amis form data，带__searchable__前缀
     */
    getSearchFilterFormValues: (data, fields)=>{
      if (_.isObject(data) || !_.isEmpty(data)){
        let formData = data;
        if (fields){
            formData = _.pickBy(data, function(n,k){
              return !!fields[k];
            });
        }
        let formValues = _.mapKeys(formData, function (n, k) {
          let fieldNamePrefix = '__searchable__';
          if (fields){
            const fieldType = fields[k]?.type;
            if (fieldType === 'number' || fieldType === 'currency') {
              fieldNamePrefix = `${fieldNamePrefix}between__`
            }
            else if (fieldType === 'date') {
              fieldNamePrefix = `${fieldNamePrefix}between__`
            }
            else if (fieldType === 'datetime') {
              fieldNamePrefix = `${fieldNamePrefix}between__`
            }
            else if (fieldType === 'time') {
              fieldNamePrefix = `${fieldNamePrefix}between__`
            }
          }
          return fieldNamePrefix + k;
        });
        return formValues;
      }
      else {
        return data;
      }
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
                everyFieldFilters.push('and');
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
    getFormulaVariables: (fieldOptions, hasGlobal = true) => {
      const variables = [];
      if (!isEmpty(fieldOptions)) {
        variables.push({
          "label": "表单字段",
          "children": [

          ]
        });
        lodash.forEach(fieldOptions,function (field) {
          variables[0].children.push({
            "label": field.label,
            "value": field.value
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
            // 因为默认值不能选这个选项，先直接去除
            // {
            //   "label": "只读/编辑模式",
            //   "value": "global['mode']"
            // },
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
                // 值为对象数组，先去掉
                // {
                //   "label": "部门(多选)",
                //   "value": "global['user']['organizations']"
                // },
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
    },
    traverseNestedArrayFormula: (arr, data) => {
      var currentAmis = (window.amisRequire && window.amisRequire('amis')) || Amis;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          // 如果当前元素是数组，则递归调用自身继续遍历
          SteedosUI.traverseNestedArrayFormula(arr[i], data);
        } else {
          // 如果当前元素不是数组，则处理该元素
          // 下面正则用于匹配amis公式\${}
          if (/\$\{([^}]*)\}/.test(arr[i])) {
            try {
              arr[i] = currentAmis.evaluate(arr[i], data);
            } catch (ex) {
              console.error("运行过滤器公式时出现错误:", ex);
            }
          }
        }
      }
    }
})