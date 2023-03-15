/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-15 13:37:22
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { getObjectRelated, getUISchema } from '@steedos-widgets/amis-lib';
// import { RelatedList } from "@/components/object/RelatedList";
import { useRouter } from 'next/router'
import { AmisRender } from "@/components/AmisRender";

export default function RelatedGrid({formFactor}){
    const router = useRouter();
    const { app_id, tab_id, record_id, related_object_name, related_field_name } = router.query
    const [related, setRelated] = useState();
    const [masterObject, setMasterObject] = useState();

    useEffect(() => {
      if(!tab_id || !formFactor) return ;
      getUISchema(tab_id).then((data)=>{
        setMasterObject(data)
      })
    }, [tab_id]);
   
    useEffect(() => {
        if(!tab_id || !formFactor) return ;
        getObjectRelated({appName: app_id,
          masterObjectName: tab_id,
          objectName: related_object_name,
          relatedFieldName: related_field_name,
          recordId: record_id,
          formFactor}).then((data)=>{
            setRelated(data)
        })
      }, [tab_id, formFactor]);
    const idFieldName = '_id';
    let scopeId = '';
    if(related){
      scopeId = `amis-${app_id}-${tab_id}-related-${related.object_name}-${related.foreign_key}`
    }
    return (
      <div className="">
        {related && masterObject && <AmisRender id={scopeId} 
        data={{
          objectName: tab_id,
          appId: app_id,
          formFactor: formFactor,
          scopeId: scopeId,
        }}
        router={router}
        schema={
          {
            type: 'service',
            name: `amis-${app_id}-${tab_id}-related-${related.object_name}`,
            api: {
                method: "post",
                url: `\${context.rootUrl}/graphql`,
                requestAdaptor: `
                    api.data = {
                        query: \`{
                            data: ${tab_id}(filters:["${idFieldName}", "=", "${record_id}"]){
                                ${idFieldName}
                                ${masterObject.NAME_FIELD_KEY},
                                recordPermissions: _permissions{
                                    allowCreate,
                                    allowCreateFiles,
                                    allowDelete,
                                    allowDeleteFiles,
                                    allowEdit,
                                    allowEditFiles,
                                    allowRead,
                                    allowReadFiles,
                                    disabled_actions,
                                    disabled_list_views,
                                    field_permissions,
                                    modifyAllFiles,
                                    modifyAllRecords,
                                    modifyAssignCompanysRecords,
                                    modifyCompanyRecords,
                                    uneditable_fields,
                                    unreadable_fields,
                                    unrelated_objects,
                                    viewAllFiles,
                                    viewAllRecords,
                                    viewAssignCompanysRecords,
                                    viewCompanyRecords,
                                  }
                            }
                        }\`
                    }
                    return api;
                `,
                adaptor: `
                    if(payload.data.data){
                        var data = payload.data.data[0];
                        payload.data = data;
                    }
                    payload.data.$breadcrumb = [
                        {
                          "label": "${masterObject.label}",
                          "href": "/app/${app_id}/${tab_id}"
                        },
                        {
                            "label": payload.data.${masterObject.NAME_FIELD_KEY},
                            "href": "/app/${app_id}/${tab_id}/view/${record_id}",
                        },
                        {
                            "label": "相关 ${related.schema.uiSchema.label}" 
                        },
                      ]
                    payload.data.$loaded = true;
                    return payload;
                `,
                headers: {
                    Authorization: "Bearer ${context.tenantId},${context.authToken}"
                }
            },
            "data": {
                "&": "$$",
                "$breadcrumb": [], //先给一个空数组, 防止breadcrumb组件报错
              },
            body: [
                {
                    
                  "type": "breadcrumb",
                  "source": "${$breadcrumb}",
                  "className": "mx-4 my-2",
                },
                {
                    type: 'steedos-object-related-listview',
                    objectApiName: tab_id,
                    recordId: record_id,
                    relatedObjectApiName: related_object_name,
                    foreign_key: related_field_name,
                    relatedKey: related_field_name,
                    hiddenOn: "!!!this.$loaded",
                    "className": "mx-4",
                }
            ]
        }
        }></AmisRender>
        }
    </div>
    )
}