/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-14 16:41:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-11 16:48:35
 * @Description:
 */

import "./AmisSelectFlow.less";
import { random } from "lodash";

const getSelectFlowSchema = (id, props) => {
  const {
    label: label,
    data,
    name,
    required,
    action = "query",
    distributeInstanceId = "",
    distributeStepId = "",
    mode = "input-tree",
    className,
    onEvent,
    multiple = false,
    delimiter,
    joinValues,
    extractValue,
    searchable,
    showIcon = true,
    showRadio = false,
    showOutline,
    initiallyOpen,
    unfoldedLevel,
    treeContainerClassName,
    amis = {},
  } = props;
  // console.log(`=====onEvent`, onEvent)

  return {
    type: mode,
    id: id,
    label: label,
    name: name,
    options: [],
    multiple: multiple,
    delimiter: delimiter,
    joinValues: joinValues,
    extractValue: extractValue,
    searchable: searchable,
    showOutline: showOutline,
    initiallyOpen: initiallyOpen,
    unfoldedLevel: unfoldedLevel,
    // className: `overflow-y-auto ` + className,
    className: className,
    required: required,
    treeContainerClassName: treeContainerClassName,
    heightAuto: true,
    menuTpl: mode === 'input-tree' ? {
      type: "tpl",
      tpl: "<div class='flex'><span>${label}</span><span class='rounded p-1 text-xs text-center w-14 ${value == 'startFlows' ? '' : 'hidden'}'><button class='antd-Button antd-Button--link m-none p-none'>设置</button></span></div>",
      onEvent: {
        click: {
          weight: 0,
          actions: [
            {
              actionType: "dialog",
              dialog: {
                type: "dialog",
                size: "lg",
                title: {
                  type: "tpl",
                  id: "u:0bce3c33b6e5",
                  tpl: '<p>设置星标流程</p>',
                },
                body: [
                  {
                    type: "form",
                    title: "表单",
                    debug: false,
                    body: [
                      {
                        type: "steedos-field",
                        name: "startFlows",
                        field: {
                            name: "startFlows",
                            type: 'lookup',
                            label: "流程名称",
                            required: true,
                            reference_to: 'flows',
                            multiple: true,
                        },
                        // type: "steedos-select-flow",
                        // label: "流程名称",
                        // name: "startFlows",
                        // id: "startFlows",
                        // multiple: true,
                        // mode: "tree-select",
                        // required: true,
                        // options: [],
                        // searchable: true,
                        // amis: {
                        //   autoFill: {
                        //     users: [],
                        //   },
                        // },
                        // onlyLeaf: true
                      }
                    ],
                    id: "u:742f9c0dc8a1",
                    mode: "normal",
                    initApi: {
                      url: "${context.rootUrl}/api/steedos_keyvalues/startFlows",
                      method: "get",
                      dataType: "json",
                      headers: {
                        Authorization:
                          "Bearer ${context.tenantId},${context.authToken}",
                      },
                    },
                    api: {
                      url: "${context.rootUrl}/api/steedos_keyvalues/startFlows",
                      method: "post",
                      dataType: "json",
                      data: {
                        "startFlows": "${startFlows}",
                      },
                      headers: {
                        Authorization:
                          "Bearer ${context.tenantId},${context.authToken}",
                      },
                      messages: {
                        success: "设置成功!",
                        failed: "设置失败",
                      },
                    },
                    onEvent: {
                      submitSucc: {
                        actions: [
                          {
                            componentId: "",
                            args: {},
                            actionType: "closeDialog",
                          },
                        ],
                      }
                    },
                  },
                ],
                id: "u:519ca64b1934",
                actions: [
                  {
                    type: "button",
                    label: "取消",
                    onEvent: {
                      click: {
                        actions: [
                          {
                            componentId: "",
                            args: {},
                            actionType: "closeDialog",
                          },
                        ],
                      },
                    },
                    id: "u:1d0d136fe2f0",
                  },
                  {
                    type: "button",
                    label: "确定",
                    onEvent: {
                      click: {
                        actions: [
                          {
                            args: {},
                            actionType: "validate",
                            componentId: "u:742f9c0dc8a1",
                          },
                          {
                            componentId: "u:742f9c0dc8a1",
                            args: {},
                            actionType: "submit",
                          },
                        ],
                      },
                    },
                    id: "u:f7f767bed23f",
                    level: "primary",
                  },
                ],
              },
              expression: "${event.data.value === 'startFlows' ? true : false}",
            },
          ],
        },
      },
    } : '',
    source: {
      method: "post",
      url: "${context.rootUrl}/graphql?keywords=${keywords}",
      requestAdaptor: `
                const keywords = api.body.keywords || '';
                const appId = '${data.app_id || ""}';
                api.data = {
                    query: \`
                        {
                        options: flows__getList(action: "${action}", keywords: "\${keywords}", appId: "\${appId}", distributeInstanceId: "${distributeInstanceId}", distributeStepId: "${distributeStepId}"){
                          value:_id
                          label:name
                          children: flows{
                            value: _id,
                            label: name
                          }
                        }
                      }
                    \`
                }
            `,
      adaptor: `
                var options = payload.data.options;
                if(options){
                  options.forEach(function(item,index) {
                      if(item.value != 'startFlows' && (!item.children || item.children.length == 0)){
                          payload.data.options.splice(index,1)
                      }
                  })
                }
                // if(payload.data.options.length === 1 && payload.data.options[0].children.length === 1){
                //   payload.data.value = payload.data.options[0].children[0].value
                // }
                return payload;
            `,
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
        },
        "showIcon": showIcon,
        "showRadio": showRadio,
        "onlyLeaf": true,
        "onEvent": onEvent,
        "static": !!props.static,
        "onlyChildren": true,
        ...amis
    }
};

/**
 *
 * @css
 * max-h-[80vh]
 * !max-h-[80vh]
 * !mb-6
 */
export const AmisSelectFlow = (props) => {
  //mode: "input-tree" | "tree-select"
  const { mode = "input-tree", id = "selectFlow" + random(10000, 99999) } =
    props;
  console.log(`AmisSelectFlow props`, props);
  const inputId = `${id}_input`;
  const flowSchema = getSelectFlowSchema(inputId, props);
  if (mode === "tree-select") {
    return flowSchema;
  }
  return {
    type: "service",
    id: "selectFlowService",
    className: "steedos-select-flow-service",
    body: [
      {
        type: "search-box",
        className: "!w-full mb-2",
        name: "keywords",
        enhance: true,
        onEvent: {
          search: {
            actions: [
              {
                actionType: "setValue",
                componentId: "selectFlowService",
                args: {
                  value: {
                    keywords: "${event.data.keywords}",
                  },
                },
              },
              {
                componentId: inputId,
                actionType: "reload",
              },
            ],
          },
        },
      },
      flowSchema,
    ],
  };
};
