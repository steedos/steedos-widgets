/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-07 16:20:45
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-12-29 16:06:35
 * @Description:
 */
import {
  lookupToAmis,
  getSteedosAuth,
} from "@steedos-widgets/amis-lib";

import { each, startsWith, includes } from "lodash";

import { getApprovalDrawerSchema } from "./approve";

import { getAttachments } from './attachment';

import { getRelatedRecords, getRelatedInstances } from './related';

import { getInstanceApprovalHistory } from './history';


const getSelectOptions = (field) => {
  const options = [];
  each(field.options.split("\n"), (item) => {
    var foo = item.split(":");
    if (foo.length == 2) {
      options.push({ label: foo[0], value: foo[1] });
    } else {
      options.push({ label: item, value: item });
    }
  });
  return options;
};

const isOpinionField = (field)=>{
  const field_formula = field.formula;
  return (field_formula?.indexOf("{traces.") > -1 || field_formula?.indexOf("{signature.traces.") > -1 || field_formula?.indexOf("{yijianlan:") > -1 || field_formula?.indexOf("{\"yijianlan\":") > -1 || field_formula?.indexOf("{'yijianlan':") > -1)
}

const getFieldEditTpl = async (field, label)=>{
  const tpl = {
    label: label === true ? field.name : false,
    name: field.code,
    mode: "horizontal",
    className: "m-none p-none form-control",
    disabled: field.permission !== "editable",
    required: field.is_required
  };
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
        "label": "签批",
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
                          "placeholder": "请填写意见"
                        },
                        {
                          "type": "grid",
                          "columns": [
                            {
                              "body": [
                                {
                                  "type": "button",
                                  "label": "已阅",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": "已阅",
                                            "value": "已阅"
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
                                  "label": "已办",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": "已办",
                                            "value": "已办"
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
                                  "label": "同意",
                                  "onEvent": {
                                    "click": {
                                      "actions": [
                                        {
                                          "componentId": "u:1d5a60623000",
                                          "args": {
                                            "valueInput": "同意",
                                            "value": "同意"
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
                                  "label": "其他常用意见",
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
                      "label": "确认",
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
                      "label": "取消",
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
        break;
      case "number":
        tpl.type = "input-number";
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
        var labelField = field.formula.substr(1, field.formula.length - 2);
        labelField = labelField.substr(labelField.indexOf(".") + 1);
        tpl.type = "select";
        tpl.multiple = field.is_multiselect;
        // tpl.labelField = labelField;
        // tpl.valueField = "_value";
        tpl.source = {
          url: startsWith(field.url, "http")
            ? field.url
            : `\${context.rootUrl}${field.url}`,
          method: "get",
          dataType: "json",
          headers: {
            Authorization: "Bearer ${context.tenantId},${context.authToken}",
          },
          adaptor:`
            payload.data = {
              options: _.map(payload.value, (item)=>{
                const value = item;
                item["@label"] = item["${labelField}"]
                delete item['@odata.editLink'];
                delete item['@odata.etag'];
                delete item['@odata.id'];
                return {
                  label: item["@label"],
                  value: value
                }
              })
            }
            return payload;
          `
        };
        break;
      case "html":
        if (tpl.disabled) {
          tpl.type = 'html';
        } else {
          tpl.type = "input-rich-text";
        }
        break;
      case "table":
        tpl.type = "input-table"; //TODO
        tpl.addable = field.permission === "editable";
        tpl.editable = tpl.addable;
        tpl.copyable = tpl.addable;
        tpl.removable = tpl.addable;
        tpl.columns = [];
        for (const sField of field.fields) {
          if (sField.type != "hidden") {
            sField.permission = field.permission
            const column = await getTdInputTpl(sField, true);
            tpl.columns.push(column);
          }
        }
        break;
      case "section":
        tpl.type = "input-text";
        break;
      default:
        tpl.type = 'steedos-field'
        tpl.config = field.steedos_field
        break;
    }
  }
  // console.log('getFieldEditTpl ', label, tpl)
  return tpl;
};

const getFieldReadonlyTpl = async (field, label)=>{
  // console.log(`getFieldReadonlyTpl`, label, field)
  const tpl = {
    label: label === true ? field.name : false,
    name: field.code,
    mode: "horizontal",
    className: "m-none p-none form-control",
  };
  if(includes(['text'], field.type)){
    tpl.type = `static-${field.type}`;
  }else if(field.type === 'select'){
    const options = getSelectOptions(field);
    const map = {};
    each(options , (item)=>{
      map[item.value] = item.label;
    })
    tpl.type = 'static';
    tpl.tpl = `<% var options = ${JSON.stringify(map)}; return (options && options[data.${field.code}]) || ''%>`
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
    tpl.type = 'static'
    // tpl.format = 'YYYY-MM-DD HH:mm'
    if(field.is_multiselect){
      tpl.tpl = `\${_.map(${field.code}, 'name')}`
    }else{
      tpl.tpl = `\${${field.code} && ${field.code}.name}`
    }
  }else if(field.type === 'group'){
    tpl.type = 'static'
    // tpl.format = 'YYYY-MM-DD HH:mm'
    tpl.tpl = `\${${field.code}.name}`
  }else if(field.type === 'table'){
    tpl.type = "input-table"; //TODO
    tpl.addable = field.permission === "editable";
    tpl.editable = tpl.addable;
    tpl.removable = tpl.addable;
    tpl.copyable = tpl.addable;
    tpl.columns = [];
    for (const sField of field.fields) {
      if (sField.type != "hidden") {
        const column = await getTdInputTpl(sField, true);
        tpl.columns.push(column);
      }
    }
  }else if(field.type === 'html'){
    tpl.type = 'tpl';
  }
  else{
    tpl.type = 'static';
  }
  return tpl;
};

/**
 * TODO 先将申请单上的字段转化为 steedos field 类型, 只读、编辑 使用 steedos field tpl
 * @param {*} field 
 * @param {*} label 
 * @returns 
 */
const getTdInputTpl = async (field, label) => {
  const edit = field.permission === "editable";
  if(edit){
    return await getFieldEditTpl(field, label)
  }else{
    return await getFieldReadonlyTpl(field, label)
  }
};

const getTdField = async (field, fieldsCount) => {
  return {
    background: field.permission !== "editable" ? "#FFFFFF" : "rgba(255,255,0,.1)",
    colspan: field.type === "table" ? 4 : 3 - (fieldsCount - 1) * 2,
    align: "left",
    className: "td-field",
    width: "32%",
    body: [await getTdInputTpl(field)],
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
  return {
    className: `td-title td-title-${field.type}`,
    align: field.type != "section" ? "center" : "left",
    width: field.type != "section" ? "16%" : "",
    colspan: field.type == "section" ? 4 : "",
    background: field.type == "section" ? "#f1f1f1" : "#FFFFFF",
    body: [
      {
        type: "tpl",
        tpl: `<div class='${field.type == "section" ? "font-bold" : ""}'>${field.name || field.code} ${field.is_required ? '<span class="antd-Form-star">*</span>' : ''}</div>`,
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

const getTds = async (tdFields) => {
  const tds = [];
  for (const field of tdFields) {
    if (field.type != "table") {
      tds.push(getTdTitle(field));
    }
    if (field.type != "section") {
      tds.push(await getTdField(field, tdFields.length));
    }
  }
  return tds;
};

const getFormTrs = async (instance) => {
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
    if (field.is_wide) {
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
      tds: await getTds(tdFields),
    });
  }
  return trsSchema;
};

const getFormTableView = async (instance) => {
  const formSchema = {
    type: "table-view",
    className: "instance-form-view",
    trs: await getFormTrs(instance),
    id: "u:047f3669468b",
  };
  console.log('getFormTableView===>', instance, formSchema);
  return formSchema;
};

const getApplicantTableView = async (instance) => {
  let applicantInput = null;
  if(instance.state === 'draft'){
    applicantInput = Object.assign({name: "applicant", value: getSteedosAuth().userId, disabled: instance.box !== 'draft'}, await lookupToAmis(
      {
        name: "applicant",
        label: false,
        reference_to: "space_users",
        reference_to_field: 'user',
        multiple: false
      },
      false,
      {}
    ));
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
                tpl: "<div class='inline-left'>提交人:</div>",
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
                tpl: "<div class='inline-left'>提交日期:</div>",
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

const getApproveButton = async (instance)=>{
  if(!instance.approve || ( instance.box != 'inbox' && instance.box != 'draft')){
    return null;
  }
  return {
    type: "button",
    label: "签批",
    onEvent: {
      click: {
        actions: [
          {
            componentId: "",
            args: {},
            actionType: "drawer",
            drawer: await getApprovalDrawerSchema(instance),
          },
        ],
      },
    },
    id: "steedos-approve-button",
    level: "primary",
    className:
      "approve-button w-14 h-14 rounded-full fixed bottom-4 right-4 shadow-lg text-white text-base text-center font-semibold bg-blue-500 p-0",
  }
}

export const getFlowFormSchema = async (instance, box) => {
  return {
    type: "page",
    name: "instancePage",
    className: "steedos-amis-instance-view",
    bodyClassName: "overflow-y-auto h-full",
    headerClassName: "p-0",
    "title": {
      "type": "steedos-record-detail-header",
      "label": "标题面板",
      "objectApiName": "instances",
      "recordId": instance._id,
      "id": "u:e6b2adbe0e21",
      "showRecordTitle": false,
      "className": "p-0 m-0 p0 m0 bg-gray-50"
    },
    "css": {
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
      ".steedos-object-record-detail-header .antd-Grid-col--mdAuto": {
        "padding": "0px !important"
      },
      ".steedos-amis-instance-view .antd-Page-body": {
        "width": "1024px"
      },
      ".antd-List-placeholder": {
        "display": "none"
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
    body: [
      await getAttachments(instance),
      await getRelatedInstances(instance),
      await getRelatedRecords(instance),
      {
        type: "form",
        debug: false,
        wrapWithPanel: false,
        resetAfterSubmit: true,
        body: [
          {
            type: "tpl",
            id: "u:f5bb0ad602a6",
            tpl: `<div class="instance-name">${instance.title}</div>`,
            inline: true,
            wrapperComponent: "",
            style: {
              fontFamily: "",
              fontSize: 12,
              textAlign: "center",
            },
          },
          await getFormTableView(instance),
          await getApplicantTableView(instance),
          
        ],
        id: "instance_form",
        onEvent: {
          validateError: {
            weight: 0,
            actions: [
              {
                "componentId": "",
                "args": {
                  "msgType": "info",
                  "position": "top-right",
                  "closeButton": true,
                  "showIcon": true,
                  "title": "提交失败",
                  "msg": "请填写必填字段"
                },
                "actionType": "toast"
              }
            ],
          }
        }
      },
      await getInstanceApprovalHistory(),
      await getApproveButton(instance)
    ],
    id: "u:63849ea39e12",
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
            actionType: "reload"
          }
        ]
      }
      // inited: {
      //   weight: 0,
      //   actions: [
      //     // {
      //     //   componentId: "steedos-approve-button",
      //     //   actionType: "click",
      //     // },
      //     // {
      //     //   "componentId": "",
      //     //   "args": {},
      //     //   "actionType": "drawer",
      //     //   "drawer": await getApprovalDrawerSchema()
      //     // }
      //   ],
      // }
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
        payload.data = {
          related_instances: payload.data.instance.related_instances
        };
        return payload;
      `,
      "data": {
        // "&": "$$",
        // "context": "${context}",
        "judge": "${new_judge}",
      }
    },
    initFetch: true
  };
};
