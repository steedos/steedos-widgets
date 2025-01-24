import React, { useEffect, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchMenus } from '../services/menuService';
import { ThemedSiderV2 } from '@refinedev/antd';
import { forEach } from 'lodash';
import { useGo } from '@refinedev/core';
import { AmisRender } from './AmisRender';
import { Typography } from 'antd';

const { Text } = Typography;

function transformToPages(data: any[]) {
    if(!data){
        return []
    }
    // 用一个 Map 来存储分组后的数据
    const groupMap = new Map();
  
    data.forEach(item => {
        const group = item.group || '未分类';
        if (!groupMap.has(group)) {
            groupMap.set(group, {
                name: group,
                key: group,
                label: group,
                children: []
            });
        }
  
        const page: any = {
            name: item.name,
            key: item.id,
            label: item.name,
            // icon: "far fa-address-book", //item.icon
            url: item.id, //item.path,
            // Check if the item is a link and set the 'link' property instead of 'url'
            ...(item.type === 'url' ? { link: item.path } : {})
        };
  
        if(item.type === 'object'){
          page.label = <Link to={`${item.path}/grid/all`}>{page.name}</Link>
        }
  
        if(item.type === 'url'){
          if(page.link){
            page.link = page.link.replace("${context.user.spaceUserId}", "HQEK9dWZKyJGaCQdg").replace("${global.user.spaceId}", (window as any).Builder.settings.context.tenantId)
            page.label = <Link to={page.link}>{page.name}</Link>
          }
        }
  
        groupMap.get(group).children.push(page);
    });
  
    // 将 Map 转换回数组
    console.log('transformToPages', Array.from(groupMap.values()))
    return Array.from(groupMap.values());
  }

const DynamicMenu = () => {
    interface MenuItem {
        id: string;
        title: string;
        path: string;
    }
    const [menus, setMenus] = useState<MenuItem[]>([]);
    let { appId = 's3' } = useParams();
    
    //TODO 目前无法获取admin的菜单, 先重置appId为固定值
    if(appId === 'admin'){
        appId = 's3'
    }

    console.log(`appId:`, appId)
    useEffect(() => {
        const loadMenus = async () => {
            try {
                const menuData = await fetchMenus(appId!);
                setMenus(menuData);
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };
        loadMenus();
    }, []);

    console.log(`menus`, menus)

    const menuItems = transformToPages((menus as any).children);

    // icon,
    //     label,
    //     route,
    //     key,
    //     name,
    //     children,
    //     parentName,
    //     meta,
    //     options,

    // const meta = [
    //     {
    //       name: "App",
    //       list: "/app/:appId/:objectName/grid/:listviewId",
    //       show: "/app/:appId/:objectName/view/:recordId",
    //       meta: {
    //         canDelete: true,
    //         label: "哈哈哈Label",
    //         headers: {
    //           authorization: "Bearer 675a8b075c86a9ad38333f97,ea3cdc716fb0f9cb3b183f62a57194b640dbc9dbb923e2463f9d489dd84aff4fa7fac46a1a3eb675b7d6b4"
    //         }
    //       },
    //     }
    //   ]



    // return <ThemedSiderV2 meta={meta as any} Title={(props) => <>{(menus as any).name}</>} fixed ></ThemedSiderV2>
    console.log(`menuItems`, menuItems)
    const [current, setCurrent] = useState('mail');
    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };

    if(menuItems.length ==0){
        return
    }

    return <div style={{ width: 256}}>
        <div style={{background: '#fff', height: 64, alignItems: 'center', display: 'flex'}}>
        <AmisRender schema={{
                  "columnClassName": "items-center flex pb-0",
                  "body": [
                      {
                          "type": "steedos-app-launcher",
                          "showAppName": true,
                          "appId": appId,
                      }
                  ],
                  "md": "auto",
                  "valign": "middle"
              }} data ={{
                context: {
                    rootUrl: "/backend",
                    app: appId,
                    appId: appId,
                    app_id: appId,
                    tenantId:"617a0127e410310030c0b95f",
                    userId:"Tt4hK3NpmDr5WjxFx",
                    authToken: "ea3cdc716fb0f9cb3b183f62a57194b640dbc9dbb923e2463f9d489dd84aff4fa7fac46a1a3eb675b7d6b4",
                    user: {
                      spaceId: "617a0127e410310030c0b95f",
                      userId:"Tt4hK3NpmDr5WjxFx",
                    }
                  },
                  app: appId,
                  appId: appId,
                  app_id: appId,
            }} env = {{}} ></AmisRender>
            <Text strong={true} style={{fontSize: 16}}>{(menus as any).name}</Text>
        </div>
        <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={menuItems} style={{ marginTop: 0 }}/>
    </div>;
};

export default DynamicMenu;
