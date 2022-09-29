import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import {
    getObjectDetailButtons,
    getObjectDetailMoreButtons,
  } from "@steedos-widgets/amis-lib";
import { Button } from "@/components/object/Button";

import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu , Space, Button as AButton  } from 'antd';

export function RecordHeader({ schema, formFactor, permissions, hiddenTitle, className="", record: defRecord, app_id: appId, tab_id: tabId, record_id: recordId }) {
  const router = useRouter();
  let { app_id, tab_id, record_id } = router.query;
  if(appId){
    app_id = appId;
  }
  if(tabId){
    tab_id = tabId;
  }
  if(recordId){
    record_id = recordId;
  }
  const [record, setRecord] = useState();
  const [buttons, setButtons] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);
  
  const loadButtons = (schema) => {
    if (schema && schema.uiSchema) {
      setButtons(
        getObjectDetailButtons(schema.uiSchema, {
          permissions,
          app_id: app_id,
          tab_id: tab_id,
          router: router,
          recordId: record_id,
          objectName: schema.uiSchema.name,
          formFactor: formFactor
        })
      );
      setMoreButtons(
        getObjectDetailMoreButtons(schema.uiSchema, {
          permissions,
          app_id: app_id,
          tab_id: tab_id,
          router: router,
          recordId: record_id,
          objectName: schema.uiSchema.name,
          formFactor: formFactor
        })
      );
    }
  };

  useEffect(() => {
    if(schema && permissions){
        loadButtons(schema);
        return window.addEventListener("message", function (event) {
            const { data } = event;
            if (data.type === "record.loaded") {
              const { record } = data;
              setRecord(record);
            }
        });
    }
  }, [schema, permissions, record_id]);

  useEffect(()=>{
    setRecord(defRecord)
  }, [defRecord])

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
    <div className={`slds-page-header slds-page-header_record-home bg-transparent shadow-none border-none pb-0 ${className}`}>
      <div className="slds-page-header__row">
        {hiddenTitle != true && 
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
        }

        <div className="slds-page-header__col-actions">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control space-x-1">
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
                            record_id: record_id,
                            record: record,
                            permissions: schema.uiSchema.permissions
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
