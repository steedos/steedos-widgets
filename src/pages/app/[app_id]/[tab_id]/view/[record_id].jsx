/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:15:30
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
import { RecordRelateds } from '@/components/object/RecordRelateds';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Record({}) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [schema, setSchema] = useState(null);
  const [relateds, setRelateds] = useState(null);
  const [formFactor, setFormFactor] = useState(null);

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
    if (window.innerWidth < 768) {
      setFormFactor("SMALL");
    } else {
      setFormFactor("LARGE");
    }
  }, []);

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

  // const cancelClick = () => {
  //   doReadonly();
  // };

  // const submitClick = (e) => {
  //   const scope = SteedosUI.getRef(
  //     SteedosUI.getRefId({
  //       type: "form",
  //       appId: app_id,
  //       name: schema.uiSchema.name,
  //     })
  //   );
  //   const form = scope.getComponentByName(
  //     `page_edit_${record_id}.form_edit_${record_id}`
  //   );
  //   form.handleAction({}, { type: "submit" }).then((data) => {
  //     if (data) {
  //       router.push(`/app/${app_id}/${tab_id}/view/${data.recordId}`);
  //     }
  //   });
  // };
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
          <RecordRelateds app_id={app_id} record_id={record_id} relateds={relateds}></RecordRelateds>
        </>)
      }}
    ]
  }

  return (
    <div className="slds-grid slds-wrap">
      <div className="slds-col slds-size_1-of-1 row region-header">
        {schema && <RecordHeader schema={schema}></RecordHeader>}
      </div>
      {/* <div className="z-9 relative py-4">
        <div className="space-y-4">
          <div className="pointer-events-auto w-full text-[0.8125rem] leading-5">
            <div className="">
              <div className="flex justify-between">
                <div className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl"></div>
                <div className="ml-6 flex flex-nowrap space-x-2 fill-slate-400">
                  {isEditing && (
                    <>
                      <button
                        onClick={cancelClick}
                        className="antd-Button border-1 border-solid border-gray-300 py-0.5 px-3 text-slate-700 sm:rounded-[2px]"
                      >
                        取消
                      </button>
                      <button
                        onClick={submitClick}
                        className="antd-Button bg-sky-500 py-0.5 px-3 font-semibold text-white hover:bg-sky-600 focus:outline-none sm:rounded-[2px]"
                      >
                        提交
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
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
              className={classNames("bg-white sm:rounded-b-xl", "pt-2")}
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
  const session = await unstable_getServerSession(
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
