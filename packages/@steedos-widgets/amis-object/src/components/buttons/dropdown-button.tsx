/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-22 17:26:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-24 17:20:59
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import { map, defaultsDeep } from 'lodash';
import { createObject } from '@steedos-widgets/amis-lib';

const getMenu = (render, buttons, props)=>{
    return <Menu
    items={map(buttons, (button)=>{
        button.className = button.className ? `${button.className} steedos-dropdown-button-item py-2` : 'steedos-dropdown-button-item py-1'
        return {
            key: button.name,
            className: 'py-0',
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
    
    console.log(`SteedosDropdownButton props`, props)
    const onOpenChange = (open)=>{
        console.log(`=============>open`, open)
        if(open){
            if(onOpenApi){
                console.log(`data=========>`, data)
                try {
                    env.fetcher(onOpenApi, createObject(data, {})).then(result => {
                        const openData = result?.hasOwnProperty('ok') ? result.data : result;
                        console.log(`openData`, openData)
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
        <Dropdown overlay={menu} trigger={['click']} onOpenChange={onOpenChange}>
            <DownOutlined />
        </Dropdown>
      )
}