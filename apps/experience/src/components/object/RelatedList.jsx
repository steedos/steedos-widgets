/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-31 15:04:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-26 17:17:31
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'
import { RelatedHeader } from '@/components/object/RelatedHeader'

export function RelatedList(props) {
    const { schema, object_name, foreign_key, app_id, record_id, masterObjectName, formFactor} = props;
    const router = useRouter();
    const id = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
    return (
        <article className="slds-card slds-card_boundary  bg-white shadow-none border-none border-slate-200">
            {schema && <RelatedHeader refId={id} {...props}></RelatedHeader>}
            <div className="border-t">
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
                className={"steedos-listview"}
                ></AmisRender>}
            </div>
        </article>
    )
}