import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Tab, Menu, Transition } from "@headlessui/react";
import {
    getObjectDetailButtons,
    getObjectDetailMoreButtons,
  } from "@/lib/buttons";
  import { Button } from "@/components/object/Button";

  import config from '@/config';
import { isEmpty, filter } from 'lodash';

export function RecordHeader({ schema }) {
  const router = useRouter();
  const { app_id, tab_id, record_id } = router.query;
  
  const [record, setRecord] = useState(null);
  const [buttons, setButtons] = useState(null);
  const [moreButtons, setMoreButtons] = useState(null);
  const editRecord = () => {
    const type = config.listView.editRecordMode;
    SteedosUI.Object.editRecord({ appId: app_id, name: SteedosUI.getRefId({type: `${type}-form`,}), title: `编辑 ${schema.uiSchema.label}`, objectName: schema.uiSchema.name, recordId: record_id, type, options: {
      props: {
        width: '100%',
        style: {
          width: '100%',
        },
        bodyStyle: {padding: "0px", paddingTop: "0px"},
      }
    }, router, 
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
    <div className="slds-page-header slds-page-header_record-home  bg-white shadow-none border-none p-0">
      <div className="slds-page-header__row bg-slate-100 border-b">
      <div className="slds-page-header__col-details">
          <div className="grid gap-4 grid-cols-3 p-0 pt-2">
          {schema?.uiSchema?.permissions?.allowEdit && (
            <div className="text-center	">
            <span
                className="slds-icon_container slds-icon_container_circle slds-icon-action-edit"
                title="编辑"
                onClick={editRecord}
              >
                <svg className="slds-icon slds-button__icon slds-icon_small" aria-hidden="true">
                  <use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span className="slds-assistive-text">编辑</span>
              </span>
            </div>
          )}

<div className="text-center	" >
                <span
                    className="slds-icon_container slds-icon_container_circle slds-icon-action-share-file"
                    title="File"
                    onClick={()=>{}}
                  >
                    <svg className="slds-icon slds-button__icon slds-icon_small" aria-hidden="true">
                      <use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#share_file"></use>
                    </svg>
                    <span className="slds-assistive-text">File</span>
                  </span>
                </div>

          {buttons?.map((button) => {
              return (
                <li key={button.name}>
                  <Button
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
            
            <div className="text-center	">
            <span
                className="slds-icon_container slds-icon_container_circle slds-icon-action-more"
                title="Refresh List"
                onClick={()=>{}}
              >
                <svg className="slds-icon slds-button__icon slds-icon_small" aria-hidden="true">
                  <use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#more"></use>
                </svg>
                <span className="slds-assistive-text">更多</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="slds-page-header__row p-2">
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
      </div>
    </div>
  );
}
