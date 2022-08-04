/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-04 15:18:39
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { RelatedList } from "@/components/object/RelatedList";

export const Relateds = ({app_id, record_id, relateds})=>{
    
    return (<>
        {relateds?.map((related) => {
            return (
                <RelatedList
                key={`${related.object_name}-${related.foreign_key}`}
                {...related}
                app_id={app_id}
                record_id={record_id}
                ></RelatedList>
            );
        })}
    </>)
}