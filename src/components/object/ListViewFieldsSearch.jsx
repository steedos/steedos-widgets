/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-01 15:46:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 11:36:35
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { useRouter } from 'next/router';
import { useState } from "react";

export function ListViewFieldsSearch({appId, objectName, dataComponentId}) {
    const [searchableFields, setSearchableFields] = useState(null);
    const [searchableFieldsSchema, setSearchableFieldsSchema] = useState(null);
    const router = useRouter();
    return (<>
        <AmisRender 
            id={SteedosUI.getRefId({type: 'fieldsSearch', appId: appId, name: objectName})}
            schema={searchableFieldsSchema}
            router={router}></AmisRender>
    </>)
}