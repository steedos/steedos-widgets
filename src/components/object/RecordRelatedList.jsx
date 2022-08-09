/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 15:54:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:14:02
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'
import { RecordRelatedHeader } from '@/components/object/RecordRelatedHeader'

export function RecordRelatedList(props) {
    const { schema, object_name, foreign_key, app_id, record_id, masterObjectName} = props;
    const router = useRouter();
    const id = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
    return (
        <article className="slds-card slds-card_boundary shadow-none border-slate-200">
            <div className="slds-grid slds-page-header rounded-b-none p-2">
                {schema && <RecordRelatedHeader refId={id} {...props}></RecordRelatedHeader>}
            </div>
            <div className="border-t">
                {schema && <AmisRender
                id={id}
                schema={schema.amisSchema}
                router={router}
                className={"steedos-listview"}
                ></AmisRender>}
            </div>
        </article>
    )
}