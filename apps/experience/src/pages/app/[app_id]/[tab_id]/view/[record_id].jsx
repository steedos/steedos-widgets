/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 12:00:35
 * @Description:
 */
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { AmisRender } from "@/components/AmisRender";
import { getPage, getUISchema, Router } from "@steedos-widgets/amis-lib";
import { Loading } from '@/components/Loading';

export default function Record({formFactor: defaultFormFactor}) {
  
  const router = useRouter();
  const [uiSchema, setUiSchema] = useState(null);
  const { app_id, tab_id, listview_id, record_id, display, side_object = tab_id, main_listview_id = listview_id } = router.query;
  const [page, setPage] = useState(false);
  const [listPage, setListPage] = useState(false);

  if (display)
    Router.setTabDisplayAs(tab_id, display)

  let displayAs = (defaultFormFactor === 'SMALL')? 'grid': display? display : side_object? 'split': Router.getTabDisplayAs(tab_id);

  useEffect(() => {
    const listPage = getPage({type: 'list', appId: app_id, objectName: tab_id, defaultFormFactor});
    const p1 = getPage({type: 'record', appId: app_id, objectName: tab_id, defaultFormFactor});
    const p2 = getUISchema(tab_id);
    Promise.all([listPage, p1, p2]).then((values) => {
      setListPage(values[0]);
      setPage(values[1]);
      setUiSchema(values[2]);
    });

  }, [app_id, tab_id]);

  const renderId = SteedosUI.getRefId({
    type: "detail",
    appId: app_id,
    name: tab_id,
  });

  if(page === false || uiSchema === null){
    return <Loading></Loading>
  }

  const schema = page? JSON.parse(page.schema) : {
    "type": "service",
    "className": "m-0 sm:m-3",
    "name": `amis-${app_id}-${tab_id}-detail`,
    "body": [
      {
        "type": "steedos-record-detail",
        "objectApiName": "${objectName}",
        "recordId": "${recordId}",
        appId: app_id,
        "id": "u:48d2c28eb755",
        onEvent: {
            "recordLoaded": {
                "actions": [
                    {
                        "actionType": "reload",
                        "data": {
                          "name": `\${record.${uiSchema.NAME_FIELD_KEY || 'name'}}`
                        }
                    }
                ]
              }
        },
      }
    ],
    "regions": [
      "body"
    ],
    "id": "u:d138f5276481"
  }

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: side_object,
  });
  const listSchema = listPage? JSON.parse(listPage.schema) : {
    "type": "steedos-object-listview",
    "objectApiName": side_object,
    "columnsTogglable": false,
    "showHeader": true,
    "showDisplayAs": true,
    "formFactor": 'SMALL',
    "className": "absolute top-0 bottom-0 w-[388px] shadow border-r border-slate-300 border-solid bg-gray-100"
  }

  return (
    <>
      {displayAs === 'split' && (
        <div className="flex h-full">
            <AmisRender
              data={{
                objectName: side_object,
                listViewId: listViewId,
                listName: main_listview_id,
                appId: app_id,
                formFactor: defaultFormFactor,
                scopeId: listViewId,
              }}
              className="steedos-listview p-0 flex-none w-[388px]"
              id={listViewId}
              schema={listSchema}
              router={router}
            ></AmisRender>
            <AmisRender
              data={{
                objectName: tab_id,
                recordId: record_id,
                appId: app_id,
                formFactor: defaultFormFactor,
                scopeId: renderId+"-page"
              }}
              className="steedos-record-detail flex-1 overflow-scroll"
              id={`${renderId}-page`}
              schema={schema}
              router={router}
          ></AmisRender>
        </div>
      )}

      {displayAs !== 'split' && schema && uiSchema && (
        <AmisRender
          data={{
            objectName: tab_id,
            recordId: record_id,
            appId: app_id,
            formFactor: defaultFormFactor,
            scopeId: renderId+"-page"
          }}
          className="steedos-record-detail"
          id={`${renderId}-page`}
          schema={schema}
          router={router}
        ></AmisRender>
      )}
      
    </>
  )
}
