/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-04 11:41:54
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
import { RelatedList } from "@/components/object/RelatedList";
import { RecordHeader } from '@/components/object/RecordHeader'

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
  console.log(`schema`, schema)
  return (
    <>
      {schema && <RecordHeader schema={schema}></RecordHeader>}
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

      <div className="z-9 relative mt-2 ">
        <Tab.Group vertical={true}>
          <Tab.List className="flex space-x-1 p-2">
            <Tab
              key="detail"
              className={({ selected }) =>
                classNames(
                  "w-full max-w-[15rem] pb-2",
                  "",
                  selected ? "border-b-2 border-sky-500" : ""
                )
              }
            >
              基本信息
            </Tab>
            {relateds?.map((related) => {
              return (
                <Tab
                  key={`${related.object_name}-${related.foreign_key}`}
                  className={({ selected }) =>
                    classNames(
                      "w-full max-w-[15rem] pb-2",
                      "",
                      selected ? "border-b-2 border-sky-500" : ""
                    )
                  }
                >
                  {related?.schema?.uiSchema?.label}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels className="mt-0">
            <Tab.Panel
              key="detail"
              className={classNames("bg-white sm:rounded-b-xl", "")}
            >
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
            </Tab.Panel>
            {relateds?.map((related) => {
              return (
                <Tab.Panel
                  key={`${related.object_name}-${related.foreign_key}`}
                  className={classNames("bg-white sm:rounded-b-xl", "")}
                >
                  <RelatedList
                    key={`${related.object_name}-${related.foreign_key}`}
                    {...related}
                    app_id={app_id}
                    record_id={record_id}
                  ></RelatedList>
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
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
