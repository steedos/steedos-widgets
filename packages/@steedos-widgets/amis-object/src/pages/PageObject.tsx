/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-12 15:00:42
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2025-12-26 17:53:13
 * @Description: 
 */
import './PageObject.less';

import { getUISchema } from '@steedos-widgets/amis-lib'

export const PageObject = async (props) => {
    // console.log(`PageObject=====>`, props);
    const { data, $schema = {} } = props;
    const uiSchema = await getUISchema($schema.data.objectName, false);
    
    delete $schema.data.recordId;
    
    (window as any).Steedos && (window as any).Steedos.setDocumentTitle && (window as any).Steedos.setDocumentTitle({tabName: uiSchema.label || uiSchema.name})
    // 最外层的data是render data, 会被updateProps data覆盖, 所以组件data需要单开一个数据域. 所以此处有2层service
    return {
        type: "service",
        data: $schema.data,
        className: "h-full",
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
                    "type": "wrapper",
                    "size": "none",
                    "className": {
                        "p-0 flex-shrink-0 min-w-[388px] w-fit lg:order-first lg:flex lg:flex-col": "${display == 'split'}",
                        'h-full': "${display != 'split'}",
                        //分栏模式记录详细页面列表视图 crud autofill 在此复杂页面上刷新浏览器时不触发高度计算，所以设置最大高度来显示滚动条
                        "steedos-listview-split-max-height": "${pageType === 'record' && display == 'split'}",
                    },
                    "body": {
                        "name": `${ data.objectName}-listview-${ data.listViewId}`,
                        "type": "steedos-page-listview",
                        "showHeader": true,
                        "objectApiName":  data.objectName,
                        "appId":  data.appId,
                        "display":  data.display,
                        "columnsTogglable": false
                    },
                    "visibleOn": "${pageType === 'list' || (pageType === 'record' && display == 'split')}"
                },
                {
                    "type": "wrapper",
                    "size": "none",
                    "className": {
                        "overflow-y-auto p-0 flex-1 focus:outline-none lg:order-last h-full": "${display == 'split'}",
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
                        "appId": data.appId
                    },
                    "visibleOn": "${pageType === 'record'}"
                }
                ,
                {
                    "type": "tpl",
                    "tpl": "无效的页面类型: ${pageType}",
                    "visibleOn": "${pageType !== 'record' && pageType !== 'list'}"
                }
            ]
        },
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
}