/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 13:32:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-01 14:35:33
 * @Description: 
 */
import { getListViewButtons, execute } from '@/lib/buttons';
import { useRouter } from 'next/router';
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@/components/object/Button'

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
        router.push('/app/'+app_id+'/'+schema.uiSchema.name+'/view/new')
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
                            dataComponentId: `${app_id}-${tab_id}`
                        }}></Button>
                        )
                    })}
                </>
            }
            
        </>
    )
}