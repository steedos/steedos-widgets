/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-08 09:19:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-01 10:15:55
 * @Description:
 */

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getListSchema } from '@steedos-widgets/amis-lib';
import { AmisRender } from '@/components/AmisRender'
import { ListviewHeader } from '@/components/object/ListviewHeader'
import { Loading } from '@/components/Loading';

export function DefaultListview({ router, formFactor }) {
  const { app_id, tab_id, listview_id } = router.query;
  const [schema, setSchema] = useState();
  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: schema?.uiSchema?.name,
  });

  const getListviewSchema = (listviewName) => {
    getListSchema(app_id, tab_id, listviewName, {
      formFactor: formFactor,
      listViewId: listViewId
    }).then((data) => {
      setSchema(data);
    });
  };

  useEffect(() => {
    if (!tab_id || !formFactor) return;
    getListviewSchema(listview_id);
  }, [tab_id, formFactor, listview_id ]);

  if (!schema)
    return (
      <>
        <Loading />
      </>
    );
  return (
    <>
      {/* {schema.isCustom && schema.amisSchema && <AmisRender
        data={{
          objectName: tab_id,
          listViewId: listViewId,
          appId: app_id,
          formFactor: formFactor,
        }}
        className="steedos-listview"
        id={`${listViewId}`}
        schema={schema.amisSchema}
        router={router}
      ></AmisRender>
    } */}
    {
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className={schema.isCustom ? "" : "border-b"}>
        {formFactor && schema?.uiSchema.name === tab_id && (
          <ListviewHeader
            formFactor={formFactor}
            schema={schema}
            onListviewChange={(listView) => {
              getListviewSchema(listView?.name);
            }}
          ></ListviewHeader>
        )}
      </div>
      <div className={"min-h-0 flex-1 overflow-y-auto" + (schema.isCustom ? " -mt-6" : "")}>
        {schema?.amisSchema && schema?.uiSchema.name === tab_id && (
          <AmisRender
            data={{
              objectName: schema.uiSchema.name,
              listViewId: listViewId,
              listName: listview_id,
              appId: app_id,
              formFactor: formFactor,
              scopeId: listViewId,
            }}
            className="steedos-listview"
            id={listViewId}
            schema={schema?.amisSchema || {}}
            router={router}
          ></AmisRender>
        )}
      </div>
    </div>
    }
    </>
  );
}
