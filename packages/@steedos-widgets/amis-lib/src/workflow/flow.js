import {
  lookupToAmis,
  getSteedosAuth,
  fetchAPI
} from "@steedos-widgets/amis-lib";
import i18next from "i18next";

import { each, startsWith, includes } from "lodash";

import { getApprovalDrawerSchema } from "./approve";

import { getAttachments } from './attachment';

import { getRelatedRecords, getRelatedInstances } from './related';

import { getInstanceApprovalHistory } from './history';

import { getStepsSchema } from './nextSteps';

import { getSafeCode, getTableFieldMap, mapFormula } from './formula-utils';

const getSelectOptions = (field) => {
  const options = [];
  each(field.options.split("\n"), (item) => {
    var foo = item.split(":");
    if (foo.length == 2) {
      options.push({ label: _.trim(foo[0]), value: _.trim(foo[1]) });
    } else {
      options.push({ label: _.trim(item), value: _.trim(item) });
    }
  });
  return options;
};

const isOpinionField = (field)=>{
  const field_formula = field.formula;
  return (field_formula?.indexOf("{traces.") > -1 || field_formula?.indexOf("{signature.traces.") > -1 || field_formula?.indexOf("{yijianlan:") > -1 || field_formula?.indexOf("{\"yijianlan\":") > -1 || field_formula?.indexOf("{'yijianlan':") > -1)
}

const getArgumentsList = (func)=>{
  let funcString;
  if (typeof func === 'function') {
    funcString = func.toString();
  } else {
    funcString = func;
  }
  const regExp = /function\s*\w*\(([\s\S]*?)\)/;
  if (regExp.test(funcString)) {
    const argList = RegExp.$1.split(',');
    return argList.map(arg => arg.replace(/\s/g, '')).filter(arg => arg);
  } else {
    return [];
  }
}

const getFieldEditTpl = async (field, label, inTable, tableFieldMap)=>{
  // console.log('field',field)
  const tpl = {
    label: label === true ? (field.name || field.code) : false,
    name: field.code,
    mode: "horizontal",
    className: `m-none p-none form-control steedos-field-${field.type}-edit`,
    disabled: field.permission !== "editable",
    required: field.is_required,
    visibleOn: field.visibleOn,
    requiredOn: field.requiredOn,
    onEvent: field._amisField?.onEvent
  };
  if(field.code.indexOf('（') > -1 || field.code.indexOf('、') > -1){
    const safeCode = getSafeCode(field.code);
    tpl.onEvent = tpl.onEvent || {};
    tpl.onEvent.change = tpl.onEvent.change || { actions: [] };
    const action = {
      actionType: 'setValue',
      componentId: "u:steedos-input-table-form-service",
      args: {
        value: {
            [safeCode]: "${event.data.value}"
        }
      }
    };
    if(!inTable){
        action.componentId = 'instance_form';
    }
    tpl.onEvent.change.actions.push(action);
  }
  if(field.default_value && !field.default_value?.trim().startsWith('auto_number(')){
    // 在异步加载数据场景下（如Steedos的initApi），如果字段配置了公式形式的默认值（如${NOW()}），AMIS可能会在实际数据返回前就计算并填充默认值，导致已有数据被覆盖。
    // 因此需要使用 ${field || expression} 的写法，明确指定优先使用已有值。
    const formula = mapFormula(field.default_value, !inTable ? tableFieldMap : null);
    if(formula){
      const expression = formula.substring(2, formula.length - 1);
      tpl.value = `\${${field.code} || ${expression}}`;
    }else{
      if (field.default_value.trim().startsWith('${') && field.default_value.trim().endsWith('}')) {
        const expression = field.default_value.trim().substring(2, field.default_value.trim().length - 1);
        tpl.value = `\${${field.code} || ${expression}}`;
      } else {
        tpl.value = field.default_value;
      }
    }
  }
  if(isOpinionField(field)){
    tpl.type = 'input-group';
    tpl.body = [
      {
        "type": "textarea",
        "inputClassName": "b-r-none p-r-none",
        "name": "input-group",
        "id": `yijian-${field.code}`,
        "minRows": 3,
        "maxRows": 20,
        "mode": "normal",
        "size": "full"
      },
      {
        "type": "button",
        "label": i18next.t('frontend_workflow_instance_button_sign'),//"签批",
        "level": "link",
        "id": "u:2592111d236d",
        "block": false,
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "dialog",
                "dialog": {
                  "type": "dialog",
                  "title": `${field.name || field.code}`,
                  "body": [
                    {
                      "type": "form",
                      "title": "表单",
                      "body": [
                        {
                          "label": "",
                          "type": "textarea",
                          "name": "yijian",
                          "id": "u:1d5a60623000",
                          "minRows": 6,
                          "maxRows": 20,
                          "mode": "normal",
                          "placeholder": i18next.t('frontend_workflow_suggestion_placeholder'),//"请填写意见"
                        },
                        {
                          "type": "grid",
                          "columns": [
                            {
                              "body": [
                                {
                                  "type": "button",
                                  "label": i18next.t('frontend_workflow_approval_judge_readed'),//"已阅",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": i18next.t('frontend_workflow_approval_judge_readed'),//"已阅",
                                            "value": i18next.t('frontend_workflow_approval_judge_readed')//"已阅"
                                          },
                                          "actionType": "setValue"
                                        }
                                      ]
                                    }
                                  },
                                  "id": "u:13498f8d2882",
                                  "level": "link",
                                  "className": "m-r"
                                },
                                {
                                  "type": "button",
                                  "label": i18next.t('frontend_workflow_approval_suggestion_completed'),//"已办",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": i18next.t('frontend_workflow_approval_suggestion_completed'),//"已办",
                                            "value": i18next.t('frontend_workflow_approval_suggestion_completed')//"已办",
                                          },
                                          "actionType": "setValue"
                                        }
                                      ]
                                    }
                                  },
                                  "id": "u:cfa2e3c54a21",
                                  "level": "link",
                                  "className": "m-r"
                                },
                                {
                                  "type": "button",
                                  "label": i18next.t('frontend_workflow_approval_suggestion_agree'),//"同意",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": i18next.t('frontend_workflow_approval_suggestion_agree'),//"同意"
                                            "value": i18next.t('frontend_workflow_approval_suggestion_agree')//"同意"
                                          },
                                          "actionType": "setValue"
                                        }
                                      ]
                                    }
                                  },
                                  "id": "u:06e0037dcd23",
                                  "level": "link",
                                  "className": "m-r"
                                },
                                {
                                  "type": "button",
                                  "label": i18next.t('frontend_workflow_approval_suggestion_other'),//"同意"
                                  "onEvent": {
                                    "click": {
                                      "actions": []
                                    }
                                  },
                                  "id": "u:3a781bc550a2",
                                  "level": "link",
                                  "className": "m-r"
                                }
                              ],
                              "id": "u:3def7a5b7cd5"
                            }
                          ],
                          "id": "u:ecbefa51b638"
                        }
                      ],
                      "id": "u:dd32ae67b5c7"
                    }
                  ],
                  "id": "u:a5d06d3a61b9",
                  "closeOnEsc": false,
                  "closeOnOutside": false,
                  "showCloseButton": true,
                  "actions": [
                    {
                      "type": "button",
                      "label": "${'OK' | t}",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "componentId": `yijian-${field.code}`,
                              "args": {
                                "valueInput": "${yijian}",
                                "value": "${yijian}"
                              },
                              "actionType": "setValue"
                            },
                            {
                              "componentId": "",
                              "args": {},
                              "actionType": "closeDialog"
                            }
                          ]
                        }
                      },
                      "id": "u:87e22efe707a",
                      "level": "primary"
                    },
                    {
                      "type": "button",
                      "label": "${'Cancel' | t}",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "componentId": "",
                              "args": {},
                              "actionType": "closeDialog"
                            }
                          ]
                        }
                      },
                      "id": "u:d0e6550a848e"
                    }
                  ]
                }
              }
            ],
            "weight": 0
          }
        },
        "className": "instance-sign-text-btn",
      }
    ]
  }else{
    switch (field.type) {
      case "input":
        if (field.is_textarea) {
          tpl.type = "textarea";
        } else {
          tpl.type = "input-text";
        }
        if(field.formula){
          const formula = mapFormula(field.formula, !inTable ? tableFieldMap : null);
          if(formula){
            tpl.value = formula;
          }else{
            tpl.value = `$${field.formula}`;
          }
        }
        break;
      case "number":
        tpl.type = "input-number";
        tpl.precision=field.digits;
        if(field.formula){
          const formula = mapFormula(field.formula, !inTable ? tableFieldMap : null);
          if(formula){
            tpl.value = formula;
          }else{
            tpl.value = `$${field.formula}`;
          }
        }
        break;
      case "date":
        tpl.type = "input-date";
        tpl.inputFormat = "YYYY-MM-DD";
        tpl.format = 'YYYY-MM-DDT00:00:00.000[Z]';
        break;
      case "dateTime":
        tpl.type = "input-datetime";
        tpl.inputFormat = "YYYY-MM-DD HH:mm";
        tpl.format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        break;
      case "checkbox":
        tpl.type = "checkbox";
        break;
      case "email":
        tpl.type = "input-email";
        tpl.validations = {
          isEmail: true,
        };
        break;
      case "url":
        tpl.type = "input-url";
        tpl.validations = {
          isUrl: true,
        };
        break;
      case "password":
        tpl.type = "input-password";
        tpl.showCounter = true;
        break;
      case "select":
        tpl.type = "select";
        tpl.options = getSelectOptions(field);
        break;
      case "user":
        const useTpl = await lookupToAmis(
          {
            name: field.code,
            label: field.name,
            reference_to: "space_users",
            reference_to_field: 'user',
            multiple: field.is_multiselect,
          },
          false,
          {}
        );
        Object.assign(tpl, useTpl);
        tpl.onEvent = {
          "change": {
            "actions": [
              {
                "actionType": "ajax",
                "api": {
                  "url": "/api/formula/user/${event.data.value}",
                  "method": "get",
                  "messages": {
                    "success": "",
                    "failed": ""
                  },
                  "silent": true,
                  "adaptor": "return {applicantInfo: payload}"
                }
              },
              {
                "actionType": "custom",
                "script": `doAction({'componentId': 'u:instancePage',  'actionType': 'setValue',  'args': {    'value': {      '${field.code}__expand': event.data.applicantInfo   }  }}) `
              }
            ]
          }
        }
        break;
      case "group":
        const orgTpl = await lookupToAmis(
          {
            name: field.code,
            label: field.name,
            reference_to: "organizations",
            multiple: field.is_multiselect,
          },
          false,
          {}
        );
        Object.assign(tpl, orgTpl);
        break;
      case "radio":
        tpl.type = "radios";
        tpl.options = getSelectOptions(field);
        break;
      case "multiSelect":
        tpl.type = "checkboxes";
        tpl.options = getSelectOptions(field);
        break;
      case "odata":
        const argsName = getArgumentsList(field.filters);
        var labelField = field.formula.substr(1, field.formula.length - 2);
        labelField = labelField.substr(labelField.indexOf(".") + 1);
        tpl.type = "select";
        tpl.multiple = field.is_multiselect;
        // tpl.labelField = labelField;
        // tpl.valueField = "_value";
        tpl.autoComplete = {
          url: field.url.indexOf('?') < 0 ? `${field.url}?term=$\{term}` : `${field.url}&term=$\{term}`, 
          method: "get",
          dataType: "json",
          adaptor:`
            return (async () => {
              let options = _.map(payload.value, (item)=>{
                const value = item;
                item["@label"] = item["${labelField}"]
                delete item['@odata.editLink'];
                delete item['@odata.etag'];
                delete item['@odata.id'];
                return {
                  label: item["@label"],
                  value: value
                }
              });
              
              if(api.selectedIds && api.selectedIds.length > 0){
                const loadedIds = options.map(function(opt){
                  return opt.value._id;
                });
                const missingIds = api.selectedIds.filter(function(id){
                  return !loadedIds.includes(id);
                });
                if(missingIds.length > 0){
                  const baseUrl = api.baseUrl;
                  const idFilter = missingIds.map(function(id){
                    return "_id eq '" + id + "'";
                  }).join(" or ");
                  const fetchUrl = baseUrl + (baseUrl.indexOf('?') > -1 ? '&' : '?') + "$filter=" + idFilter;
                  try {
                    const response = await fetch(fetchUrl, {});
                    const data = await response.json();
                    if (data && data.value) {
                       const missingOptions = _.map(data.value, (item) => {
                           const value = item;
                           item["@label"] = item["${labelField}"];
                           delete item['@odata.editLink'];
                           delete item['@odata.etag'];
                           delete item['@odata.id'];
                           return {
                               label: item["@label"],
                               value: value
                           };
                       });
                       options.unshift(...missingOptions);
                    }
                  } catch (e) {
                      console.error("Failed to fetch missing values", e);
                  }
                }
              }

              payload.data = {
                options: options
              }
              return payload;
            })();
          `,
          requestAdaptor: `
            const filters = \`${_.replace(field.filters, /_.pluck/g, '_.map')}\`;
            let url = \`${field.url}\`;
            api.baseUrl = url;
            if(filters){
              let joinKey = url.indexOf('?') > 0 ? '&' : '?';
              let _filter = []
              if(filters.startsWith('function(') || filters.startsWith('function (')){
                const argsName = ${JSON.stringify(argsName)};
                const fun = eval('_fun='+filters);
                const funArgs = [];
                for(const item of argsName){
                  funArgs.push(context[item])
                }
                _filter = fun.apply({}, funArgs)
              }else{
                _filter = filters
              }

              const val = context.value || _.get(context, '${field.code}');
              let ids = [];
              if(val){
                const values = Array.isArray(val) ? val : [val];
                ids = values.map((v) => v && (v._id || v)).filter((v) => typeof v === 'string');
              }

              ids = _.uniq(ids);
              api.selectedIds = ids;
              
              if(context.term){
                _filter = \`(\${_filter}) and contains(name, '\${context.term}')\`
              }
              joinKey = url.indexOf('?') > 0 ? '&' : '?';
              api.url = url + joinKey + "$filter=" + _filter
            }else{
              api.url = url  
            }
            api.query = {};
            return api;
          `,
          trackExpression: _.join(_.map(argsName, (item)=>{return `\${${item}|json}`}), '-') + `-\${${field.code}|json}`
        };
        tpl.source = _.cloneDeep(tpl.autoComplete);
        delete tpl.autoComplete.trackExpression;
        tpl.isAmis=true;
        if(!inTable){
          tpl.searchable = true;
        }
        break;
      case "html":
        if (tpl.disabled) {
          tpl.type = 'html';
        } else {
          tpl.type = "input-rich-text";
          tpl.options = {
            menubar: false,
            statusbar: false,
            content_style: "table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #ddd !important; margin-bottom: 10px; } td, th { padding: 5px 10px !important; border: 1px solid #ddd !important; min-width: 50px; } th { background-color: #f7f7f7; font-weight: bold; }",
          };
        }
        break;
      // case "table":
      //   tpl.type = "input-table"; //TODO
      //   tpl.addable = field.permission === "editable";
      //   tpl.editable = tpl.addable;
      //   tpl.copyable = tpl.addable;
      //   tpl.removable = tpl.addable;
      //   tpl.columns = [];
      //   for (const sField of field.fields) {
      //     if (sField.type != "hidden") {
      //       sField.permission = field.permission
      //       const column = await getTdInputTpl(sField, true);
      //       tpl.columns.push(column);
      //     }
      //   }
      //   break;
      case "table":
        tpl.type = "steedos-input-table";
        tpl.addable = field.permission === "editable";
        tpl.editable = tpl.addable;
        tpl.removable = tpl.addable;
        tpl.dialog = {
          "title": `${field.name || field.code} ` + i18next.t('frontend_input_table_dialog_title_suffix')
        };
        if(tpl.addable){
          tpl.actionData = {
            "&" : "$$"
          }
        }
        // tpl.fieldPrefix = field.name + "_";
        tpl.autoGeneratePrimaryKeyValue = true;
        tpl.fields = [];
        if(tpl.editable){
          tpl.className = `${tpl.className || ''} steedos-input-table-editable`
        }
        for (const sField of field.fields) {
          if (sField.type != "hidden") {
            sField.permission = field.permission
            const column = await getTdInputTpl(sField, true, true);
          // console.log('table column', column, sField);
            if(column.type === 'steedos-field'){
              if(sField.visibleOn){
                column.config.visibleOn = sField.visibleOn
              }

              if(sField.requiredOn){
                column.config.requiredOn = sField.requiredOn
              }

              tpl.fields.push(column.config);
            }else{
              tpl.fields.push(column);
            }
          }
        }
        break;
      case "section":
        tpl.type = "input-text";
        break;
      default:
        tpl.type = 'steedos-field'
        tpl.config = field.steedos_field || field.config
        break;
    }
  }
  // console.log('getFieldEditTpl ', label, tpl, field)
  return tpl;
};

const getFieldReadonlyTpl = async (field, label, inTable, tableFieldMap)=>{
  // console.log('getFieldReadonlyTpl', label, field);
  let tpl = {
    label: label === true ? (field.name || field.code) : false,
    name: field.code,
    mode: "horizontal",
    className: `m-none p-none form-control steedos-field-${field.type}-readonly`,
  };
  if(includes(['text', 'input', 'number'], field.type) && field.formula){
    const formula = mapFormula(field.formula, !inTable ? tableFieldMap : null);
    if(formula){
      tpl.value = formula;
    }else{
      tpl.value = field.formula.replace(/"/g, '');
      if(field.type === 'number'){
        try {
          tpl.value = Number(tpl.value);
          tpl.type = 'static-number';
        } catch (error) {
          console.error('getFieldReadonlyTpl number formula parse error', field.code, field.formula, error);
        }
      }
    }

  }
  if(includes(['text', 'input', 'number'], field.type) && field.default_value){
    const formula = mapFormula(field.default_value, !inTable ? tableFieldMap : null);
    if(formula){
      tpl.value = formula;
    }else{
      tpl.value = field.default_value.replace(/"/g, '');
      if(field.type === 'number'){
        try {
          tpl.value = Number(tpl.value);
          tpl.type = 'static-number';
        } catch (error) {
          console.error('getFieldReadonlyTpl number default_value parse error', field.code, field.formula, error);
        }
      }
    }

  }
  if(includes(['text'], field.type)){
    tpl.type = `static-${field.type}`;
  }else if(field.type === 'select'){
    const options = getSelectOptions(field);
    const map = {};
    each(options , (item)=>{
      map[item.value] = item.label;
    })
    tpl.type = 'static';
    tpl.tpl = `<% var options = ${JSON.stringify(map)}; return (options && options[data["${field.code}"]]) || ''%>`
  }else if(field.type === 'odata'){
    tpl.type = 'static';
    tpl.tpl = `<div>\${${field.code}['@label']}</div>`
  }else if(field.type === 'checkbox'){
    tpl.type = 'static';
    tpl.tpl = `\${${field.code} ? '是': '否'}`
  }else if(field.type === 'email'){
    tpl.type = 'static'
    tpl.tpl = `<a href="mailto:\${${field.code}}">\${${field.code}}</a>`
  }else if(field.type === 'url'){
    tpl.type = 'static'
    tpl.tpl = `<a href="\${${field.code}}" target="_blank">\${${field.code}}</a>`
  }else if(field.type === 'password'){
    tpl.type = 'static'
    tpl.tpl = `******`
  }else if(field.type === 'date'){
    tpl.type = 'static'
    // tpl.format = 'YYYY-MM-DD HH:mm'
    tpl.tpl = `<%=data.${field.code} ? date(new Date(data.${field.code}), 'YYYY-MM-DD') : '' %>`
  }else if(field.type === 'dateTime'){
    tpl.type = 'static'
    // tpl.format = 'YYYY-MM-DD HH:mm'
    tpl.tpl = `<%=data.${field.code} ? date(new Date(data.${field.code}), 'YYYY-MM-DD HH:mm') : '' %>`
  }else if(field.type === 'user'){
    // tpl.type = 'static'
    // // tpl.format = 'YYYY-MM-DD HH:mm'
    // if(field.is_multiselect){
    //   tpl.tpl = `\${_.map(${field.code}, 'name')}`
    // }else{
    //   tpl.tpl = `\${${field.code} && ${field.code}.name}`
    // }

    tpl = {
      "type": "steedos-field",
      "id": `u:${field.code}`,
      "static": true,
      // "openDrawer": false,
      "config": {
        name: field.code,
        label: false,
        reference_to: "space_users",
        reference_to_field: 'user',
        multiple: field.is_multiselect,
        type: "lookup"
      }
    }
  }else if(field.type === 'group'){
    tpl.type = 'static'
    // tpl.format = 'YYYY-MM-DD HH:mm'
    tpl.tpl = `\${${field.code}.name}`

    tpl = {
      "type": "steedos-field",
      "id": `u:${field.code}`,
      "static": true,
      // "openDrawer": false,
      "config": {
        name: field.code,
        label: false,
        reference_to: "organizations",
        multiple: field.is_multiselect,
        type: "lookup"
      }
    }

  }else if(field.type === 'table'){
    tpl.type = "steedos-input-table";
    tpl.disabled = true;
    tpl.autoGeneratePrimaryKeyValue = true;
    tpl.fields = [];
    tpl.dialog = {
      "title": `${field.name || field.code} ` + i18next.t('frontend_input_table_dialog_title_suffix')
    };
    for (const sField of field.fields) {
      if (sField.type != "hidden") {
        sField.permission = "readonly";
        const column = await getTdInputTpl(sField, true);
        // console.log('table column', column, sField);
        if(column.type === 'steedos-field'){
          if(sField.visibleOn){
            column.config.visibleOn = sField.visibleOn
          }
          tpl.fields.push(column.config);
        }else{
          tpl.fields.push(column);
        }
      }
    }
  }else if(field.type === 'html'){
    tpl.type = 'tpl';
  }else if(field.type.startsWith("sfield-") || field.type === 'steedos-field'){
    tpl.type = 'steedos-field'
    tpl.config = field.steedos_field || field.config
    if(tpl.config){
      delete tpl.config.required
    }
    tpl.static = true
    tpl.inInputTable = true;
  }
  else{
    if(tpl.type != 'static-number'){
      tpl.type = 'static';
    }
  }
  // console.log('getFieldReadonlyTpl', tpl)
  return tpl;
};

/**
 * TODO 先将申请单上的字段转化为 steedos field 类型, 只读、编辑 使用 steedos field tpl
 * @param {*} field 
 * @param {*} label 
 * @returns 
 */
const getTdInputTpl = async (field, label, inTable=false, tableFieldMap) => {
  if(field.config?.amis?.name){
    delete field.config.amis.name
  }
  const edit = field.permission === "editable";
  if(edit){
    return await getFieldEditTpl(field, label, inTable, tableFieldMap)
  }else{
    return await getFieldReadonlyTpl(field, label, inTable, tableFieldMap)
  }
};

const getTdField = async (field, fieldsCount, tableFieldMap) => {
  return {
    background: field.permission !== "editable" ? "#FFFFFF" : "rgba(255,255,0,.1)",
    colspan: (field.type === "table" || field.type === "html" || field.config?.type === 'html') ? 4 : 3 - (fieldsCount - 1) * 2,
    align: "left",
    className: "td-field",
    width: "32%",
    body: [await getTdInputTpl(field, null, false, tableFieldMap)],
    style: {
      marginTop: "0",
      paddingTop: "0",
      paddingRight: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",
      borderLeftColor: "#000000",
      borderTopColor: "#000000",
      borderRightColor: "#000000",
      borderBottomColor: "#000000",
    },
    // "id": "u:9b001b7ff92d"
  };
};

const getTdTitle = (field) => {
  const requiredOn = field.config?.amis?.requiredOn;
  // console.log('getTdTitle', field.is_required , requiredOn, field);
  return {
    className: `td-title td-title-${field.type}`,
    align: field.type != "section" ? "center" : "left",
    width: field.type != "section" ? "16%" : "",
    colspan: field.type == "section" ? 4 : "",
    background: field.type == "section" ? "#f1f1f1" : "#FFFFFF",
    body: [
      {
        type: "tpl",
        tpl: `<div class='${field.type == "section" ? "font-bold" : ""}'>${field.name || field.code} <span class="antd-Form-star">*</span><pre class='font-normal'>${field.description || ''}</pre></div>`,
        className: field.is_required ? 'steedos-field-required' : (requiredOn ? {'steedos-field-required' : `${requiredOn}`} : '')
      },
    ],
    // "id": "u:9b001b7ff92d",
    style: {
      borderLeftColor: "#000000",
      borderTopColor: "#000000",
      borderRightColor: "#000000",
      borderBottomColor: "#000000",
    },
  };
};

const getTds = async (tdFields, tableFieldMap) => {
  const tds = [];
  for (const field of tdFields) {
    if (field.type != "table" && field.type != "html" && field.config?.type != 'html') {
      tds.push(getTdTitle(field));
    }
    if (field.type != "section") {
      tds.push(await getTdField(field, tdFields.length, tableFieldMap));
    }
  }
  return tds;
};

const getFormTrs = async (instance, tableFieldMap) => {
  // console.log('getFormTrs instance====>', instance);
  const trsSchema = [];
  const trs = [];
  let tdFields = [];
  let fields = [];
  each(instance.fields, (field) => {
    fields.push(field);
    if (field.type === "section" && field.fields) {
      fields = fields.concat(field.fields);
    }
  });
  each(fields, (field, index) => {
    if (field.is_wide || field.type === "html" || field.config?.type === 'html') {
      if (tdFields.length != 0) {
        trs.push(tdFields);
      }
      if (field.type == "table") {
        trs.push([Object.assign({}, field, { type: "section" })]);
      }
      tdFields = [];
      tdFields.push(field);
      trs.push(tdFields);
      tdFields = [];
    } else {
      tdFields.push(field);
      if (tdFields.length == 2 || index === fields.length - 1) {
        trs.push(tdFields);
        tdFields = [];
      }
    }
  });
  for (const tdFields of trs) {
    trsSchema.push({
      background: "#F7F7F7",
      tds: await getTds(tdFields, tableFieldMap),
    });
  }
  return trsSchema;
};

const getFormTableView = async (instance, tableFieldMap) => {
  const formSchema = {
    type: "table-view",
    className: "instance-form-view",
    trs: await getFormTrs(instance, tableFieldMap),
    id: "u:047f3669468b",
  };
  return formSchema;
};

const getFormMobileView = async (instance, tableFieldMap) => {
  const body = [];
  let fields = [];
  
  each(instance.fields, (field) => {
    fields.push(field);
    if (field.type === "section" && field.fields) {
      fields = fields.concat(field.fields);
    }
  });

  for (const field of fields) {
      // Section 作为分组标题（shadcn/ui 风格：上方 separator + 标题 + 描述）
      if(field.type === 'section'){
          body.push({
              type: "container",
              body: [
                {
                  type: "tpl",
                  tpl: `<div class="mobile-section-header"><div class="mobile-section-title">${field.name || field.code}</div>${field.description ? '<div class="mobile-section-desc">' + field.description + '</div>' : ''}</div>`,
                  className: "block w-full text-left"
                }
              ],
              className: "mobile-section-divider mt-6 mb-2 px-0"
          });
          continue;
      }
      
      const inputTpl = await getTdInputTpl(field, false, false, tableFieldMap);

      // 去除 PC Table 模式下的特定样式
      if(inputTpl.className){
        inputTpl.className = inputTpl.className.replace(/m-none|p-none/g, '').trim();
      }

      // 手机端只读态优化：如果是 static 类型，可能还是原来的样式，确保可读性
      if(inputTpl.type && inputTpl.type.startsWith('static')){
         // 可以追加一些样式
      }

      // Label 样式
      const labelTpl = {
        type: "tpl",
        className: "block text-left px-0", // 移除 px-2，使 Label 与字段值背景色左边缘对齐
        tpl: `<div class="font-bold text-gray-700 mb-1" style="font-size: 14px;">${
          field.name || field.code
        } ${field.is_required ? '<span class="text-red-500">*</span>' : ''}</div>`,
      };

      body.push({
        type: "container",
        className: "pt-2 bg-white text-left",
        body: [
            labelTpl, 
            {
                type: "container",
                className: field.permission === 'editable' ? "px-2 mobile-editable-field" : "px-0 pb-2", // Input container padding
                style: {
                    backgroundColor: "#ffffff",
                    border: field.permission === 'editable' ? "1px solid #d1d5db" : "none",
                    borderRadius: field.permission === 'editable' ? "8px" : "0"
                },
                body: [inputTpl]
            }
        ]
      });
  }

  return {
    type: "wrapper",
    className: "instance-form-view-mobile p-0 px-2 bg-white mt-4", // Added px-2 wrapper padding
    body: body
  };
};

const getFormSteps = async (instance, tableFieldMap) => {
  const formMode = instance.formVersion.mode || "normal";//normal,horizontal,inline
  const stepsSchema = [];
  let stepFields = [];
  let fields = [];
  let unGroupFields = [];
  each(instance.fields, (field) => {
    if (field.type === "section") {
      fields.push(field);
    }
    else {
      unGroupFields.push(field);
    }
  });
  if (unGroupFields.length > 0) {
    fields = [{
      type: "section",
      name: "General",
      code: "General",
      fields: unGroupFields
    }].concat(fields);
  }

  for (const field of fields) {
    if (field.type === "section" && field.fields) {
      stepFields = [];
      let fieldSchema;
      for (const childField of field.fields) {
        fieldSchema = await getTdInputTpl(childField, true, false, tableFieldMap);
        if (fieldSchema.type === "steedos-field" && fieldSchema.config) {
          if (fieldSchema.config.amis) {
            fieldSchema.config.amis.mode = formMode;
          }
          else {
            fieldSchema.config.amis = { mode: formMode };
          }
        }
        else {
          fieldSchema.mode = formMode;
        }
        stepFields.push(fieldSchema);
      }
      stepsSchema.push({
        "title": field.name,
        "body": stepFields
      });
    }
  }
  var isReadonlyBox = instance.box !== 'inbox' && instance.box !== 'draft';
  if (isReadonlyBox) {
    // 只读的审批箱中最后一步的保存按钮要隐藏
    if (stepsSchema.length == 1) {
      stepsSchema[stepsSchema.length - 1].actions = [];
    }
    else if (stepsSchema.length > 1) {
      stepsSchema[stepsSchema.length - 1].actions = [
        {
          "label": "Prev",
          "type": "button",
          "actionType": "prev"
        }
      ];
    }
  }
  return stepsSchema;
}

const getFormWizardView = async (instance, tableFieldMap) => {
  const wizardMode = instance.formVersion.wizard_mode || "vertical";//vertical,horizontal
  const formSchema = {
    type: "wizard",
    className: `instance-form-view-wizard ${wizardMode === "horizontal" ? "pt-4" : "pt-1"} mt-3`,
    mode: wizardMode,
    steps: await getFormSteps(instance, tableFieldMap),
    actionFinishLabel: "${'CustomAction.instances.instance_save' | t}",//"保存",
    id: "instance_wizard",
    target: "instance_form",
    "onEvent": {
      "change": {
        "actions": [
          {
            "actionType": "setValue",
            "componentId": "instance_form",
            "args": {
              "value": "${event.data}"
            }
          }
        ]
      },
      "finished": { //点最后一步完成按钮触发暂存按钮事件保存数据
        "actions": [
          {
            "actionType": "click",
            "componentId": "u:instance_save"
          }
        ]
      }
    },
  };
  return formSchema;
};

const getApplicantTableView = async (instance) => {
  let applicantInput = null;
  if(instance.state === 'draft'){
    applicantInput = Object.assign({name: "__applicant", value: instance.applicant || getSteedosAuth().userId, disabled: instance.box !== 'draft'}, await lookupToAmis(
      {
        name: "__applicant",
        label: false,
        reference_to: "space_users",
        reference_to_field: 'user',
        multiple: false,
        clearable: false
      },
      false,
      {}
    ), {
        "onEvent": {
          "change": {
            "actions": [
              {
                "actionType": "ajax",
                "api": {
                    "url": "/api/workflow/v2/instance/save",
                    "method": "post",
                    "sendOn": "",
                    "requestAdaptor": "var _SteedosUI$getRef$get, _approveValues$next_s;\nconst formValues = context._scoped.getComponentById(\"instance_form\").getValues(); const _formValues = JSON.parse(JSON.stringify(formValues)); if(_formValues){delete _formValues.__applicant} \nconst approveValues = (_SteedosUI$getRef$get = context._scoped.getComponentById(\"instance_approval\")) === null || _SteedosUI$getRef$get === void 0 ? void 0 : _SteedosUI$getRef$get.getValues();\nlet nextUsers = approveValues === null || approveValues === void 0 ? void 0 : approveValues.next_users;\nif (_.isString(nextUsers)) {\n  nextUsers = [approveValues.next_users];\n}\nconst instance = context.record;\nconst body = {\n  instance: {\n    _id: instance._id,\n    applicant: context.__applicant,\n    submitter: formValues.submitter,\n    traces: [{\n      _id: instance.trace._id,\n      step: instance.step._id,\n      approves: [{\n        _id: instance.approve._id,\n        next_steps: [{\n          step: approveValues === null || approveValues === void 0 || (_approveValues$next_s = approveValues.next_step) === null || _approveValues$next_s === void 0 ? void 0 : _approveValues$next_s._id,\n          users: nextUsers\n        }],\n        description: approveValues === null || approveValues === void 0 ? void 0 : approveValues.suggestion,\n        values: _formValues\n      }]\n    }]\n  }\n};\napi.data = body;\nreturn api;",
                    "adaptor": "if (payload.instance == \"upgraded\") { window.setTimeout(function(){ window.location.reload(); }, 2000); return {...payload, status: 1, msg: t('instance_action_instance_save_msg_upgraded')}; } \n return payload.instance != false ? {...payload, status: 0, msg: ''} : {...payload, status: 1, msg: t('instance_action_instance_save_msg_failed')};",
                    "headers": {
                        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                    },
                    "data": {
                        "&": "$$"
                    }
                }
              },
              {
                "actionType": "ajax",
                "api": {
                  "url": "/api/formula/user/${event.data.value}",
                  "method": "get",
                  "messages": {
                    "success": "",
                    "failed": ""
                  },
                  "silent": true,
                  "adaptor": "return {applicantInfo: payload}"
                }
              },
              {
                "actionType": "custom",
                "script": "doAction({'componentId': 'u:instancePage',  'actionType': 'setValue',  'args': {    'value': {      'applicant': event.data.applicantInfo   }  }}) "
              }
            ]
          }
        } 
    });
  }else{
    applicantInput = {
      label: false,
      mode: "horizontal",
      className: "m-none p-none",
      disabled: true,
      type: "tpl",
      tpl: '<div>${applicant_name}</div>',
      id: "u:2016b04355f4",
    }
  }
  // console.log('applicantInput', applicantInput);
  if(applicantInput){
    if(applicantInput.className){
      applicantInput.className = `${applicantInput.className} inline-left`
    }else{
      applicantInput.className = `inline-left`
    }
  }

  return {
    type: "table-view",
    className: "instance-applicant-view",
    trs: [
      {
        background: "#FFFFFF",
        tds: [
          {
            className: "td-title",
            background: "#FFFFFF",
            align: "left",
            width: "50%",
            colspan: "",
            body: [
              {
                type: "tpl",
                tpl: "<div class='inline-left'>" + i18next.t('frontend_workflow_instances_applicant_name_prefix') + "</div>",
                id: "u:ee62634201bf",
              },
              applicantInput
            ],
            id: "u:6c24c1bb99c9",
            style: {
              padding: "none",
            },
          },
          {
            className: "td-title",
            background: "#FFFFFF",
            align: "left",
            width: "50%",
            colspan: "",
            body: [
              {
                type: "tpl",
                tpl: "<div class='inline-left'>" + i18next.t('frontend_workflow_instance_submit_date_prefix') + "</div>",
                id: "u:6d0a7763d527",
              },
              {
                label: false,
                mode: "horizontal",
                className: "m-none p-none inline-left",
                disabled: true,
                type: "tpl",
                inputFormat: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: '<div>${submit_date}</div>',
                id: "u:2016b04355f4",
              }
            ],
            id: "u:c8b8214ac931",
            style: {
              padding: "none",
            },
          }
        ],
      },
    ],
    id: "u:047f3669468b",
    style: {
      borderLeftStyle: "none",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
    },
  };
};

const getApproveButton = async (instance, events)=>{
  if(!instance.approve || ( instance.box != 'inbox' && instance.box != 'draft')){
    return null;
  }
  return {
    type: "wrapper",
    className: "p-0 steedos-approve-footer",
    body: [
      await getApprovalDrawerSchema(instance, events),
      // 保留隐藏的代理按钮，兼容服务端 "发送" 按钮通过 .approve-button 触发提交的行为
      {
        type: "button",
        label: "",
        id: "steedos-approve-button",
        className: "approve-button hidden",
        onEvent: {
          click: {
            actions: [
              {
                actionType: "custom",
                script: `
                  var bodyEl = document.querySelector('.steedos-amis-instance-view-body');
                  if (bodyEl) {
                    // 先滚动到审批区域底部，确保用户能看到校验错误
                    bodyEl.scrollTo({ top: bodyEl.scrollHeight, behavior: 'smooth' });
                  }
                  var btnSubmit = document.querySelector('.steedos-instance-detail-wrapper .steedos-approve-submit-button');
                  // 等待平滑滚动完成（smooth scroll 通常 ≤ 300ms）后再触发提交
                  setTimeout(function() {
                    if (btnSubmit) { btnSubmit.click(); } else { console.warn('[steedos] approve submit button not found'); }
                  }, 300);
                `
              }
            ]
          }
        }
      }
    ]
  };
}


export const getFlowFormSchema = async (instance, box, print) => {
  const tableFieldMap = getTableFieldMap(instance.fields);
  const formStyle = instance.formVersion.style || "table";
  const isMobile = window.innerWidth < 768;
  
  const amisSchemaStr = instance.formVersion?.amis_schema;
  
  let initedEvents = [];
  let changeEvents = [];
  let submitEvents = [];
  let nextStepInitedEvents = [];
  let nextStepChangeEvents = [];
  let nextStepUserChangeEvents = [];

  if(amisSchemaStr){
    const onEvent = JSON.parse(instance.formVersion.amis_schema).onEvent;
    initedEvents = onEvent?.inited?.actions || [];
    changeEvents = onEvent?.change?.actions || [];
    submitEvents = onEvent?.submit?.actions || [];
    nextStepInitedEvents = onEvent?.nextStepInited?.actions || [];
    nextStepChangeEvents = onEvent?.nextStepChange?.actions || [];
    nextStepUserChangeEvents = onEvent?.nextStepUserChange?.actions || [];
  }

    let formContentSchema;
  let instanceFormSchema;
  if(print && instance.flow.print_template){
    try {
      instanceFormSchema = JSON.parse(instance.flow.print_template);
    } catch (error) {
      instanceFormSchema = {
        type: 'liquid',
        template: instance.flow.print_template
      }
    }
  }else{
    if(!isMobile && instance.flow.instance_template){
      try {
        formContentSchema = JSON.parse(instance.flow.instance_template);
      } catch (error) {
        formContentSchema = {
          type: 'liquid',
          template: instance.flow.instance_template
        }
      }
    }else{
      if (isMobile) {
        formContentSchema = await getFormMobileView(instance, tableFieldMap);
      }
      else if (formStyle === "wizard") {
        formContentSchema = await getFormWizardView(instance, tableFieldMap);
      }
      else{
        formContentSchema = await getFormTableView(instance, tableFieldMap);
      }
    }
    
    instanceFormSchema = {
      type: "form",
      debug: false,
      wrapWithPanel: false,
      resetAfterSubmit: true,
      promptPageLeave: true,
      className: 'instance-form',
      body: [
        {
          type: "tpl",
          id: "u:f5bb0ad602a6",
          tpl: `<div class="instance-name">\${title}</div>`,
          inline: true,
          wrapperComponent: "",
          style: {
            fontFamily: "",
            fontSize: 12,
            textAlign: "center",
          },
        },
        formContentSchema,
        await getApplicantTableView(instance),
      ],
      id: "instance_form",
      onEvent: {
        // validateError: {
        //   weight: 0,
        //   actions: [
        //     {
        //       "componentId": "",
        //       "args": {
        //         "msgType": "info",
        //         "position": "top-right",
        //         "closeButton": true,
        //         "showIcon": true,
        //         "title": i18next.t('frontend_workflow_submit_validate_error_title'),//"提交失败",
        //         "msg": i18next.t('frontend_workflow_submit_validate_error_msg'),//"请填写必填字段"
        //       },
        //       "actionType": "toast"
        //     }
        //   ],
        // },
        change: {
          weight: 0,
          actions: [
            {
              "actionType": "custom",
              "script": "window.SteedosWorkflow.Instance.changed = true;"
            },
            {
              "actionType": "custom",
              "script": `
                var data = event.data;
                var changes = {};
                var hasChanges = false;
                _.each(data, function(value, key){
                  if(typeof key === 'string' && (key.indexOf('（') > -1 || key.indexOf('）') > -1 || key.indexOf('、') > -1)){
                      var newKey = key.replace(/（/g, '_').replace(/）/g, '').replace(/、/g, '_');
                      if(data[newKey] !== value){
                        changes[newKey] = value;
                        hasChanges = true;
                      }
                  }
                });
                if(hasChanges){
                  doAction({
                    actionType: 'setValue',
                    componentId: 'instance_form',
                    args: {
                      value: changes
                    }
                  });
                }
              `
            },
            {
              "actionType": "custom",
              "script": `
                if(window.steedosWorkflowReloadStepTimer){
                  clearTimeout(window.steedosWorkflowReloadStepTimer);
                }
                window.steedosWorkflowReloadStepTimer = setTimeout(()=>{
                  doAction({
                    "actionType": "reload",
                    "componentId": "u:next_step",
                    "args": {}
                  });
                }, 1500);
                window.steedosWorkflowStepUsersNeedReload = true;
              `
            },
            ...changeEvents
          ]
        }
      }
    };
  }

  console.log('instanceFormSchema....', instanceFormSchema)
  return {
    type: "page",
    name: "instancePage",
    className: "steedos-amis-instance-view sm:rounded " + "steedos-instance-style-" + formStyle + (isMobile ? " steedos-mobile-view" : ""),
    bodyClassName: "overflow-y-auto h-full steedos-amis-instance-view-body",
    headerClassName: "p-0",
    "title": print ? null : {
      "type": "steedos-record-detail-header",
      "label": "标题面板",
      "objectApiName": "instances",
      "recordId": instance._id,
      "id": "u:e6b2adbe0e21",
      "showRecordTitle": false,
      "className": "sm:rounded-tl sm:rounded-tr"
    },
    "css": {
      ".steedos-amis-instance-view-body": {
        "height": "calc(100% - 65px)"
      },
      ".instance-approve-history .antd-Table-table thead": {
        "display": "none"
      },
      ".instance-approve-history .antd-Table-heading": {
        "font-size": "14px",
        "font-weight": "500",
        "padding-left": "0px"
      },
      ".antd-List-heading": {
        "font-size": "14px",
        "font-weight": "500"
      },
      ".steedos-amis-instance-view.steedos-instance-style-table .antd-Page-body .steedos-amis-instance-view-content": {
        "max-width": "1024px"
      },
      ".steedos-amis-instance-view.steedos-instance-style-table .antd-Page-body .steedos-amis-instance-view-content .steedos-input-table": {
        "max-width": "1024px"
      },
      ".antd-List-placeholder": {
        "display": "none"
      },
      ".steedos-amis-instance-view .antd-Table-fixedTop":{
        "top": "-13px"
      },
      ".steedos-amis-instance-view .antd-Table-fixedTop:after":{
        "box-shadow": "none"
      },
      ".antd-List-items": {
        "border": '0px'
      },
      ".antd-ListItem": {
        "border-top": "0px  !important",
        "background": "transparent !important"
      }
    },
    body: [{
      "type": "wrapper",
      "body": [
        await getAttachments(instance),
        await getRelatedInstances(instance),
        await getRelatedRecords(instance),
        instanceFormSchema,
        await getStepsSchema(instance),
        await getInstanceApprovalHistory(isMobile),
        await getApproveButton(instance, { submitEvents , nextStepInitedEvents, nextStepChangeEvents, nextStepUserChangeEvents})
      ],
      "size": "none",
      "className": "steedos-amis-instance-view-content"
    }],
    id: "u:instancePage",
    messages: {},
    pullRefresh: {},
    regions: [
      "body",
      "header"
    ],
    onEvent: {
      "@data.@instanceDetail.changed": {
        actions: [
          {
            componentId:"u:instancePage",
            actionType: "reload"
          }
        ]
      },
      "inited": {
        "actions": [
          {
              "actionType": "custom",
              "script": `
                setTimeout(function(){
                  var form = event.context.scoped.getComponentById('instance_form');
                  var data = form.getValues();
                  var changes = {};
                  var hasChanges = false;
                  _.each(data, function(value, key){
                    if(typeof key === 'string' && (key.indexOf('（') > -1 || key.indexOf('）') > -1 || key.indexOf('、') > -1)){
                        var newKey = key.replace(/（/g, '_').replace(/）/g, '').replace(/、/g, '_');
                        if(data[newKey] !== value){
                          changes[newKey] = value;
                          hasChanges = true;
                        }
                    }
                  });
                  if(hasChanges){
                    doAction({
                      actionType: 'setValue',
                      componentId: 'instance_form',
                      args: {
                        value: changes
                      }
                    });
                  }
                }, 1500 )
              `
          },
          {
              actionType: 'broadcast',
              eventName: "recordLoaded"
          },
          {
            "actionType": "setValue",
            "componentId": "instance_form",
            "args": {
              "value": "${event.data.context.approveValues}"
            },
            "expression": "${event.data.context.flowVersion.style === 'wizard'}"// 表单为 wizard 样式时需要初始同步表单数据，否则直接点击暂存按钮会清空数据
          },
          {
              "actionType": "custom",
              "script": `
                setTimeout(function(){
                  var formEl = document.getElementsByClassName('instance-form')[0];
                  if(!formEl) return;
                  formEl.addEventListener('focusout', function(e){
                    setTimeout(function(){
                      if(window.steedosWorkflowStepUsersNeedReload && !formEl.contains(document.activeElement)){
                        window.steedosWorkflowStepUsersNeedReload = false;
                        doAction({
                          "actionType": "reload",
                          "componentId": "u:set_steps_users",
                          "args": {}
                        });
                      }
                    }, 300);
                  });
                }, 1000);
              `
          },
          ...initedEvents
        ]
      }
    },
    initApi:{
      "url": "${context.rootUrl}/graphql",
      "method": "post",
      "headers": {
        "Authorization": "Bearer ${context.tenantId},${context.authToken}"
      },
      "messages": {
      },
      "requestAdaptor": `
        api.data = {
          query: \`
            {
              instance: instances__findOne(id:"${instance._id}"){
                related_instances: related_instances__expand{
                  _id,
                  name
                }
              }
            }
          \`
        }
        return api;
      `,
      "adaptor": `
        var instance = payload.data.instance;
        var formatData = function(data){
          if(_.isArray(data)){
            _.each(data, function(item){
              formatData(item);
            })
          }else if(_.isObject(data)){
            _.each(data, function(value, key){
              if(key.indexOf('（') > -1 || key.indexOf('）') > -1 || key.indexOf('、') > -1){
                  var newKey = key.replace(/（/g, '_').replace(/）/g, '').replace(/、/g, '_');
                  data[newKey] = value;
              }
              formatData(value);
            })
          }
        }
        formatData(instance);
        payload.data = {
          related_instances: payload.data.instance.related_instances,
          ...payload.data.instance
        };
        return payload;
      `,
      "data": {
        "judge": "${new_judge}",
      }
    },
    initFetch: true
  };
};
