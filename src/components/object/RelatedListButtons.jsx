/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 15:37:41
 * @Description: 
 */
import { getListViewButtons, execute } from '@/lib/buttons';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'

export function RelatedListButtons(props) {
    const { app_id, tab_id, schema, refId, foreign_key, record_id } = props;
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
        const type = 'drawer';
        SteedosUI.Object.newRecord({ data: {data: { [foreign_key]: record_id }},  refId: refId, appId: app_id, name: SteedosUI.getRefId({type: `${type}-form`, appId: app_id, name: `${schema.uiSchema.name}`}), title: `新建 ${schema.uiSchema.label}`, objectName: schema.uiSchema.name, recordId: 'new', type, options: {}, router})
      }
    return (
        <>
            {schema?.uiSchema && 
                <>
                    {schema?.uiSchema?.permissions?.allowCreate && 
                        <button onClick={newRecord} className="antd-Button py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold sm:rounded-[2px] focus:outline-none">新建</button>
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