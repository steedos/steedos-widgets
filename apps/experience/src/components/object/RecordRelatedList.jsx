/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 15:54:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-27 10:37:05
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'
import { RecordRelatedHeader } from '@/components/object/RecordRelatedHeader'


export function RecordRelatedList(props) {
    const { schema, object_name, foreign_key, app_id, record_id, masterObjectName, formFactor} = props;
    const router = useRouter();
    const id = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})

    const [recordCount, setRecordCount] = useState(0);
    useEffect(() => {
        if (schema) {
        window.addEventListener("message", (event) => {
            const { data } = event;
            if (data.type === "listview.loaded") {
            if (schema) {
                setTimeout(() => {
                    const listViewId = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
                    if (
                        SteedosUI.getRef(listViewId) &&
                        SteedosUI.getRef(listViewId).getComponentByName
                    ) {
                        const listViewRef = SteedosUI.getRef(
                            listViewId
                        ).getComponentByName(`page.listview_${schema.uiSchema.name}`);
                        setRecordCount(listViewRef.props.data.count);
                    }
                }, 300);
            }
            }
        });
        }
    }, [schema]);
    
    return (
        <article className="steedos-record-related-list slds-card slds-card_boundary shadow-none bg-gray-50 border-slate-200">
            <div className="slds-grid slds-page-header rounded-b-none p-2">
                {schema && <RecordRelatedHeader refId={id} recordCount={recordCount} {...props}></RecordRelatedHeader>}
            </div>
            <div className={recordCount > 0? "": "hidden"}>
                {schema && <AmisRender
                id={id}
                schema={schema.amisSchema}
                router={router}
                data={{
                    objectName: schema.uiSchema.name,
                    listViewId: id,
                    appId: app_id, 
                    formFactor: formFactor
                  }} 
                className="steedos-related-listview border-t"
                ></AmisRender>}
            </div>
        </article>
    )
}