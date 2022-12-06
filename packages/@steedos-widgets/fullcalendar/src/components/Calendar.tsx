import React from 'react'
import FullCalendarReact, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import './Calendar.css';

import { createObject } from '@steedos-widgets/amis-lib';

export const FullCalendar = ({ 
  dispatchEvent: amisDispatchEvent, 
  data: amisData,
  ...props }
) => {
  const initialLocaleCode = 'zh-cn';

  const handleSelect = (event)=> {

    if (!amisDispatchEvent) return;
    
    // 支持 amis action
    amisDispatchEvent(
      'select',
      createObject(amisData, {
        event
      })
    ).then((rendererEvent) => {
      console.log(rendererEvent);
    })
  };

  const handleEventsSet = (event)=> {

    if (!amisDispatchEvent) return;
    
    // 支持 amis action
    amisDispatchEvent(
      'eventsSet',
      createObject(amisData, {
        event
      })
    ).then((rendererEvent) => {
      console.log(rendererEvent);
    })
  };

  return (
    <FullCalendarReact 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'title',
        center: '',
        right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay'
      }}
      locales={allLocales}
      locale={initialLocaleCode}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      initialView='timeGridWeek'
      select={handleSelect}
      eventClick={function(){ console.error('FullCalendar: eventClick function not found.'); }}
      eventsSet={handleEventsSet}
      eventAdd={function(){ console.error('FullCalendar: eventAdd function not found.'); }}
      eventChange={function(){ console.error('FullCalendar: eventChange function not found.'); }}
      eventRemove={function(){ console.error('FullCalendar: eventRemove function not found.'); }}
      {...props}
    />
  )
}