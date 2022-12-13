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
          formFactor: formFactor,
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

  // TODO: dataComponentId删除掉换成scopeId
  const getMenu = ()=>{
    const items = [];
    moreButtons?.map((button, index)=>{
      items.push({
        key: button.name,
        className: 'steedos-object-record-more-button w-full p-0 min-w-[11rem]',
        label: <>
          <Button
              button={button}
              inMore={true}
              uiSchema={schema.uiSchema} 
              formFactor={formFactor} 
              data={{
                app_id: app_id,
                appId: app_id,
                tab_id: tab_id,
                object_name: schema.uiSchema.name,
                dataComponentId: `${app_id}-${tab_id}-${record_id}`,
                record_id: record_id,
                recordId: record_id,
                record: record,
                permissions: schema.uiSchema.permissions,
                uiSchema: schema.uiSchema
              }}
              className={`antd-Button antd-Button--default`}
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
    <div className={`slds-page-header slds-page-header_record-home bg-transparent shadow-none border-none ${className}`}>
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
            <div className="slds-page-header__control steedos-record-buttons flex">
                <>
                  {buttons?.map((button) => {
                    return (
                      <Button
                      key={button.name}
                      button={button}
                      uiSchema={schema.uiSchema} 
                      formFactor={formFactor} 
                      data={{
                        app_id: app_id,
                        tab_id: tab_id,
                        object_name: schema.uiSchema.name,
                        dataComponentId: `${app_id}-${tab_id}-${record_id}`,
                        record_id: record_id,
                        recordId: record_id,
                        record: record,
                        permissions: schema.uiSchema.permissions,
                        uiSchema: schema.uiSchema,
                      }}
                      scopeClassName=""
                    ></Button>
                    );
                  })}
                  {moreButtons?.length > 0 && (
                      <Dropdown overlay={getMenu()} trigger={['click']} placement='bottomLeft'>
                        <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="More Actions">
                          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m7 10 5 5 5-5z" fill="currentColor"></path></svg>
                          <span className="slds-assistive-text">More Actions</span>
                        </button>
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
