/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-22 17:26:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-27 13:34:00
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { Dropdown, Menu } from 'antd';
import { map, defaultsDeep } from 'lodash';
import { createObject } from '@steedos-widgets/amis-lib';

const getMenu = (render, buttons, btnClassName, props)=>{
    return map(buttons, (button)=>{
      console.log(button)
      button.className = `${button.className} ${btnClassName}`
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
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m7 10 5 5 5-5z" fill="currentColor"></path></svg>
          </button>
        </Dropdown>
      )
}