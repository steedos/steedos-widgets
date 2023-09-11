/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-12 15:00:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-11 13:57:02
 * @Description: 
 */
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
                        "p-0 flex-shrink-0 min-w-[388px] w-fit border-r border-gray-300 bg-gray-100 shadow lg:order-first lg:flex lg:flex-col": "${display == 'split'}",
                        'h-full': "${display != 'split'}",
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
        }
    }
}