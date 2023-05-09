/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-14 16:41:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-21 11:50:26
 * @Description: 
 */

import './AmisSelectFlow.less';
import { random } from 'lodash';

const getSelectFlowSchema = (id, props)=>{
    const { label: label, data, name, required, action = 'query', distributeInstanceId="",  distributeStepId="", mode = 'input-tree', className, onEvent, multiple = false, delimiter, joinValues, extractValue, searchable, showIcon = true, showRadio=false, showOutline, initiallyOpen, unfoldedLevel, treeContainerClassName, amis = {}} = props;
    console.log(`=====onEvent`, onEvent)


    return {
        "type": mode,
        "id": id,
        "label": label,
        "name": name,
        "options": [],
        "multiple": multiple,
        "delimiter": delimiter,
        "joinValues": joinValues,
        "extractValue": extractValue,
        "searchable": searchable,
        "showOutline": showOutline,
        "initiallyOpen": initiallyOpen,
        "unfoldedLevel": unfoldedLevel,
        "className": className,
        "required": required,
        "treeContainerClassName": treeContainerClassName,
        // "menuTpl": {
        //     // type: "button",
        //     type: "tpl",
        //     tpl: "<div class='flex justify-between'><span>${label}</span><span class='rounded p-1 text-xs text-center w-14 ${children != null ? \'hidden\' : \'\'}'><button><i class='fa-regular fa-star'></i></button></span></div>",
        //     "onEvent": {
        //         "click": {
        //           "weight": 0,
        //           "actions": [
        //             {
        //                 actionType: 'custom',
        //                 script: "console.log('====event', event), event.preventDefault(); event.stopPropagation()"
        //             },
        //             {
        //               "args": {
        //                 "api": {
        //                   "url": "/aaa",
        //                   "method": "get",
        //                   "messages": {
        //                   }
        //                 }
        //               },
        //               "actionType": "download",
        //               "stopPropagation": true
        //             }
        //           ]
        //         }
        //       }
        // },
        "source": {
            "method": "post",
            "url": "${context.rootUrl}/graphql?keywords=${keywords}",
            "requestAdaptor": `
                const keywords = api.body.keywords || '';
                const appId = '${data.app_id || ''}';
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
            "headers": {
                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
            }
        },
        "showIcon": showIcon,
        "showRadio": showRadio,
        "onlyLeaf": true,
        "onEvent": onEvent,
        ...amis
    }
}

/**
 * 
 * @css
 * max-h-[80vh]
 * !max-h-[80vh]
 * !mb-6
 */
export const AmisSelectFlow = (props)=>{
    //mode: "input-tree" | "tree-select"
    const { mode = 'input-tree', id = 'selectFlow' + random(10000, 99999) } = props;
    console.log(`AmisSelectFlow props`, props)
    const inputId = `${id}_input`;
    const flowSchema = getSelectFlowSchema(inputId, props);
    if(mode === 'tree-select'){
        return flowSchema;
    }
    return {
        "type": "service",
        "id": "selectFlowService",
        "className":"steedos-select-flow-service",
        "body": [
            {
                "type": "search-box",
                "className": "!w-full mb-2",
                "name": "keywords",
                "enhance": true,
                "onEvent": {
                    "search": {
                        "actions": [
                            {
                                "actionType": "setValue",
                                "componentId": "selectFlowService",
                                "args": {
                                  "value": {
                                    "keywords": "${event.data.keywords}",
                                  }
                                }
                            },
                            {
                                "componentId": inputId,
                                "actionType": "reload"
                              }
                        ]
                    }
                }
            },
            flowSchema
        ]
      }
}