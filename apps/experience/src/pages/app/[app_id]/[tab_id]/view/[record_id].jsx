/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-07 12:36:43
 * @Description:
 */
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { AmisRender } from "@/components/AmisRender";
import { getPage, Router } from "@steedos-widgets/amis-lib";
import { Loading } from '@/components/Loading';

export default function Record({formFactor: defaultFormFactor}) {
  
  const router = useRouter();
  const { app_id, tab_id, listview_id, record_id, display, side_object = tab_id, side_listview_id = listview_id } = router.query;
  const [page, setPage] = useState(false);
  const [listPage, setListPage] = useState(false);

  if (display)
    Router.setTabDisplayAs(tab_id, display)

  let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : side_object? 'split': Router.getTabDisplayAs(tab_id);

  useEffect(() => {
    const listPage = getPage({type: 'list', appId: app_id, objectName: tab_id, defaultFormFactor});
    const p1 = getPage({type: 'record', appId: app_id, objectName: tab_id, defaultFormFactor});
    Promise.all([listPage, p1]).then((values) => {
      setListPage(values[0]);
      setPage(values[1]);
    });

  }, [app_id, tab_id]);

  const renderId = SteedosUI.getRefId({
    type: "detail",
    appId: app_id,
    name: tab_id,
  });

  if(page === false){
    return <Loading></Loading>
  }

  const schema = page? JSON.parse(page.schema) : {
    "type": "wrapper",
    "className": "p-0 m-0 sm:m-3",
    "name": `amis-${app_id}-${tab_id}-detail`,
    "body": [
      {
        "type": "steedos-record-detail",
        "recordId": "${recordId}",
        "objectApiName": "${objectName}",
        appId: app_id,
      }
    ],
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: side_object,
  });

  const splitOffset = displayAs === "split_three" ? "w-1/2" : "w-[388px]";
  const listSchema = listPage? JSON.parse(listPage.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": side_object,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": true,
    "formFactor": 'SMALL',
  }
  const listClassName = `steedos-listview fixed mt-[50px] sm:mt-[90px] top-0 bottom-0 ${splitOffset} shadow border-r border-slate-300 border-solid bg-gray-100 overflow-scroll`;

  const splitSchema = {
    type: 'service',
    "className": 'p-0',
    body: (displayAs === 'grid') ? schema : [
      {
        "type": "wrapper",
        "className": `p-0 ${listClassName}`,
        "body": listSchema
      },
      {
        "type": "wrapper",
        "className": 'p-0 pl-[388px]',
        "body": schema
      },
      {
        "type": "tpl",
        "tpl": "${objectName}, ${recordId},"
      },
    ]
  }
  return (
    <>
      <AmisRender
        id = {renderId}
        data ={{
          objectName: side_object,
          listViewId: listViewId,
          listName: side_listview_id,
          appId: app_id,
          formFactor: defaultFormFactor,
          displayAs,
          recordId: record_id,
        }}
        schema={splitSchema}
        updateProps = {{
          data: {
            recordId: record_id,
          }
        }}
      ></AmisRender>

    </>
  )
}
