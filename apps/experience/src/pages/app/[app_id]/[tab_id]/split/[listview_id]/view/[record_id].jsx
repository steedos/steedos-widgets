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
import { getPage, getUISchema } from "@steedos-widgets/amis-lib";
import { Loading } from '@/components/Loading';

export default function Record({formFactor}) {
  const router = useRouter();
  const [uiSchema, setUiSchema] = useState(null);
  const { app_id, tab_id, listview_id, record_id } = router.query;
  const [page, setPage] = useState(false);

  useEffect(() => {
    const p1 = getPage({type: 'record', appId: app_id, objectName: tab_id, formFactor});
    const p2 = getUISchema(tab_id);
    Promise.all([p1, p2]).then((values) => {
      setPage(values[0]);
      setUiSchema(values[1]);
    });

  }, [app_id, tab_id]);

  const renderId = SteedosUI.getRefId({
    type: "detail",
    appId: app_id,
    name: tab_id,
  });


  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: tab_id,
  });
  const scopeId = `${listViewId}-page`;

  if(page === false){
    return <Loading></Loading>
  }
  return (
    <div className="flex flex-1">
      <div className="flex-none w-[388px] flex flex-col">

          <AmisRender
            data={{
              objectName: tab_id,
              listViewId: listViewId,
              listName: listview_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: listViewId,
            }}
            className="steedos-listview p-0 sm:border-r bg-white border-slate-300 border-solid flex flex-1 flex-col"
            id={listViewId}
            schema={{
              "type": "steedos-object-listview",
              "objectApiName": tab_id,
              // "listName": "${listName}",
              // "headerToolbar": [],
              "columnsTogglable": false,
              "showHeader": true,
              "className": ""
            }}
            router={router}
          ></AmisRender>
      </div>
      <div className="flex-1">
      {page && (
        <AmisRender
            data={{
              objectName: tab_id,
              recordId: record_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: renderId+"-page"
            }}
            className="steedos-record-detail"
            id={`${renderId}-page`}
            schema={JSON.parse(page.schema)}
            router={router}
          ></AmisRender>
      )}
      {!page && uiSchema && <AmisRender
            data={{
              objectName: tab_id,
              recordId: record_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: renderId
            }}
            className="steedos-record-detail"
            id={renderId}
            schema={{
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
            }}
            router={router}
          ></AmisRender>}
      </div>
    </div>
  )
}
