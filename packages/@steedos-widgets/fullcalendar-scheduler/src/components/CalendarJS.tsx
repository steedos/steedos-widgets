/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-22 09:31:21
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-12-03 10:44:19
 * @FilePath: /steedos-widgets/packages/@steedos-widgets/fullcalendar/src/components/Calendar.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef } from 'react'
import AmisCore from 'amis-core';
// import FullCalendarReact from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import listPlugin from '@fullcalendar/list';
// // import multimonthPlugin from '@fullcalendar/multimonth';
// import allLocales from '@fullcalendar/core/locales-all';
import './Calendar.css';

class DivWrapper extends React.Component<any> {
  render() {
    const { children, ...props } = this.props;
    return (
      <React.Fragment {...props}>
        {children}
      </React.Fragment>
    );
  }
}

export const FullCalendar = ({ 
  dispatchEvent: amisDispatchEvent, 
  data: amisData,
  ...props }
) => {
  if(!props.data){
    props.data = {}
  }

  const calendarWrapperRef = useRef(null);
  // 1. 创建一个 ref 来引用将要渲染日历的 DOM 元素
  const calendarRef = useRef(null);
  // 2. 创建一个 ref 来存储 FullCalendar 实例
  const calendarInstance = useRef(null);

  const initialLocaleCode = 'zh-cn';
  const dispatchEvent = async (action: string, value?: object) => {
    if (!amisDispatchEvent) return;
    
    const rendererEvent = await amisDispatchEvent(
      action,
      value ? AmisCore.utils.createObject(amisData, value) : amisData,
      //为了解决dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
      calendarWrapperRef.current
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

  const handleGetRresources = (fetchInfo, successCallback, failureCallback) => {
    // fix：控件初始 render 的时候，dispatchEvent未生效
    setTimeout(()=>{
      dispatchEvent('getRresources', {fetchInfo, successCallback, failureCallback})
    }, 100);
  };


  // useEffect 在组件挂载后运行
  useEffect(() => {
      // 检查全局 FullCalendar 对象是否可用
      if ((window as any).FullCalendar && calendarRef.current) {
          
          // 确保 FullCalendar 实例不存在，避免重复初始化
          if (!calendarInstance.current) {
              
              // 3. 初始化 FullCalendar 实例，使用 resourceTimelineWeek 视图
              const calendar = new (window as any).FullCalendar.Calendar(calendarRef.current, {
                  headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                  },

                  resources: handleGetRresources,
                  resourceAreaWidth: "20%",
                  
                  locale: initialLocaleCode,
                  editable: true,
                  selectable: true,
                  selectMirror: true,
                  dayMaxEvents: true,

                  initialView: 'dayGridMonth',

                  events: handleGetEvents,
                  select: handleSelect,
                  eventClick: handleEventClick,
                  eventsSet: handleEventsSet,
                  eventAdd: handleEventAdd,
                  eventChange: handleEventChange,
                  eventRemove: handleEventRemove,
                  eventDidMount: handleEventDidMount,
                  eventWillUnmount: handleEventWillUnmount,
                  noEventsDidMount: handleNoEventsDidMount,
                  noEventsWillUnmount: handleNoEventsWillUnmount,

                  forceEventDuration: true,
                  
                  // 其他任何 FullCalendar 选项...
                  ...props
              });

              // 4. 渲染日历
              calendar.render();
              
              // 5. 将实例存储到 ref 中，以便在卸载时销毁
              calendarInstance.current = calendar;
              dispatchEvent('setCalendarApi', {calendarApi: calendar})
          }
      }

      // 6. 清理函数：组件卸载时销毁 FullCalendar 实例
      return () => {
          if (calendarInstance.current) {
              calendarInstance.current.destroy();
              calendarInstance.current = null;
          }
      };
  }, []); // 空数组依赖项表示只在挂载和卸载时运行

  // forceEventDuration属性设置为true修正了把全天事件拖动变更到非全天事件时end为空造成的事件在画布上看不到的问题。
  return (
    // <FullCalendarReact 
    //   // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
    // headerToolbar={{
    //   left: 'title',
    //   center: '',
    //   right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    // }}
    //   ref={calendarRef}
    //   // locales={allLocales}
    //   locale={initialLocaleCode}
    //   editable={true}
    //   selectable={true}
    //   selectMirror={true}
    //   dayMaxEvents={true}
    //   initialView='timeGridWeek'
    //   events={handleGetEvents}
    //   select={handleSelect}
    //   eventClick={handleEventClick}
    //   eventsSet={handleEventsSet}
    //   eventAdd={handleEventAdd}
    //   eventChange={handleEventChange}
    //   eventRemove={handleEventRemove}
    //   eventDidMount={handleEventDidMount}
    //   eventWillUnmount={handleEventWillUnmount}
    //   // noEventsDidMount={handleNoEventsDidMount}
    //   // noEventsWillUnmount={handleNoEventsWillUnmount}
    //   forceEventDuration={true}
    //   {...props}
    // />
    <DivWrapper id='calendar' ref={calendarWrapperRef} {...props}><div id='calendar' ref={calendarRef}></div></DivWrapper>
  )
}