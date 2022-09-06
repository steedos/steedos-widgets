/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-25 11:05:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 14:13:33
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { getNotifications, markReadAll } from '@steedos-widgets/amis-lib';
import { Dropdown, List, Menu, Button, Avatar, Tabs, Spin, message } from 'antd';
import HeaderDropdown from '@/components/HeaderDropdown';
import { getRootUrl } from '@steedos-widgets/amis-lib';
import { FromNow } from '@/components/FromNow'
const { TabPane } = Tabs;

export const Notification = ({}) => {
  const [info, setInfo] = useState(null);
  const [setTimeoutId, setSetTimeoutId] = useState(null);
  const loadData = async ()=>{
    if(setTimeoutId){
      clearTimeout(setTimeoutId);
      setSetTimeoutId(null);
    }
    getNotifications().then((result)=>{
        setInfo(result)
    }).catch((err)=>{
        console.error(err)
    }).finally(()=>{
      setSetTimeoutId(setTimeout(loadData, 30 * 1000))
    })
  }

  useEffect(() => {
    loadData();
    return ()=>{
      clearTimeout(setTimeoutId);
    }
  }, []);

  const getNotificationBox = ()=>{
    return <>
    <Spin delay={300} spinning={false} >
      <Tabs >
      <TabPane tab={"通知"}><>
        <List
        itemLayout="horizontal"
        dataSource={info?.notifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`${getRootUrl()}/avatar/${item.from}`} />}
              title={<a href={`${getRootUrl()}/api/v4/notifications/${item._id}/read`} target="_blank">{item.name}</a>}
              description={<div>
                <div className="description">{item.body}</div>
                <div className="datetime"><FromNow date={item.created}></FromNow>{!item.is_read && <abbr className="slds-text-link slds-m-horizontal_xxx-small" title="unread">●</abbr>}</div>
              </div>}
            />
          </List.Item>
        )}
      />
      {info?.unReadCount > 0 && 
        <div className="bottomBar">
        
        <div onClick={()=>{
          markReadAll().then(()=>{
            loadData();
            message.success('已全部标记为已读');
          }).catch((err)=>{
            message.error(err.error)
          })
        }}>
          全部标记为已读
        </div>
        {/* <div
          onClick={(e) => {
            //TODO
          }}
        >
          查看更多
        </div> */}
      </div>
      }
      
      </> 
    </TabPane>
      </Tabs>
    </Spin>
  </>
  }
  return (
    <>
    <HeaderDropdown
        placement="bottomRight"
        overlay={getNotificationBox()}
        trigger={['click']}
      >
        <button className="slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__notifications slds-global-actions__item-action">
        <svg
          focusable="false"
          data-key="down"
          aria-hidden="true"
          className="slds-button__icon slds-global-header__icon"
        >
          <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#notification"></use>
        </svg>
        <span className="slds-assistive-text">{info?.unReadCount} new notifications</span>
        {info?.unReadCount > 0 && (
          <span
            aria-hidden="true"
            className="slds-notification-badge slds-incoming-notification slds-show-notification"
          >
            {info?.unReadCount}
          </span>
        )}
        </button>
        </HeaderDropdown>

      
    </>
  );
};
