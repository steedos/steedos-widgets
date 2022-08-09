/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:17:40
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { getObjectRelated } from '@/lib/objects';
import { RelatedList } from "@/components/object/RelatedList";
import { useRouter } from 'next/router'

export default function RelatedGrid({}){
    const router = useRouter();
    const [formFactor, setFormFactor] = useState(null);
    
    const { app_id, tab_id, record_id, related_object_name, related_field_name } = router.query

    const [related, setRelated] = useState();

    useEffect(()=>{
        if(window.innerWidth < 768){
          setFormFactor('SMALL')
        }else{
          setFormFactor('LARGE')
        }
      }, [])

    useEffect(() => {
        if(!tab_id || !formFactor) return ;
        getObjectRelated(app_id, tab_id, related_object_name, related_field_name, record_id, formFactor).then((data)=>{
            setRelated(data)
        })
      }, [tab_id, formFactor]);

    return (<>
        {related &&
         <RelatedList
         key={`${related.object_name}-${related.foreign_key}`}
         {...related}
         app_id={app_id}
         record_id={record_id}
         ></RelatedList>
        }
       
    </>)
}