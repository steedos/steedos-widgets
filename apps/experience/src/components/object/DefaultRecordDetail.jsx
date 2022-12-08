/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-08 10:33:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 10:42:43
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { getViewSchema, getFormSchema, getObjectRelatedList } from "@steedos-widgets/amis-lib";
import { AmisRender } from "@/components/AmisRender";
import { Tab, Menu, Transition } from "@headlessui/react";

import { RecordHeader } from '@/components/object/RecordHeader';
import { RecordRelateds } from '@/components/object/RecordRelateds';
import { getRecordPermissions } from '@steedos-widgets/amis-lib';
import { Loading } from '@/components/Loading';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function DefaultRecordDetail({ router, formFactor }){
  const { app_id, tab_id, record_id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [schema, setSchema] = useState(null);
  const [relateds, setRelateds] = useState(null);
  const [permissions, setPermissions] = useState(null);

  const doEditing = () => {
    if (!formFactor) {
      return;
    }
    editRecord(tab_id, record_id, formFactor);
  };

  const doReadonly = () => {
    if (!formFactor) {
      return;
    }
    viewRecord(tab_id, record_id, formFactor);
  };


  useEffect(()=>{
    getRecordPermissions(tab_id, record_id).then((res)=>{
      setPermissions(res)
    })
  }, [tab_id, record_id])

  useEffect(() => {
    doReadonly();
  }, [router]);

  useEffect(() => {
    if (isEditing) {
      doEditing();
    } else {
      doReadonly();
    }
  }, [formFactor]);

  const viewRecord = (tab_id, record_id, formFactor) => {
    if (tab_id && record_id) {
      const p1 = getObjectRelatedList(app_id, tab_id, record_id, formFactor);
      const p2 = getViewSchema(tab_id, record_id, {
        recordId: record_id,
        tabId: tab_id,
        appId: app_id,
        formFactor: formFactor,
      });
      Promise.all([p1, p2]).then((values) => {
        setRelateds(values[0]);

        const schema = values[1];
        setSchema(schema);
        setIsEditing(false);
      });
    }
  };

  const editRecord = (tab_id, record_id, formFactor) => {
    if (tab_id && record_id) {
      getFormSchema(tab_id, {
        recordId: record_id,
        tabId: tab_id,
        appId: app_id,
        formFactor: formFactor,
      }).then((data) => {
        setSchema(data);
        setIsEditing(true);
      });
    }
  };

  const getTabs = ()=>{
    const tabs = [{label: '详情', name: 'detail', component: ()=>{
      return (
        <div className="">
          {schema?.amisSchema && (
              <AmisRender
                id={SteedosUI.getRefId({
                  type: "detail",
                  appId: app_id,
                  name: schema.uiSchema.name,
                })}
                schema={schema?.amisSchema || {}}
                router={router}
              ></AmisRender>
            )}
        </div>
      )
    }}];

    if(relateds && relateds.length > 0){
      tabs.push({label: '相关', name: 'relateds', component: ()=>{
        return (<>
          <RecordRelateds app_id={app_id} record_id={record_id} relateds={relateds} formFactor={formFactor}></RecordRelateds>
        </>)
      }})
    }

    return tabs;
  }


  if (!schema) 
    return <><Loading/></>
    
  return (
    <div className="flex flex-col sm:m-3">
      <div className="region-header bg-white sm:shadow sm:rounded sm:border border-slate-300">
        {schema && <RecordHeader schema={schema} formFactor={formFactor} permissions={permissions}></RecordHeader>}
      </div>
      <div className="sm:mt-3 flex flex-col region-main bg-white sm:shadow sm:rounded sm:border border-slate-300">
        <Tab.Group vertical={true}>
          <Tab.List className="pl-4 flex space-x-1 border-b">
            {getTabs().map((item)=>{
              return (<Tab
                key={item.name}
                className={({ selected }) =>
                  classNames(
                    "px-10 py-2",
                    selected ? "border-b-2 border-sky-500 text-black" : "text-current"
                  )
                }
              >
                {item.label}
              </Tab>)
            })}
          </Tab.List>
          <Tab.Panels className="flex-1 p-4 overflow-y-auto  bg-white ">
            {getTabs().map((item)=>{
              return (
                <Tab.Panel
                key={item.name}
            >
              {item.component()}
            </Tab.Panel>
              )
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
     
    </div>
  );
}