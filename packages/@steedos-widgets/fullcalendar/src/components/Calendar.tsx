import React from 'react'
import FullCalendarReact, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import './Calendar.css';

export const FullCalendar = (props) => {
  const initialLocaleCode = 'zh-cn';
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
      {...props}
    />
  )
}