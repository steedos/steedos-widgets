/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-01 17:52:24
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
import {
  getObjectDetailButtons,
  getObjectDetailMoreButtons,
} from "@/lib/buttons";
import { Button } from "@/components/object/Button";
import { RelatedList } from '@/components/object/RelatedList'

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
  
  const [record, setRecord] = useState(null);

  const [buttons, setButtons] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);

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

    window.addEventListener('message', function (event) {
        const { data } = event;
        if(data.type === 'record.loaded'){
            const { record } = data;
            setRecord(record);
        }
    })
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

  const loadButtons = (schema) => {
    if (schema && schema.uiSchema) {
      setButtons(
        getObjectDetailButtons(schema.uiSchema, {
          app_id: app_id,
          tab_id: tab_id,
          router: router,
        })
      );
      setMoreButtons(
        getObjectDetailMoreButtons(schema.uiSchema, {
          app_id: app_id,
          tab_id: tab_id,
          router: router,
        })
      );
    }
  };

  const viewRecord = (tab_id, record_id, formFactor) => {
    if (tab_id && record_id) {
      const p1 = getObjectRelateds(app_id, tab_id, record_id, formFactor);
      const p2 = getViewSchema(tab_id, record_id, { formFactor: formFactor });
      Promise.all([p1, p2]).then((values) => {
        setRelateds(values[0]);

        const schema = values[1];
        loadButtons(schema);
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
        loadButtons(data);
        setSchema(data);
        setIsEditing(true);
      });
    }
  };

  const cancelClick = () => {
    doReadonly();
  };

  const editClick = () => {
    doEditing();
  };
  const submitClick = (e) => {
    const scope = SteedosUI.getRef(`${app_id}-${tab_id}-${record_id}`);
    const form = scope.getComponentByName(
      `page_edit_${record_id}.form_edit_${record_id}`
    );
    form.handleAction({}, { type: "submit" });
  };
  return (
    <>
      <div className="z-9 relative ">
        <div className="space-y-4">
          <div className="pointer-events-auto w-full text-[0.8125rem] leading-5">
            <div className="">
              <div className="flex justify-between">
                <div className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                  {schema?.uiSchema?.label}
                </div>
                <div className="ml-6 flex flex-nowrap space-x-2 fill-slate-400">
                  {schema?.uiSchema?.permissions?.allowEdit && !isEditing && (
                    <button
                      onClick={editClick}
                      className="antd-Button bg-sky-500 py-0.5 px-3 text-white hover:bg-sky-600 focus:outline-none sm:rounded-[2px]"
                    >
                      编辑
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={cancelClick}
                        className="antd-Button py-0.5 px-3 text-slate-700 border-solid border-1 border-gray-300 sm:rounded-[2px]"
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
                  {!isEditing && (
                    <>
                      {
                        buttons?.map((button) => {
                          return (
                            <Button
                              key={button.name}
                              button={button}
                              data={{
                                app_id: app_id,
                                tab_id: tab_id,
                                object_name: schema.uiSchema.name,
                                dataComponentId: `${app_id}-${tab_id}-${record_id}`,
                              }}
                            ></Button>
                          );
                        })}
                      {moreButtons?.length > 0 && (
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button className="antd-Button border-1 border-solid border-gray-300 py-0.5 px-3 text-slate-700 sm:rounded-[2px]">
                              ...
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]">
                              <div className="px-1 py-1">
                                {moreButtons.map((button, index) => {
                                  return (
                                    <Menu.Item key={index}>
                                      {({ active }) => (
                                        <Button
                                          button={button}
                                          data={{
                                            app_id: app_id,
                                            tab_id: tab_id,
                                            object_name: schema.uiSchema.name,
                                            // _ref: listViewRef.current?.amisScope?.getComponentById("listview_project"),
                                          }}
                                          className={`${
                                            active
                                              ? "bg-violet-500 text-white"
                                              : "text-gray-900"
                                          } group flex w-full items-center border-0 px-2 py-2 hover:bg-slate-50 sm:rounded-[2px]`}
                                        ></Button>
                                      )}
                                    </Menu.Item>
                                  );
                                })}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="mt-1 text-slate-700">{record ? record[schema?.uiSchema?.NAME_FIELD_KEY] : ''}</div>
            </div>
          </div>
        </div>
      </div>

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
                  id={`${app_id}-${tab_id}-${record_id}`}
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
                    <RelatedList key={`${related.object_name}-${related.foreign_key}`} {...related}></RelatedList>
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
