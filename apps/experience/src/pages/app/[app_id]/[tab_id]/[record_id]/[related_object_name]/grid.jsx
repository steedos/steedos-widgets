/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-06 10:57:15
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { getObjectRelated } from '@steedos-widgets/amis-lib';
import { RelatedList } from "@/components/object/RelatedList";
import { useRouter } from 'next/router'

export default function RelatedGrid({formFactor}){
    const router = useRouter();
    
    const { app_id, tab_id, record_id, related_object_name, related_field_name } = router.query

    const [related, setRelated] = useState();
   
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

    return (
      <div className="">
        {related &&
         <RelatedList
         key={`${related.object_name}-${related.foreign_key}`}
         {...related}
         app_id={app_id}
         record_id={record_id}
         formFactor={formFactor}
         ></RelatedList>
        }
    </div>
    )
}