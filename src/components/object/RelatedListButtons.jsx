/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 17:17:01
 * @Description: 
 */
import { getListViewButtons, execute } from '@/lib/buttons';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'
import { AmisRender } from "@/components/AmisRender";
import { getSteedosAuth } from '@/lib/steedos.client';
export function RelatedListButtons(props) {
    const { app_id, tab_id, schema, refId, foreign_key, record_id, object_name , masterObjectName} = props;
    const [buttons, setButtons] = useState(null);
    const router = useRouter()
    useEffect(() => {
        if(schema && schema.uiSchema){
            setButtons(getListViewButtons(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router,
              }))
        }
      }, [schema]);
      const newRecord = ()=>{
        if(schema.uiSchema.name === 'cms_files'){
            
        }else{
            const type = 'drawer';
            SteedosUI.Object.newRecord({ data: {data: { [foreign_key]: record_id }},  refId: refId, appId: app_id, name: SteedosUI.getRefId({type: `${type}-form`, appId: app_id, name: `${schema.uiSchema.name}`}), title: `新建 ${schema.uiSchema.label}`, objectName: schema.uiSchema.name, recordId: 'new', type, options: {}, router})
        }
      }
      const auth = getSteedosAuth();
      const uploadBtnSchema = {
        type: "page",
        bodyClassName: 'p-0',
        body: [
            {
                "type": "form",
                "title": "表单",
                "body": [
                  {
                    "type": "input-file",
                    "label": "",
                    "name": "file",
                    "id": "u:a58d02614e04",
                    "btnLabel": "上传",
                    "multiple": false,
                    "submitType": "asUpload",
                    "uploadType": "fileReceptor",
                    "proxy": false,
                    "drag": true,
                    "autoUpload": true,
                    "useChunk": false,
                    "receiver": {
                      "url": "${context.rootUrl}/s3",
                      headers: {
                        Authorization: "Bearer ${context.tenantId},${context.authToken}"
                    },
                      "method": "post",
                      "messages": {},
                      "dataType": "form-data",
                      "requestAdaptor": `
                        api.data.append('record_id', '${record_id}');
                        api.data.append('object_name', '${masterObjectName}');
                        api.data.append('space', '${auth.space}');
                        api.data.append('owner', '${auth.userId}');
                        api.data.append('owner_name', '${auth.name}');
                        return api;
                      `
                    },
                    "onEvent": {
                      "success": {
                        "weight": 0,
                        "actions": [
                          {
                            "componentId": "u:5f901c0b917b",
                            "args": {},
                            "actionType": "clear"
                          },
                          {
                            "componentId": "",
                            "args": {
                              "msgType": "success",
                              "position": "top-right",
                              "closeButton": true,
                              "showIcon": true,
                              "msg": "上传成功"
                            },
                            "actionType": "toast"
                          },
                          {
                            "componentId": "",
                            "args": {},
                            "actionType": "custom",
                            "script": `
                                SteedosUI.getRef('${refId}').getComponentById('listview_${object_name}').search();
                            `
                          }
                        ]
                      }
                    }
                  }
                ],
                "id": "u:5f901c0b917b",
                "wrapWithPanel": false
              }
        ],
        regions: [
          "body"
        ],
        data: {
            
        }
      };
    return (
        <>
            {schema?.uiSchema && 
                <>
                    {schema?.uiSchema?.permissions?.allowCreate && 
                        <>
                            { schema.uiSchema.name != 'cms_files' && <button onClick={newRecord} className="antd-Button py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold sm:rounded-[2px] focus:outline-none">新建</button> }
                            { schema.uiSchema.name === 'cms_files' && 
                            <AmisRender
                            id={SteedosUI.getRefId({type: 'button', appId: app_id, name: 'upload'})}
                            schema={uploadBtnSchema}
                            router={router}
                            className='w-full'
                          ></AmisRender>
                            }
                        </>
                    }
                    {buttons?.map((button)=>{
                        return (
                        <Button key={button.name} button={button} data={{
                            app_id: app_id,
                            tab_id: tab_id,
                            object_name: schema.uiSchema.name,
                            dataComponentId: SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema.uiSchema.name})
                        }}></Button>
                        )
                    })}
                </>
            }
            
        </>
    )
}