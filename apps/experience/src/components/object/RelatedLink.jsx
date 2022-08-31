/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-20 17:49:19
 * @Description:
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from "next/link";
import { SteedosUI } from '@/components/functions';
export const RelatedLink = ({
  schema,
  object_name,
  foreign_key,
  app_id,
  record_id,
  masterObjectName,
  recordCount,
  formFactor
}) => {
  return (
    <Link
              href={SteedosUI.Router.getObjectRelatedViewPath({
                formFactor, 
                appId: app_id, 
                masterObjectName: masterObjectName, 
                masterRecordId: record_id, 
                objectName: object_name, 
                foreignKey: foreign_key
              })}
            ><div className="slds-grid slds-page-header rounded-none p-2 bg-white border-0 shadow-none">
      <header className="slds-media slds-media--center slds-has-flexi-truncate">
        <div
          aria-hidden="true"
          className="slds-media__figure stencil slds-avatar slds-avatar_small"
        >
          <div
            //  style={{backgroundColor: "#3c97dd"}}
            className="extraSmall forceEntityIcon"
          >
            <span
              className={`uiImage slds-icon_container slds-icon-standard-${schema.uiSchema.icon?.replaceAll(
                "_",
                "-"
              )}`}
            >
              <svg
                className="slds-icon slds-page-header__icon"
                aria-hidden="true"
              >
                <use
                  xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`}
                ></use>
              </svg>
            </span>
          </div>
        </div>
        <div className="slds-media__body">
          <h2 className="slds-card__header-title">
            
              <a className="slds-card__header-link baseCard__header-title-container font-normal">
                <>
                  <span className="slds-truncate slds-m-right--xx-small">
                    {schema.uiSchema.label}
                  </span>
                  <span className="slds-shrink-none slds-m-right--xx-small">
                    ({recordCount})
                  </span>
                </>
              </a>
            
          </h2>
        </div>
      </header>
      <div className="slds-no-flex">
        <span className="slds-icon_container null slds-icon__svg--default">
            <svg
              className="slds-icon slds-icon-text-default slds-icon_x-small"
              aria-hidden="true"
            >
              <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#chevronright"></use>
            </svg>
          </span>
      </div></div>
      </Link>
  );
};
