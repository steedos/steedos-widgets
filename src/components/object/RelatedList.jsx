import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'
import { ListButtons } from '@/components/object/ListButtons'

export function RelatedList(props) {
    const { schema, object_name, foreign_key, app_id} = props;
    const router = useRouter()
    return (
        <>
        <div className="flex justify-between mb-1">
            <div className='inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl'></div>
            <div className="flex flex-nowrap space-x-2 fill-slate-400">
                <ListButtons app_id={app_id} tab_id={object_name} schema={schema}></ListButtons>
            </div>
        </div>
        {schema && <AmisRender
            id={`amis-root-related-${object_name}-${foreign_key}`}
            schema={schema.amisSchema}
            router={router}
            ></AmisRender>}
        </>
    )
}