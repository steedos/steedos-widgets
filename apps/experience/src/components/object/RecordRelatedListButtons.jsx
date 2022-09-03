/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 15:31:36
 * @Description: 
 */
import { getListViewButtons, execute } from '@steedos-labs/amis-lib';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'
import { AmisRender } from "@/components/AmisRender";
import { getSteedosAuth } from '@steedos-labs/amis-lib';

export function RecordRelatedListButtons(props) {
    const { app_id, tab_id, schema, refId, foreign_key, record_id, object_name , masterObjectName, inMore, formFactor} = props;
    const [buttons, setButtons] = useState(null);
    const router = useRouter()
    useEffect(() => {
        if(schema && schema.uiSchema){
            setButtons(getListViewButtons(schema.uiSchema, {
              listViewId: refId,
              formFactor: formFactor,
              app_id: app_id,
              tab_id: tab_id,
              router: router,
              data: {data: { [foreign_key]: record_id }}, 
              }))
        }
      }, [schema]);
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
                    "btnClassName": "m-0", 
                    "multiple": false, // 待amis 2.1.x 处理了 多选 + 自动上传的bug 后, 可开启此功能.
                    "maxLength": 10,
                    "submitType": "asUpload",
                    "uploadType": "fileReceptor",
                    "proxy": false,
                    "drag": false,
                    "autoUpload": true,
                    "useChunk": false,
                    "joinValues": false,
                    "extractValue": false,
                    "valueField": "version_id",
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
                        api.data.append('space', '${auth.spaceId}');
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
                                SteedosUI.getRef('${refId}').getComponentByName('page.listview_${object_name}').handleAction({}, { actionType: "reload"})
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
                            { schema.uiSchema.name === 'cms_files' && 
                            <AmisRender
                            id={SteedosUI.getRefId({type: 'button', appId: app_id, name: 'upload'})}
                            schema={uploadBtnSchema}
                            router={router}
                            className='inline-block'
                          ></AmisRender>
                            }
                        </>
                    }
                    {buttons?.map((button)=>{
                        return (
                          <Button key={button.name}  button={button} inMore={inMore} data={{
                            app_id: app_id,
                            tab_id: tab_id,
                            object_name: schema.uiSchema.name,
                            dataComponentId: SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema.uiSchema.name})
                        }}
                        className = {inMore ? "flex items-center border-0 px-2 py-1" : ''}
                        scopeClassName="inline-block"
                        ></Button>
                        )
                    })}
                </>
            }
            
        </>
    )
}