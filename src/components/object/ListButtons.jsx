/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-04 10:10:33
 * @Description: 
 */
import { getListViewButtons, execute } from '@/lib/buttons';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'
import _ from 'lodash';

export function ListButtons(props) {
    const { app_id, tab_id, schema } = props;
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
        const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
        // router.push('/app/'+app_id+'/'+schema.uiSchema.name+'/view/new')
        const type = 'modal';
        SteedosUI.Object.newRecord({ refId: listViewId, appId: app_id, name: SteedosUI.getRefId({type: `${type}-form`,}), title: `新建 ${schema.uiSchema.label}`, objectName: schema.uiSchema.name, recordId: 'new', type, options: {}, router })
      }

      const batchDelete = ()=>{
          const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
          const listViewRef = SteedosUI.getRef(listViewId).getComponentById(`listview_${schema.uiSchema.name}`)
        if(_.isEmpty(listViewRef.props.store.toJSON().selectedItems)){
            listViewRef.handleAction({}, {
                "actionType": "toast",
                "toast": {
                    "items": [
                      {
                        "position": "top-right",
                        "body": "请选择要删除的项"
                      }
                    ]
                  }
              })
        }else{
            console.log(`handleBulkAction`, listViewRef.props.bulkActions[0])
            listViewRef.handleBulkAction(listViewRef.props.store.toJSON().selectedItems,[],{},listViewRef.props.bulkActions[0]);
        }
      }

    return (
        <>
            {schema?.uiSchema && 
                <>
                    {schema?.uiSchema?.permissions?.allowCreate && 
                        <button onClick={newRecord} className="slds-button slds-button_brand">新建</button>
                    }
                    {buttons?.map((button)=>{
                        return (
                        <Button key={button.name} button={button} data={{
                            app_id: app_id,
                            tab_id: tab_id,
                            object_name: schema.uiSchema.name,
                            dataComponentId: SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema.uiSchema.name})
                        }} scopeClassName="inline-block"></Button>
                        )
                    })}
                    {schema?.uiSchema?.permissions?.allowDelete && 
                        <button onClick={batchDelete} className="slds-button slds-button_text-destructive">删除</button>
                    }
                </>
            }
            
        </>
    )
}