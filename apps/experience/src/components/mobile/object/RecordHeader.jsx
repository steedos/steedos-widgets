import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Tab, Menu, Transition } from "@headlessui/react";
import {
    getObjectDetailButtons,
    getObjectDetailMoreButtons,
  } from "@steedos-labs/amis-lib";
  import { Button } from "@/components/object/Button";

export function RecordHeader({ schema, formFactor, permissions }) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  const [record, setRecord] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);

  const loadButtons = (schema) => {
    let buttons = [];
    buttons = _.concat(buttons, getObjectDetailButtons(schema.uiSchema, {
      permissions,
      app_id: app_id,
      tab_id: tab_id,
      router: router,
      recordId: record_id,
      objectName: schema.uiSchema.name,
      formFactor: formFactor
    }));
    buttons = _.concat(buttons, getObjectDetailMoreButtons(schema.uiSchema, {
      permissions,
      app_id: app_id,
      tab_id: tab_id,
      router: router,
      recordId: record_id,
      objectName: schema.uiSchema.name,
      formFactor: formFactor
    }));
    setMoreButtons(buttons);
  };

  useEffect(() => {
    if(schema && permissions){
        loadButtons(schema);

        window.addEventListener("message", function (event) {
            const { data } = event;
            if (data.type === "record.loaded") {
              const { record } = data;
              setRecord(record);
            }
        });
    }
  }, [schema, permissions]);


  return (
    <div className="slds-page-header slds-page-header_record-home shadow-none border-none bg-slate-50">
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-title">
          <div className="slds-media">
            <div className="slds-media__figure">
              <span className="slds-icon_container slds-icon-standard-opportunity">
                <svg
                  className="slds-icon slds-page-header__icon"
                  aria-hidden="true"
                >
                  <use xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`}></use>
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
                <>
                  {moreButtons?.length > 0 && (
                    <li>
                      <Menu
                        as="div"
                        className="slds-dropdown-trigger slds-dropdown-trigger_click"
                      >
                        <div>
                          <Menu.Button className="border-0">
                          <div>
                          <svg
                          className="slds-icon slds-icon-text-default slds-icon_x-small"
                          aria-hidden="true"
                        >
                          <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#threedots_vertical"></use>
                        </svg>
                        </div>
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
                          <Menu.Items className="absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]">
                            <div className="">
                              {moreButtons?.map((button, index) => {
                                return (
                                  <Menu.Item key={index}>
                                    {({ active }) => (
                                      <Button
                                        button={button}
                                        inMore={true}
                                        data={{
                                          app_id: app_id,
                                          tab_id: tab_id,
                                          object_name: schema.uiSchema.name,
                                        }}
                                        className={`${
                                          active
                                            ? "bg-violet-500 text-white"
                                            : "text-gray-900"
                                        } slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`}
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
