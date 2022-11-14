/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-08 09:19:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-14 16:01:43
 * @Description:
 */

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { getListSchema } from '@steedos-widgets/amis-lib';
import { AmisRender } from '@/components/AmisRender'
import { ListviewHeader } from '@/components/object/ListviewHeader'
import { Loading } from '@/components/Loading';

export function DefaultListview({ router, formFactor }) {
  const { app_id, tab_id } = router.query;
  const [schema, setSchema] = useState();
  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: schema?.uiSchema?.name,
  });

  const getListviewSchema = (listviewName) => {
    getListSchema(app_id, tab_id, listviewName, {
      formFactor: formFactor,
    }).then((data) => {
      setSchema(data);
    });
  };

  useEffect(() => {
    if (!tab_id || !formFactor) return;
    getListviewSchema(undefined);
  }, [tab_id, formFactor]);

  if (!schema)
    return (
      <>
        <Loading />
      </>
    );
  return (
    <>
      {schema.isCustom && schema.amisSchema && <AmisRender
        data={{
          objectName: tab_id,
          listViewId: listViewId,
          appId: app_id,
          formFactor: formFactor,
        }}
        className="steedos-listview"
        id={`${listViewId}-page`}
        schema={schema.amisSchema}
        router={router}
      ></AmisRender>
    }
    {
      !schema.isCustom && <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b">
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
      <div className="min-h-0 flex-1 overflow-y-auto">
        {schema?.amisSchema && schema?.uiSchema.name === tab_id && (
          <AmisRender
            data={{
              objectName: schema.uiSchema.name,
              listViewId: listViewId,
              appId: app_id,
              formFactor: formFactor,
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
