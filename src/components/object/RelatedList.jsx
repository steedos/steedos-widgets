import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'
import { RelatedListButtons } from '@/components/object/RelatedListButtons'

export function RelatedList(props) {
    const { schema, object_name, foreign_key, app_id, record_id, masterObjectName} = props;
    const router = useRouter();
    const id = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
    return (
        <>
        <div className="flex justify-between mb-1">
            <div className='inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl'></div>
            <div className={`flex flex-nowrap space-x-2 fill-slate-400 ${object_name === 'cms_files' ? 'w-full' : ''}`}>
                <RelatedListButtons foreign_key={foreign_key} record_id={record_id} refId={id} app_id={app_id} tab_id={object_name} object_name={object_name} masterObjectName={masterObjectName} schema={schema}></RelatedListButtons>
            </div>
        </div>
        {schema && <AmisRender
            id={id}
            schema={schema.amisSchema}
            router={router}
            className={"steedos-listview"}
            ></AmisRender>}
        </>
    )
}