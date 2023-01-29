/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-14 18:16:53
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getPage } from "@steedos-widgets/amis-lib";
import { Loading } from '@/components/Loading';

import { AmisRender } from "@/components/AmisRender";

export default function Page ({ formFactor }) {
  const router = useRouter();

  const { app_id, tab_id, listview_id } = router.query;
  const [page, setPage] = useState(false);

  useEffect(() => {
    // 微页面
    getPage({type: 'list', appId: app_id, objectName: tab_id, formFactor}).then((data) => {
      setPage(data);
    });
  }, [app_id, tab_id]);

  if(page === false){
    return <Loading></Loading>
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: tab_id,
  });
  const scopeId = `${listViewId}-page`;
  return (
    <>
      {page && (
        <AmisRender
            data={{
              objectName: tab_id,
              listViewId: listViewId,
              appId: app_id,
              formFactor: formFactor,
              scopeId: scopeId,
            }}
            className="steedos-listview"
            id={scopeId}
            schema={JSON.parse(page.schema)}
            router={router}
          ></AmisRender>
      )}
      {/* {!page && <DefaultListview formFactor={formFactor} router={router} listViewId={listViewId}></DefaultListview>} */}
      {!page && (
          <AmisRender
            data={{
              objectName: tab_id,
              listViewId: listViewId,
              listName: listview_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: listViewId,
            }}
            className="steedos-listview p-0	sm:m-3 flex flex-1 flex-col"
            id={listViewId}
            schema={{
              "type": "steedos-object-listview",
              "objectApiName": tab_id,
              // "listName": "${listName}",
              // "headerToolbar": [],
              "columnsTogglable": false,
              "showHeader": true,
              "className": "sm:border sm:shadow sm:rounded border-slate-300 border-solid"
            }}
            router={router}
          ></AmisRender>
        )}
    </>
  )
}
