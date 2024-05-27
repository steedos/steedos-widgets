/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-22 17:26:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-27 16:27:15
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { Dropdown, Menu } from 'antd';
import { map, defaultsDeep } from 'lodash';
import { createObject } from '@steedos-widgets/amis-lib';

const getMenu = (render, buttons, btnClassName, props) => {
  return map(buttons, (button) => {
    if (btnClassName) {
      button.className = `${button.className} ${btnClassName}`
    }
    if(button.visibleOnAlias){
      button.visibleOn = button.visibleOnAlias;
    }
    delete button.className;
    return {
      key: button.name,
      label: (
        <>
          {render('body', button, props)}
        </>
      )
    }
  })
}

export const SteedosDropdownButton = (props)=>{
    const { data, render, className, btnClassName, buttons, placement, trigger=['click'], onOpenApi, store, env, overlayClassName, arrow } = props;
    const [menu, setMenu] = useState([]);
    
    const onOpenChange = (open)=>{
        if(open){
            if(onOpenApi){
                try {
                    env.fetcher(onOpenApi, createObject(data, {})).then(result => {
                        const openData = result?.hasOwnProperty('ok') ? result.data : result;
                        setMenu(getMenu(render, buttons, btnClassName, {
                            data: createObject(data, defaultsDeep(openData, data, {record: data}))
                        }))
                      }).catch((e)=>{
                        console.error(e)
                      })
                } catch (error) {
                    console.error(error)
                }
            }else{
                setMenu(getMenu(render, buttons, btnClassName, {
                    data: data
                }))
            }
        }
    }
    return (
        <Dropdown menu={{items: menu}} trigger={trigger} onOpenChange={onOpenChange} placement={placement} overlayClassName={overlayClassName} arrow={arrow} getPopupContainer={
          (button) => {
            // 未配置getPopupContainer属性时，默认container为body，这里判断到dropdown button是在drawer中时，统一把container配置为drawer本身
            // 这样就可以解决drawer内点击dropdown button组件下拉菜单中的按钮时不应该自动关闭drawer的问题
            const drawerBody = (window as any).$(button).closest(".amis-dialog-widget .antd-Drawer-body")[0];
            return drawerBody || document.querySelector("body");
          }}>
          <button className={`slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small ${className ? className : ''}`}>
            <svg className="w-4 h-4 fill-gray-500"><use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use></svg>
          </button>
        </Dropdown>
      )
}