/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 15:16:25
 * @Description: 
 */
import { getListViewButtons } from '@steedos-widgets/amis-lib';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'
import _ from 'lodash';

import { standardButtonsTodo } from '@steedos-widgets/amis-lib';

export function ListButtons(props) {
    const { app_id, tab_id, schema, formFactor } = props;
    const [buttons, setButtons] = useState(null);
    const router = useRouter()

    useEffect(() => {
        if(schema && schema.uiSchema){
            const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
            setButtons(getListViewButtons(schema.uiSchema, {
                listViewId: listViewId,
                formFactor: formFactor,
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
                    {buttons?.map((button)=>{
                        return (
                        <Button key={button.name} button={button} uiSchema={schema.uiSchema} formFactor={formFactor} data={{
                            app_id: app_id,
                            tab_id: tab_id,
                            object_name: schema.uiSchema.name,
                            listViewId: SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema.uiSchema.name}),
                            uiSchema: schema.uiSchema,
                        }} scopeClassName="inline-block"></Button>
                        )
                    })}
                    {schema?.uiSchema?.permissions?.allowDelete && 
                        <button onClick={(event)=>{
                            const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
                            standardButtonsTodo.standard_delete_many.call({listViewId, uiSchema: schema.uiSchema}, event, {
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