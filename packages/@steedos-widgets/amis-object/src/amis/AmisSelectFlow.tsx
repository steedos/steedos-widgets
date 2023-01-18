/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-14 16:41:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-18 13:24:42
 * @Description: 
 */

import { random } from 'lodash';

const getSelectFlowSchema = (id, props)=>{
    const { label: label, data, name, required, action = 'query', mode = 'input-tree', className, onEvent, multiple = false, delimiter, joinValues, extractValue, searchable, showIcon = true, showRadio=false, showOutline, initiallyOpen, unfoldedLevel, treeContainerClassName} = props;
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
        "source": {
            "method": "post",
            "url": "${context.rootUrl}/graphql?keywords=${keywords}",
            "requestAdaptor": `
                const keywords = api.body.keywords || '';
                const appId = '${data.app_id || ''}';
                api.data = {
                    query: \`
                        {
                        options: flows__getList(action: "${action}", keywords: "\${keywords}", appId: "\${appId}"){
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
    }
}

/**
 * 
 * @css
 * max-h-[80vh]
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
        "body": [
            {
                "type": "search-box",
                "className": "w-full mb-2",
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