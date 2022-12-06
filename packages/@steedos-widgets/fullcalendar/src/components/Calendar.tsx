import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export const Calendar = (props) => {
  return (
    <FullCalendar 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      {...props}
    />
  )
}