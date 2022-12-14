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

  const dispatchEvent = async (action: string, value?: object) => {

    if (!amisDispatchEvent) return;

    const rendererEvent = await amisDispatchEvent(
      action,
      value ? createObject(amisData, value) : amisData
    );

    return rendererEvent?.prevented ?? false;
  }

  const handleGetEvents = (fetchInfo, successCallback, failureCallback)=> {
    dispatchEvent('getEvents', {fetchInfo, successCallback, failureCallback})
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

  return (
    <FullCalendarReact 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
      events={handleGetEvents}
      select={handleSelect}
      eventClick={handleEventClick}
      eventsSet={handleEventsSet}
      eventAdd={handleEventAdd}
      eventChange={handleEventChange}
      eventRemove={handleEventRemove}
      {...props}
    />
  )
}