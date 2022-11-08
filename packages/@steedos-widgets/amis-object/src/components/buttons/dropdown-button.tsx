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

const getMenu = (render, buttons, props)=>{
    return <Menu
    items={map(buttons, (button)=>{
        button.className = button.className
        return {
            key: button.name,
            className: 'py-0 w-32',
            label: (
              <>
                {render('body', button, props)}
              </>
            )
          }
    }) as any}
  />
}

export const SteedosDropdownButton = (props)=>{
    const { data, render, className, buttons, placement, onOpenApi, store, env } = props;

const [menu, setMenu] = useState(<></>);
    
    const onOpenChange = (open)=>{
        if(open){
            if(onOpenApi){
                try {
                    env.fetcher(onOpenApi, createObject(data, {})).then(result => {
                        const openData = result?.hasOwnProperty('ok') ? result.data : result;
                        setMenu(getMenu(render, buttons, {
                            data: createObject(data, defaultsDeep(openData, data))
                        }))
                      }).catch((e)=>{
                        console.error(e)
                      })
                } catch (error) {
                    console.error(error)
                }
            }else{
                setMenu(getMenu(render, buttons, {
                    data: data
                }))
            }
        }
    }
    return (
        <Dropdown overlay={menu} trigger={['click']} onOpenChange={onOpenChange} placement={placement}>
          <button className="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small">
            <svg className="slds-button__icon slds-button__icon_hint slds-button__icon_small" ariaHidden="true"><use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use></svg>
          </button>
        </Dropdown>
      )
}