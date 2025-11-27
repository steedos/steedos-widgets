/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-27 17:30:58
 * @FilePath: /steedos-widgets/packages/@steedos-widgets/fullcalendar/src/components/Calendar.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useRef } from 'react'
import FullCalendarReact from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
// import multimonthPlugin from '@fullcalendar/multimonth';
import resourcePlugin from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import './Calendar.css';

import { createObject } from '@steedos-widgets/amis-lib';

export const FullCalendar = ({ 
  dispatchEvent: amisDispatchEvent, 
  data: amisData,
  ...props }
) => {
  if(!props.data){
    props.data = {}
  }
  const calendarRef = useRef();
  const initialLocaleCode = 'zh-cn';
  const dispatchEvent = async (action: string, value?: object) => {
    if (!amisDispatchEvent) return;
    const rendererEvent = await amisDispatchEvent(
      action,
      value ? createObject(amisData, value) : amisData,
      //为了解决3.2dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
      calendarRef.current
    );

    return rendererEvent?.prevented ?? false;
  }

  const handleGetEvents = (fetchInfo, successCallback, failureCallback)=> {
    // fix：控件初始 render 的时候，dispatchEvent未生效
    setTimeout(()=>{
      dispatchEvent('getEvents', {fetchInfo, successCallback, failureCallback})
    }, 100);
    
  };

  const handleSelect = (event)=> {
    dispatchEvent('select', event)
  };

  const handleEventsSet = (event)=> {
    dispatchEvent('eventsSet', event)
  };

  const handleEventClick = (event)=> {
    dispatchEvent('eventClick', event)
  };

  const handleEventAdd = (event)=> {
    dispatchEvent('eventAdd', event)
  };

  const handleEventChange = (event)=> {
    dispatchEvent('eventChange', event)
  };

  const handleEventRemove = (event)=> {
    dispatchEvent('eventRemove', event)
  };

  const handleEventDidMount = (event)=> {
    dispatchEvent('eventDidMount', event)
  };

  const handleEventWillUnmount = (event)=> {
    dispatchEvent('eventWillUnmount', event)
  };

  const handleNoEventsDidMount = (event)=> {
    dispatchEvent('noEventsDidMount', event)
  };

  const handleNoEventsWillUnmount = (event)=> {
    dispatchEvent('noEventsWillUnmount', event)
  };

  setTimeout(()=>{
    dispatchEvent('getRef', {calendarRef})
  }, 100);
  

  const handleGetRresources = (fetchInfo, successCallback, failureCallback) => {
    console.log("===handleGetRresources=====fetchInfo, successCallback, failureCallback==", fetchInfo, successCallback, failureCallback);
    
    // fix：控件初始 render 的时候，dispatchEvent未生效
    setTimeout(()=>{
      dispatchEvent('getRresources', {fetchInfo, successCallback, failureCallback})
    }, 100);
    
    
    // var rooms = [
    //   {
    //     "_id": "6925584c4985b00eca6c61d4",
    //     "enable_open": true,
    //     "owner": "692557c04985b00eca6c61d1",
    //     "locked": false,
    //     "company_id": "692557c54985b00eca6c61d3",
    //     "company_ids": [
    //       "692557c54985b00eca6c61d3"
    //     ],
    //     "name": "X1",
    //     "space": "692557c54985b00eca6c61d3",
    //     "created": "2025-11-25T07:18:36.723Z",
    //     "modified": "2025-11-25T07:18:36.723Z",
    //     "created_by": "692557c04985b00eca6c61d1",
    //     "modified_by": "692557c04985b00eca6c61d1",
    //     "admins": [
    //       "692557c04985b00eca6c61d1"
    //     ]
    //   },
    //   {
    //     "_id": "692558554985b00eca6c61d5",
    //     "enable_open": true,
    //     "owner": "692557c04985b00eca6c61d1",
    //     "locked": false,
    //     "company_id": "692557c54985b00eca6c61d3",
    //     "company_ids": [
    //       "692557c54985b00eca6c61d3"
    //     ],
    //     "name": "X2",
    //     "space": "692557c54985b00eca6c61d3",
    //     "created": "2025-11-25T07:18:45.320Z",
    //     "modified": "2025-11-25T07:18:45.320Z",
    //     "created_by": "692557c04985b00eca6c61d1",
    //     "modified_by": "692557c04985b00eca6c61d1",
    //     "admins": [
    //       "692557c04985b00eca6c61d1"
    //     ]
    //   }
    // ].map(function (item) {
    //   return {
    //     id: item._id,       // 映射 _id 到 id
    //     title: item.name,    // 映射 name 到 title
    //   }
    // });

    // successCallback(rooms);
  };

  const resourceConfig = {
    url: '/api/v1/meetingroom',
    method: 'GET',

    // 👇 V6 中推荐用于转换异步加载数据的回调函数 👇
    success: function (rawResourceData) {
      console.error("加载资源rawResourceData", rawResourceData);
      // FullCalendar 期望这个 success 函数返回最终的资源数组

      // 1. 执行你的数据转换逻辑
      const items = rawResourceData?.data?.items || [];
      const resources = items.map(item => ({
        id: item._id,       // 映射 _id 到 id
        title: item.name,    // 映射 name 到 title
      }));

      // 2. 返回转换后的资源数组
      return resources;
    },

    failure: function (error) {
      console.error("加载资源失败", error);
      // 可以返回一个空数组 [] 或抛出错误
      return [];
    }
  };
  const transformWrapper = (rawEventData: any) => {
    let event = rawEventData;
    console.log("=====transformWrapper=rawEventData==", rawEventData);

    // // 1. **执行用户可能传入的原始转换函数** (保持兼容性)
    // if (eventDataTransform) {
    //   event = eventDataTransform(event);
    // }

    // // 2. **执行你的 allDayExpr 逻辑** (自定义逻辑)
    // if (allDayExpr && typeof event[allDayExpr] !== 'undefined') {
    //   // 如果 event 中存在 allDayExpr 指定的字段 (例如 'is_all_day')
    //   // 则将其布尔值赋给 FullCalendar 要求的 'allDay' 属性
    //   event.allDay = !!event[allDayExpr];
    // }

    // 3. **执行你为解决跨天问题而添加的强制逻辑** (优先于 allDayExpr 逻辑，或者在之后执行)
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (end.getTime() - start.getTime() >= MS_PER_DAY) {
      // 如果持续时间超过一天，强制 FullCalendar 视为全天事件
      console.log("=====transformWrapper=allDay==");
      event.allDay = true;
    }

    return event;
  };
  // forceEventDuration属性设置为true修正了把全天事件拖动变更到非全天事件时end为空造成的事件在画布上看不到的问题。
  return (
    <FullCalendarReact 
      // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, resourcePlugin, resourceTimeGridPlugin]}
      headerToolbar={{
        left: 'title',
        center: '',
        // right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        right: 'prev,next today dayGridMonth,timeGridWeek,listWeek,resourceTimeGridDay'
      }}
      ref={calendarRef}
      locales={allLocales}
      locale={initialLocaleCode}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      initialView='timeGridWeek'
      events={handleGetEvents}
      select={handleSelect}
      eventClick={handleEventClick}
      eventsSet={handleEventsSet}
      eventAdd={handleEventAdd}
      eventChange={handleEventChange}
      eventRemove={handleEventRemove}
      eventDidMount={handleEventDidMount}
      eventWillUnmount={handleEventWillUnmount}
      noEventsDidMount={handleNoEventsDidMount}
      noEventsWillUnmount={handleNoEventsWillUnmount}
      forceEventDuration={true}
      {...props}
      resources={handleGetRresources}
      eventDataTransform={transformWrapper}
    />
  )
}