/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-22 17:26:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-05 18:43:18
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
                            data: createObject(data, defaultsDeep(openData, data))
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
        <Dropdown menu={{items: menu}} trigger={trigger} onOpenChange={onOpenChange} placement={placement} overlayClassName={overlayClassName} arrow={arrow}>
          <button className={`slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small ${className ? className : ''}`}>
            <svg className="w-4 h-4 fill-gray-500"><use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use></svg>
          </button>
        </Dropdown>
      )
}