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
import { AmisRender } from "@/components/AmisRender";
import { getDefaultRenderData } from '@/lib/amis';

const schema = require('@/amis/app_launcher.amis.json');

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
        width:"100%",
        centered: true,
        style: formFactor === 'SMALL' ?  {
          top: '0px',
          margin: '0px',
          width: "100%",
          maxWidth: "100%",
          height: "100%",
        } : {
          width: "90%",
          maxWidth: "90%",
          height: "90%",
        },
        bodyStyle: {padding: "0px"},
        children: <AppLauncher router={router}></AppLauncher>
    }, {}));
  }

  const defData = getDefaultRenderData();
  schema.data = Object.assign({},schema.data,defData)
  const buttonSchema = {
      "label": "",
      "type": "button",
      "actionType": "dialog",
      "className": "",
      "body": [
        {
          "type": "tpl",
          "className": "align-text-top",
          "tpl": "<button aria-haspopup='true' title='Open App Launcher' class='slds-button slds-icon-waffle_container slds-context-bar__button' title='Open App Launcher' type='button'><span class='slds-icon-waffle'><span class='slds-r1'></span><span class='slds-r2'></span><span class='slds-r3'></span><span class='slds-r4'></span><span class='slds-r5'></span><span class='slds-r6'></span><span class='slds-r7'></span><span class='slds-r8'></span><span class='slds-r9'></span></span></button>"
        }
      ],
      "dialog": {
        "size": "xl",
        "title": {
          "type": "tpl",
          "tpl": "应用程序启动器",
          "className": "block text-xl text-center"
        },
        "actions": [],
        "body": schema
      }
    }

  return (
    <>
      <AmisRender
        id="amis-nav"
        schema={buttonSchema}
        router={router}
        className=''
        data={{}}
      ></AmisRender>
    </>
  );
};
