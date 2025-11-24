/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-12 15:00:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-20 18:24:45
 * @Description: 
 */
import './PageObject.less';

import { getUISchema } from '@steedos-widgets/amis-lib'

export const PageObject = async (props) => {
    const { data, $schema = {} } = props;

    let objectName = $schema.data.objectName;

    if(objectName.startsWith('$')){
        objectName = data.objectName;
    }

    const uiSchema = await getUISchema(objectName, false);
    
    delete $schema.data.recordId;
    
    (window as any).Steedos && (window as any).Steedos.setDocumentTitle && (window as any).Steedos.setDocumentTitle({tabName: uiSchema.label || uiSchema.name});

    // 最外层的data是render data, 会被updateProps data覆盖, 所以组件data需要单开一个数据域. 所以此处有2层service
    function getUrlParams(search = window.location.search) {
        const params = {};
        const queryString = search.startsWith('?') ? search.slice(1) : search;
        
        if (!queryString) return params;
        
        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
            const decodedKey = decodeURIComponent(key);
            const decodedValue = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            
            // 处理数组参数（如：?color=red&color=blue）
            if (params.hasOwnProperty(decodedKey)) {
                if (Array.isArray(params[decodedKey])) {
                params[decodedKey].push(decodedValue);
                } else {
                params[decodedKey] = [params[decodedKey], decodedValue];
                }
            } else {
                params[decodedKey] = decodedValue;
            }
            }
        });
        
        return params;
    }

    const urlParams = getUrlParams();

    for (const key in urlParams) {
        $schema.data[key] = urlParams[key];
    }

    const additionalFilters = urlParams['additionalFilters'] || '';

    const schema = {
        type: "service",
        data: $schema.data,
        id: 'u:steedos-page-object',
        className: "h-full steedos-page-object",
        body: {
            type: 'service',
            className: {
                'h-full': "${display != 'split'}",
                'flex flex-1 overflow-hidden h-full': "${display == 'split'}"
            },
            data: {
                uiSchema
            },
            body: [
                {
                    "type": "button",
                    "label": "刷新",
                    "className": "hidden btn-reload-page-object-detail",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "componentId": "u:steedos-page-object-detail",
                                    "actionType": "reload"
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "button",
                    "label": "刷新",
                    "className": "hidden btn-reload-page-object-listview",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "componentId": "u:steedos-page-object-listview",
                                    "actionType": "reload"
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "button",
                    "label": "刷新",
                    "className": "hidden btn-reload-object-listview",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "componentId": "u:steedos-object-listview",
                                    "actionType": "reload"
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "wrapper",
                    "size": "none",
                    "className": {
                        "p-0 flex-shrink-0 min-w-[388px] w-fit lg:order-first lg:flex lg:flex-col overflow-y-auto": "${display == 'split'}",
                        'h-full': "${display != 'split'}",
                    },
                    "body": {
                        "name": `${ data.objectName}-listview-${ data.listName}`,
                        "type": "steedos-page-listview",
                        "showHeader": true,
                        "objectApiName":  data.objectName,
                        "appId":  data.appId,
                        "display":  data.display,
                        "columnsTogglable": false,
                        "_reloadKey": data.objectName + '-' + data.listName + '-' + additionalFilters //window.location.search;
                    },
                    "visibleOn": "${pageType === 'list' || (pageType === 'record' && display == 'split')}"
                },
                {
                    "type": "wrapper",
                    "size": "none",
                    "className": {
                        "overflow-y-auto p-0 flex-1 focus:outline-none lg:order-last h-full page-object-detail-wrapper": "${display == 'split'}",
                        'h-full': "${display != 'split'}",
                    },
                    "body": {
                        "name": `${ data.objectName}-recordDetail-${ data.recordId}`,
                        "type": "steedos-page-record-detail",
                        "objectApiName":  data.objectName,
                        "sideObject":  data.sideObject,
                        "sideListviewId":  data.sideListviewId,
                        // "recordId": recordId,
                        "display":  data.display,
                        "appId": data.appId,
                        "_reloadKey": data._reloadKey
                    },
                    "visibleOn": "${pageType === 'record' && recordId != 'none'}"
                }
                ,
                {
                    "type": "tpl",
                    "tpl": "无效的页面类型: ${pageType}",
                    "visibleOn": "${pageType !== 'record' && pageType !== 'list'}"
                }
            ]
        },
        dataProvider: function(data, setData){
            (window as any).addEventListener('message', function (event) {
                const { data } = event;
                if (data && data.type === 'page.dataProvider.setData') {
                    // console.log('dataProvider====>setData', data);
                    setData(data.data)
                }
            })
        }
        // onEvent: {
        //     "recordLoaded": {
        //       "actions": [
        //         {
        //           "actionType": "setValue",
        //           "args": {
        //             "value": {
        //               "steedos_selected_recordId": "${event.data.record._id}"
        //             }
        //           }
        //         }
        //       ]
        //     }
        // }
    }
    console.log(`PageObject=====>`, props, schema)
    return schema;
}