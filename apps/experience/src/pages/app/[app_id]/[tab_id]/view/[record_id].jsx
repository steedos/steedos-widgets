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

export default function Record({formFactor}) {
  
  const router = useRouter();
  const { app_id, tab_id, listview_id, record_id, display, side_object = tab_id, side_listview_id = listview_id } = router.query;

  let schema = {
    "type": "steedos-page-record-detail",
    app_id,
    tab_id,
    listview_id,
    recordId: record_id,
    display,
    formFactor,
    side_object,
    side_listview_id
  };


  return (
    <>
      <AmisRender
        id={`listview-${listview_id}`}
        className="h-full"
        schema={schema}
        router={router}
      ></AmisRender>
    </>
  )
  // const [page, setPage] = useState(false);
  // const [listPage, setListPage] = useState(false);

  // if (display)
  //   Router.setTabDisplayAs(tab_id, display)

  // let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : side_object? 'split': Router.getTabDisplayAs(tab_id);

  // useEffect(() => {
  //   const listPage = getPage({type: 'list', appId: app_id, objectName: tab_id, defaultFormFactor});
  //   const p1 = getPage({type: 'record', appId: app_id, objectName: tab_id, defaultFormFactor});
  //   Promise.all([listPage, p1]).then((values) => {
  //     setListPage(values[0]);
  //     setPage(values[1]);
  //   });

  // }, [app_id, tab_id]);

  // const renderId = SteedosUI.getRefId({
  //   type: "detail",
  //   appId: app_id,
  //   name: tab_id,
  // });

  // if(page === false){
  //   return <Loading></Loading>
  // }

  // const schema = page? JSON.parse(page.schema) : {
  //   "type": "wrapper",
  //   "className": "p-0 m-0 sm:m-3 flex-1",
  //   "name": `amis-${app_id}-${tab_id}-detail`,
  //   "body": [
  //     {
  //       "type": "steedos-record-detail",
  //       "recordId": "${recordId}",
  //       "objectApiName": "${objectName}",
  //       appId: app_id,
  //     }
  //   ],
  // }

  // const listViewId = SteedosUI.getRefId({
  //   type: "listview",
  //   appId: app_id,
  //   name: side_object,
  // });

  // const listSchema = listPage? JSON.parse(listPage.schema) : {
  //   "type": "steedos-object-listview",
  //   "objectApiName": side_object,
  //   "columnsTogglable": false,
  //   "showHeader": true,
  //   "showDisplayAs": true,
  //   "formFactor": 'SMALL',
  // }

  // const splitSchema = {
  //   type: 'service',
  //   "className": 'p-0 flex flex-1 overflow-hidden h-full',
  //   body: (displayAs === 'grid') ? schema : [
  //     {
  //       "type": "wrapper",
  //       "className": `p-0 flex-shrink-0 min-w-32 overflow-y-auto border-r border-gray-200 xl:order-first xl:flex xl:flex-col`,
  //       "body": listSchema
  //     },
  //     {
  //       "type": "wrapper",
  //       "className": 'p-0 flex-1 overflow-y-auto focus:outline-none xl:order-last',
  //       "body": schema
  //     }
  //   ]
  // }
  // return (
  //   <>
  //     <AmisRender
  //       id = {renderId}
  //       data ={{
  //         objectName: side_object,
  //         listViewId: listViewId,
  //         listName: side_listview_id,
  //         appId: app_id,
  //         formFactor: defaultFormFactor,
  //         displayAs,
  //         recordId: record_id,
  //       }}
  //       schema={splitSchema}
  //       updateProps = {{
  //         data: {
  //           recordId: record_id,
  //         }
  //       }}
  //     ></AmisRender>

  //   </>
  // )
}
