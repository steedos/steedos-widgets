/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-25 17:26:03
 * @Description: 
 */
import { getListViewButtons, execute } from '@/lib/buttons';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'
import _ from 'lodash';

import { standardButtonsTodo } from '@/lib/buttons';

export function ListButtons(props) {
    const { app_id, tab_id, schema, formFactor } = props;
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

    return (
        <>
            {schema?.uiSchema && 
                <>
                    {schema?.uiSchema?.permissions?.allowCreate && 
                        <button onClick={(event)=>{
                                const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
                                standardButtonsTodo.standard_new.call({}, event, {
                                    listViewId,
                                    appId: app_id,
                                    uiSchema: schema.uiSchema,
                                    formFactor: formFactor,
                                    router: router
                                })
                        }} className="antd-Button antd-Button--default">新建</button>
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
                        <button onClick={(event)=>{
                            const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
                            standardButtonsTodo.batch_delete.call({}, event, {
                                listViewId,
                                uiSchema: schema.uiSchema,
                            })
                        }} className="antd-Button antd-Button--default">删除</button>
                    }
                </>
            }
            
        </>
    )
}