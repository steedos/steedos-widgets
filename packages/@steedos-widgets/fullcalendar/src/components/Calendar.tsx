/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-24 21:12:55
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
  


  // forceEventDuration属性设置为true修正了把全天事件拖动变更到非全天事件时end为空造成的事件在画布上看不到的问题。
  return (
    <FullCalendarReact 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      headerToolbar={{
        left: 'title',
        center: '',
        right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
    />
  )
}