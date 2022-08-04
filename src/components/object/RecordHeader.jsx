import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Tab, Menu, Transition } from "@headlessui/react";
import {
    getObjectDetailButtons,
    getObjectDetailMoreButtons,
  } from "@/lib/buttons";
  import { Button } from "@/components/object/Button";

  import config from '@/config';

export function RecordHeader({ schema }) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  
  const [record, setRecord] = useState(null);
  const [buttons, setButtons] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);
  const editRecord = () => {
    const type = config.listView.editRecordMode;
    SteedosUI.Object.editRecord({ appId: app_id, name: SteedosUI.getRefId({type: `${type}-form`,}), title: `编辑 ${schema.uiSchema.label}`, objectName: schema.uiSchema.name, recordId: record_id, type, options: {}, router, 
    onSubmitted: ()=>{
        SteedosUI.getRef(SteedosUI.getRefId({
            type: "detail",
            appId: app_id,
            name: schema.uiSchema.name,
          })).getComponentById(`detail_${record_id}`).reload()
      } })

  };
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

  useEffect(() => {
    if(schema){
        loadButtons(schema);

        window.addEventListener("message", function (event) {
            const { data } = event;
            if (data.type === "record.loaded") {
              const { record } = data;
              setRecord(record);
            }
        });
    }
  }, [schema]);


  return (
    <div className="slds-page-header slds-page-header_record-home">
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-title">
          <div className="slds-media">
            <div className="slds-media__figure">
              <span className="slds-icon_container slds-icon-standard-opportunity">
                <svg
                  className="slds-icon slds-page-header__icon"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/standard-sprite/svg/symbols.svg#opportunity"></use>
                </svg>
              </span>
            </div>
            <div className="slds-media__body">
              <div className="slds-page-header__name">
                <div className="slds-page-header__name-title">
                  <div className="">
                    <span>{schema?.uiSchema?.label}</span>
                    <span className="slds-page-header__title slds-truncate">
                      {record ? record[schema?.uiSchema?.NAME_FIELD_KEY] : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="slds-page-header__col-actions">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control">
              <ul className="slds-button-group-list">
                {schema?.uiSchema?.permissions?.allowEdit && (
                  <li>
                    <button
                      onClick={editRecord}
                      className="slds-button slds-button_neutral"
                    >
                      编辑
                    </button>
                  </li>
                )}

                <>
                {buttons?.map((button) => {
                    return (
                    <li>
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
                    </li>
                    );
                })}
                {moreButtons?.length > 0 && (
                    <li>
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
                    </li>
                )}
                </>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
