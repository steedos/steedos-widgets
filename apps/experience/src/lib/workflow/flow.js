/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-07 16:20:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-23 17:47:54
 * @Description:
 */
import {
  lookupToAmisPicker,
  fetchAPI,
  getSteedosAuth,
} from "@steedos-widgets/amis-lib";

import { each, startsWith } from "lodash";

import { getApprovalDrawerSchema } from "./approve";

import { getAttachments } from './attachment';

import { getRelatedRecords, getRelatedInstances } from './related';



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

const getTdInputTpl = async (field, label) => {
  const tpl = {
    label: label === true ? field.name : false,
    name: field.code,
    mode: "horizontal",
    className: "m-none p-none form-control",
    disabled: field.permission !== "editable",
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
      const useTpl = await lookupToAmisPicker(
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
      const orgTpl = await lookupToAmisPicker(
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
      tpl.columns = [];
      for (const sField of field.fields) {
        if (sField.type != "hidden") {
          const column = await getTdInputTpl(sField, true);
          tpl.columns.push(column);
        }
      }
      break;
    case "section":
      tpl.type = "input-text";
      break;
    default:
      break;
  }

  return tpl;
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
    className: "td-title",
    align: field.type != "section" ? "center" : "left",
    width: field.type != "section" ? "16%" : "",
    colspan: field.type == "section" ? 4 : "",
    background: "#FFFFFF",
    body: [
      {
        type: "tpl",
        tpl: `<div>${field.name || field.code}</div>`,
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
  console.log(`fields`, fields)
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
      if (tdFields.length == 2 || index === instance.fields.length - 1) {
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
  return {
    type: "table-view",
    className: "instance-form-view",
    trs: await getFormTrs(instance),
    id: "u:047f3669468b",
  };
};

const getApplicantTableView = async (instance) => {
  let applicantInput = null;
  if(instance.state === 'draft'){
    applicantInput = Object.assign({name: "applicant", value: getSteedosAuth().userId, disabled: instance.box !== 'draft'}, await lookupToAmisPicker(
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
            width: "16%",
            colspan: "",
            body: [
              {
                type: "tpl",
                tpl: "<div>提交人</div>",
                id: "u:ee62634201bf",
              },
            ],
            id: "u:6c24c1bb99c9",
            style: {
              padding: "none",
            },
          },
          {
            background: "#FFFFFF",
            colspan: 1,
            align: "left",
            className: "td-field",
            width: "32%",
            body: [
              applicantInput
            ],
            id: "u:45d65d91905c",
          },
          {
            className: "td-title",
            background: "#FFFFFF",
            align: "left",
            width: "16%",
            colspan: "",
            body: [
              {
                type: "tpl",
                tpl: "<div>提交日期</div>",
                id: "u:6d0a7763d527",
              },
            ],
            id: "u:c8b8214ac931",
            style: {
              padding: "none",
            },
          },
          {
            background: "#FFFFFF",
            colspan: 1,
            align: "left",
            className: "td-field",
            width: "32%",
            body: [
              {
                label: false,
                mode: "horizontal",
                className: "m-none p-none",
                disabled: true,
                type: "tpl",
                inputFormat: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DDT00:00:00.000[Z]",
                tpl: '<div>${submit_date}</div>',
                id: "u:2016b04355f4",
              },
            ],
            id: "u:81b07d82a5e4",
          },
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
    id: "u:cc1afbdc3868",
    level: "primary",
    className:
      "approve-button w-14 h-14 rounded-full fixed bottom-4 right-4 shadow-lg text-white text-base text-center font-semibold bg-blue-500 p-0",
  }
}

export const getFlowFormSchema = async (instance) => {
  return {
    type: "page",
    name: "instancePage",
    body: [
      await getAttachments(instance),
      await getRelatedInstances(instance),
      await getRelatedRecords(instance),
      {
        type: "form",
        debug: false,
        wrapWithPanel: false,
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
          await getApproveButton(instance)
        ],
        id: "instance_form",
      },
    ],
    id: "u:63849ea39e12",
    messages: {},
    pullRefresh: {},
    regions: ["body"],
    onEvent: {
      inited: {
        weight: 0,
        actions: [
          {
            componentId: "u:cc1afbdc3868",
            actionType: "click",
          },
          // {
          //   "componentId": "",
          //   "args": {},
          //   "actionType": "drawer",
          //   "drawer": await getApprovalDrawerSchema()
          // }
        ],
      },
    },
    initApi:{
      "url": "${context.rootUrl}/graphql?a=1",
      "method": "post",
      "messages": {
      },
      "requestAdaptor": `
        const { context } = api.data;
        api.data = {
          query: \`
            {
              instance: instances__findOne(id:"\${context._id}"){
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
        console.log("payload", payload)
        return payload;
      `,
      "data": {
        // "&": "$$",
        "context": "${context}",
        "judge": "${new_judge}",
      }
    },
    initFetch: true,
  };
};
