/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-18 16:38:27
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { RecordRelatedList } from "@/components/object/RecordRelatedList";

export const RecordRelateds = ({app_id, record_id, relateds, formFactor})=>{
    
    return (<>
        {relateds?.map((related) => {
            return (
                <RecordRelatedList
                key={`${related.object_name}-${related.foreign_key}`}
                {...related}
                app_id={app_id}
                record_id={record_id}
                formFactor={formFactor}
                ></RecordRelatedList>
            );
        })}
    </>)
}