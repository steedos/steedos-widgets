/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-07 16:20:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-14 16:31:47
 * @Description:
 */
import { lookupToAmisPicker } from '../converter/amis/fields/lookup'

import { each, startsWith } from 'lodash';

const getSelectOptions = (field)=>{
  const options = [];
  each(field.options.split("\n"), (item)=>{
    var foo = item.split(':');
    if(foo.length == 2){
      options.push({label: foo[0], value: foo[1]})
    }else{
      options.push({label: item, value: item})
    }
  })
  return options;
}

const getTdInputTpl = (field, label) => {
  const tpl = {
    label: label === true ? field.name : false,
    name: field.code,
    mode: "horizontal",
    className: "m-none p-none",
    disabled: field.permission === "readonly",
  };
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
      break;
    case "dateTime":
      tpl.type = "input-datetime";
      break;
    case "checkbox":
      tpl.type = "checkbox";
      break;
    case "email":
      tpl.type = "input-email";
      tpl.validations = {
        isEmail: true
      }
      break;
    case "url":
      tpl.type = "input-url";
      tpl.validations = {
        isUrl: true
      }
      break;
    case "password":
      tpl.type = "input-password";
      tpl.showCounter = true;
      break;
    case "select":
      tpl.type = "select";
      tpl.options = getSelectOptions(field)
      break;
    case "user":
      tpl.type = "input-text"; //TODO
      break;
    case "group":
      tpl.type = "input-text"; //TODO
      break;
    case "radio":
      tpl.type = "radios";
      tpl.options = getSelectOptions(field)
      break;
    case "multiSelect":
      tpl.type = "checkboxes";
      tpl.options = getSelectOptions(field)
      break;
    case "odata":
      var labelField = field.formula.substr(1, field.formula.length - 2);
      tpl.type = "select";
      tpl.multiple = field.is_multiselect
      tpl.labelField = labelField;
      tpl.valueField = "$$"
      tpl.source = {
        "url": startsWith(field.url, 'http') ? field.url : `\${context.rootUrl}${field.url}`,
        "method": "get",
        "dataType": "json",
        headers: {
          Authorization: "Bearer ${context.tenantId},${context.authToken}"
        }
      }
      break;
    case "html":
      tpl.type = "html";
      break;
    case "table":
      tpl.type = "input-table"; //TODO
      tpl.addable = field.permission != "readonly";
      tpl.editable = tpl.addable;
      tpl.copyable = tpl.addable;
      tpl.columns = [];
      each(field.sfields, (sField)=>{
        if(sField.type != 'hidden'){
          tpl.columns.push(getTdInputTpl(sField, true))
        }
      })
      break;
    case "section":
      tpl.type = "input-text";
      break;
    default:
      break;
  }

  return tpl;
};

const getTdField = (field, fieldsCount) => {
  return {
    background: field.permission === "readonly" ? "" : "rgba(255,255,0,.1)",
    colspan: field.type === 'table' ? 4 : 3 - (fieldsCount - 1) * 2,
    align: "left",
    className: "td-field",
    body: [
      getTdInputTpl(field)
    ],
    style: {
      marginTop: "0",
      paddingTop: "0",
      paddingRight: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",
    },
    // "id": "u:9b001b7ff92d"
  };
};

const getTdTitle = (field) => {
  return {
    className: "td-title",
    align: field.type != 'section' ? "center" : "left",
    width: field.type != 'section' ? "16%" : "",
    colspan: field.type == 'section' ? 4 : "",
    body: [
      {
        type: "tpl",
        tpl: `<div style='font-size:20px'>${field.name}</div>`,
      },
    ],
    // "id": "u:9b001b7ff92d"
  };
};

const getTds = (tdFields) => {
  const tds = [];
  each(tdFields, (field) => {
    if(field.type != 'table'){
      tds.push(getTdTitle(field));
    }
    if(field.type != 'section'){
      tds.push(getTdField(field, tdFields.length));
    }
  });
  return tds;
};

const getFormTrs = (form) => {
  const trsSchema = [];
  const trs = [];
  let tdFields = [];
  each(form.fields, (field, index) => {
    if (field.is_wide) {
      if (tdFields.length != 0) {
        trs.push(tdFields);
      }
      if(field.type == 'table'){
        trs.push([Object.assign({}, field, {type: 'section'})])
      }
      tdFields = [];
      tdFields.push(field);
      trs.push(tdFields);
      tdFields = [];
    } else {
      tdFields.push(field);
      if (tdFields.length == 2 || index === form.fields.length - 1) {
        trs.push(tdFields);
        tdFields = [];
      }
    }
  });

  each(trs, (tdFields) => {
    trsSchema.push({
      background: "#F7F7F7",
      tds: getTds(tdFields),
    });
  });

  return trsSchema;
};

const getFormTableView = (form) => {
  return {
    type: "table-view",
    trs: getFormTrs(form),
    id: "u:047f3669468b",
  };
};

export const getFlowFormSchema = (form) => {
  return {
    type: "page",
    body: [
      {
        type: "service",
        data: {
          beijing: "20",
          tianjing: "19",
        },
        body: [
          {
            type: "tpl",
            id: "u:f5bb0ad602a6",
            tpl: `<div style='font-size:20px'>${form.title}</div>`,
            inline: true,
            wrapperComponent: "",
            style: {
              fontFamily: "",
              fontSize: 12,
              textAlign: "center",
            },
          },
          getFormTableView(form),
        ],
        id: "u:a381684e042b",
      },
    ],
    id: "u:63849ea39e12",
    messages: {},
    pullRefresh: {},
    regions: ["body"],
  };
};
