/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-11 16:46:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-17 16:43:11
 * @Description:
 */
import { useRouter } from 'next/router'
import { AppLauncher } from '@/components/AppLauncher'
import React, { useState, useEffect, Fragment, useRef } from 'react';


export const AppLauncherBar = ({app}) => {
  const [formFactor, setFormFactor] = useState(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFormFactor("SMALL");
    } else {
      setFormFactor("LARGE");
    }
  }, []);

  const router = useRouter()
  const openAppLauncher = () => {
    const name = 'app-launcher-modal';
    SteedosUI.Modal(Object.assign({
        name: name,
        title: `应用导航`,
        destroyOnClose: true,
        maskClosable: false,
        keyboard: false, // 禁止 esc 关闭
        footer: null,
        width: formFactor === 'SMALL' ? "100%" : "90%",
        style: formFactor === 'SMALL' ?  {
          top: '0px',
          margin: '0px',
          width: "100%",
          maxWidth: "100%",
          height: "100%",
        } : {
          width: '90%',
          maxWidth: '90%',
        },
        bodyStyle: {padding: "0px", paddingTop: "12px"},
        children: <AppLauncher router={router}></AppLauncher>
    }, {}));
  }

  return (
    <>
      <div className="slds-context-bar__primary" onClick={openAppLauncher}>
        <div className="slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger_click slds-no-hover">
          <div className="slds-context-bar__icon-action">
            <button
              aria-haspopup="true"
              className="slds-button slds-icon-waffle_container slds-context-bar__button"
              title="Open App Launcher"
              type="button"
            >
              <span className="slds-icon-waffle">
                <span className="slds-r1"></span>
                <span className="slds-r2"></span>
                <span className="slds-r3"></span>
                <span className="slds-r4"></span>
                <span className="slds-r5"></span>
                <span className="slds-r6"></span>
                <span className="slds-r7"></span>
                <span className="slds-r8"></span>
                <span className="slds-r9"></span>
              </span>
              <span className="slds-assistive-text">Open App Launcher</span>
            </button>
          </div>
          <span className="slds-context-bar__label-action slds-context-bar__app-name">
            <span className="slds-truncate" title="App Name">
              {app?.name}
            </span>
          </span>
        </div>
      </div>
    </>
  );
};
