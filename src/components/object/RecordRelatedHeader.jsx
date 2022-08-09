/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 13:59:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:16:24
 * @Description:
 */
import { RecordRelatedListButtons } from '@/components/object/RecordRelatedListButtons'
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from 'next/link'

export const RecordRelatedHeader = ({schema, object_name, foreign_key, app_id, record_id, masterObjectName, refId}) => {
  const [queryInfo, setQueryInfo] = useState();
  useEffect(() => {
    if (schema) {
      window.addEventListener("message", (event) => {
        const { data } = event;
        if (data.type === "listview.loaded") {
          if (schema) {
            setTimeout(() => {
                const listViewId = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
              if (
                SteedosUI.getRef(listViewId) &&
                SteedosUI.getRef(listViewId).getComponentByName
              ) {
                const listViewRef = SteedosUI.getRef(
                  listViewId
                ).getComponentByName(`page.listview_${schema.uiSchema.name}`);
                setQueryInfo({
                  count: listViewRef.props.data.count
                });
              }
            }, 300);
          }
        }
      });
    }
  }, [schema]);
  return (
    <>
      <header
        className="slds-media slds-media--center slds-has-flexi-truncate"
      >
        <div
          aria-hidden="true"
          className="slds-media__figure stencil slds-avatar slds-avatar_small"
        >
          <div
             style={{backgroundColor: "#3c97dd"}}
            className="extraSmall forceEntityIcon"
          >
            <span
              className="uiImage"
            >
              <svg
                  className="slds-icon slds-page-header__icon"
                  aria-hidden="true"
                >
                  <use xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`}></use>
                </svg>
            </span>
          </div>
        </div>
        <div className="slds-media__body" >
          <h2
            className="slds-card__header-title"
          >
            <Link href={`/app/${app_id}/${masterObjectName}/${record_id}/${object_name}/grid?related_field_name=${foreign_key}`}>
            <a
              className="slds-card__header-link baseCard__header-title-container"
            >
              <>
              <span
                className="slds-truncate slds-m-right--xx-small"
              >
                {schema.uiSchema.label}
              </span>
              <span
                className="slds-shrink-none slds-m-right--xx-small"
              >
                ({queryInfo?.count})
              </span>
              </>
            </a>
            </Link>
          </h2>
        </div>
      </header>
      <div className="slds-no-flex" >
        <div className="actionsContainer" >
          <ul
            className="branding-actions slds-button-group slds-m-left--xx-small small oneActionsRibbon forceActionsContainer"
          >
            <RecordRelatedListButtons foreign_key={foreign_key} record_id={record_id} refId={refId} app_id={app_id} tab_id={object_name} object_name={object_name} masterObjectName={masterObjectName} schema={schema}></RecordRelatedListButtons>
          </ul>
        </div>
      </div>
    </>
  );
};
