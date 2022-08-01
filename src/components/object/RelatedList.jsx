import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router'

export function RelatedList(props) {
    const { schema, object_name, foreign_key } = props;
    const router = useRouter()
    return (
        <>
        {schema && <AmisRender
            id={`amis-root-related-${object_name}-${foreign_key}`}
            schema={schema.amisSchema}
            router={router}
            ></AmisRender>}
        </>
    )
}