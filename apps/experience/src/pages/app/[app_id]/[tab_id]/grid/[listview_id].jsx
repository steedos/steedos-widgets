/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-02 12:43:07
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { Loading } from '@/components/Loading';

import { AmisRender } from "@/components/AmisRender";


export default function Page ({ formFactor: defaultFormFactor }) {
  const router = useRouter();

  const { app_id, tab_id, listview_id, display } = router.query;
  const [page, setPage] = useState(false);

  if (display)
    Router.setTabDisplayAs(tab_id, display)

  const displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : Router.getTabDisplayAs(tab_id);

  const formFactor = (["split_three", "split"].indexOf(displayAs) > -1) ? 'SMALL': defaultFormFactor

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
  const splitOffset = displayAs === "split_three" ? "w-1/2" : "w-[388px]";
  const gridClassName = "absolute inset-0 sm:m-3 sm:mb-0 sm:border sm:shadow sm:rounded border-slate-300 border-solid bg-gray-100";
  const splitClassName = `absolute top-0 bottom-0 ${splitOffset} border-r border-slate-300 border-solid bg-gray-100`;
  const schema = page? JSON.parse(page.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": tab_id,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": (defaultFormFactor !== 'SMALL'),
    "formFactor": formFactor
  }
  schema.className = `${schema.className || ""} ${displayAs === 'grid' ? gridClassName : splitClassName}`

  return (
    <>
        <AmisRender
        data={{
          objectName: tab_id,
          listViewId: listViewId,
          listName: listview_id,
          appId: app_id,
          formFactor: formFactor,
          displayAs: displayAs,
          scopeId: listViewId,
        }}
        className={displayAs === 'grid'? "steedos-listview p-0	sm:m-3": "steedos-listview p-0"}
        id={listViewId}
        schema={schema}
        router={router}
        ></AmisRender>
    </>
  )
}
