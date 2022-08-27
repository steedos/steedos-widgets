import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import {
    getObjectDetailButtons,
    getObjectDetailMoreButtons,
  } from "@/lib/buttons";
import { Button } from "@/components/object/Button";

import { standardButtonsTodo } from '@/lib/buttons';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu , Space, Button as AButton  } from 'antd';

export function RecordHeader({ schema, formFactor, permissions }) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  
  const [record, setRecord] = useState(null);
  const [buttons, setButtons] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);
  
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
          recordId: record_id,
          objectName: schema.uiSchema.name
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


  const getMenu = ()=>{
    const items = [];
    moreButtons?.map((button, index)=>{
      items.push({
        key: button.name,
        className: 'w-full p-0 min-w-[11rem]',
        label: <>
          <Button
              button={button}
              inMore={true}
              data={{
                app_id: app_id,
                tab_id: tab_id,
                object_name: schema.uiSchema.name,
              }}
              className={`text-gray-900 slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`}
            ></Button>
        </>
      })
    })

    const menu = (
      <Menu
        items={items}
      />
    );
    return menu
  }

  return (
    <div className="slds-page-header slds-page-header_record-home bg-transparent shadow-none border-none pb-0">
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
            <div className="slds-page-header__control space-x-1">
                {permissions?.allowEdit && (
                  <button
                  onClick={(event)=>{
                    standardButtonsTodo.standard_edit.call({}, event, {
                      recordId: record_id,
                      appId: app_id,
                      uiSchema: schema.uiSchema,
                      formFactor: formFactor,
                      router: router
                    })
                  }}
                  className="antd-Button antd-Button--default"
                >
                  编辑
                </button>
                )}
                <>
                  {buttons?.map((button) => {
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
                          scopeClassName="inline-block"
                        ></Button>
                    );
                  })}
                  {moreButtons?.length > 0 && (
                      <Dropdown overlay={getMenu()} trigger={['click']}>
                        <AButton icon={<MoreOutlined />} className="rounded"></AButton>
                      </Dropdown>
                  )}
                </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
