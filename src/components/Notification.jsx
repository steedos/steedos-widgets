import React, { useState, useEffect, Fragment } from "react";
import { getNotifications } from '@/lib/notification';
export const Notification = ({}) => {
  const [info, setInfo] = useState(null);

  const loadData = async ()=>{
    getNotifications().then((result)=>{
        setInfo(result)
    }).catch((err)=>{
        console.error(err)
    }).finally(()=>{
        setTimeout(loadData, 30 * 1000)
    })
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <button
        className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__notifications slds-global-actions__item-action"
        id="header-notifications-popover-id"
        type="button"
        aria-live="assertive"
        aria-haspopup="dialog"
      >
        <svg
          focusable="false"
          data-key="down"
          aria-hidden="true"
          className="slds-icon"
        >
          <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#notification"></use>
        </svg>
        <span className="slds-assistive-text">{info?.unReadCount} new notifications</span>
      </button>
      {info?.unReadCount > 0 && (
        <span
          aria-hidden="true"
          className="slds-notification-badge slds-incoming-notification slds-show-notification"
        >
          {info?.unReadCount}
        </span>
      )}
    </>
  );
};
