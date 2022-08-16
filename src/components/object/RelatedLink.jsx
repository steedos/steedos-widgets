/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-16 16:57:26
 * @Description:
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from "next/link";

export const RelatedLink = ({
  schema,
  object_name,
  foreign_key,
  app_id,
  record_id,
  masterObjectName,
  recordCount,
}) => {
  return (
    <>
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
            <Link
              href={`/app/${app_id}/${masterObjectName}/${record_id}/${object_name}/grid?related_field_name=${foreign_key}`}
            >
              <a className="slds-card__header-link baseCard__header-title-container">
                <>
                  <span className="slds-truncate slds-m-right--xx-small">
                    {schema.uiSchema.label}
                  </span>
                  <span className="slds-shrink-none slds-m-right--xx-small">
                    ({recordCount})
                  </span>
                </>
              </a>
            </Link>
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
      </div>
    </>
  );
};
