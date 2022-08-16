/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 13:21:25
 * @Description:
 */
import dynamic from "next/dynamic";
import Document, { Script, Head, Main, NextScript } from "next/document";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { getViewSchema, getFormSchema, getObjectRelateds } from "@/lib/objects";
import { AmisRender } from "@/components/AmisRender";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Tab, Menu, Transition } from "@headlessui/react";

import { RecordHeader } from '@/components/object/RecordHeader';
import { RecordHeader as MobileRecordHeader } from '@/components/mobile/object/RecordHeader';
import { RecordRelateds } from '@/components/object/RecordRelateds';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Record({formFactor}) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [schema, setSchema] = useState(null);
  const [relateds, setRelateds] = useState(null);

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
      const p1 = getObjectRelateds(app_id, tab_id, record_id, formFactor);
      const p2 = getViewSchema(tab_id, record_id, { formFactor: formFactor });
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
    return [
      {label: '详情', name: 'detail', component: ()=>{
        return (
          <div className="p-4 bg-white rounded border">
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
      }},
      {label: '相关', name: 'relateds', component: ()=>{
        return (<>
          <RecordRelateds app_id={app_id} record_id={record_id} relateds={relateds}></RecordRelateds>
        </>)
      }}
    ]
  }

  const Header = formFactor === "SMALL" ? MobileRecordHeader : RecordHeader;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="region-header">
        {schema && <Header schema={schema}></Header>}
      </div>
      <div className="flex flex-1 flex-col region-main overflow-hidden">
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
          <Tab.Panels className="flex-1 p-4 bg-gray-50 overflow-y-auto  ">
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

export async function getServerSideProps(context) {
  const session = context.req.session || await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/app",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
