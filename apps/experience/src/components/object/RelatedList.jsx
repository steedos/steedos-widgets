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
                className={"steedos-listview"}
                ></AmisRender>}
            </div>
        </article>
    )
}