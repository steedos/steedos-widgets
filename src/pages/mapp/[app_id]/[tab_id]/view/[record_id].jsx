/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 16:59:46
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
import { RelatedsLink } from '@/components/object/RelatedsLink';

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
          <>
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
          </>
        )
      }},
      {label: '相关', name: 'relateds', component: ()=>{
        return (<>
          <RelatedsLink app_id={app_id} record_id={record_id} relateds={relateds}></RelatedsLink>
        </>)
      }}
    ]
  }

  const Header = formFactor === "SMALL" ? MobileRecordHeader : RecordHeader;

  return (
    <div className="sm:p-4 slds-grid slds-wrap">
      <div className="slds-col slds-size_1-of-1 row region-header">
        {schema && <Header schema={schema}></Header>}
      </div>
    <div className="slds-col slds-size_1-of-1 row region-main">
    <div className="z-9 relative mt-2 shadow-none border-none">
        <Tab.Group vertical={true}>
          <Tab.List className="flex space-x-1 border-b">
            {getTabs().map((item)=>{
              return (<Tab
                key={item.name}
                className={({ selected }) =>
                  classNames(
                    "px-10",
                    "text-base",
                    selected ? "border-b-2 border-sky-500 text-black" : "text-current"
                  )
                }
              >
                {item.label}
              </Tab>)
            })}
          </Tab.List>
          <Tab.Panels className="my-2">
            {getTabs().map((item)=>{
              return (
                <Tab.Panel
                key={item.name}
              className={classNames("bg-white shadow-none", "pt-2")}
            >
              {item.component()}
            </Tab.Panel>
              )
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
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
