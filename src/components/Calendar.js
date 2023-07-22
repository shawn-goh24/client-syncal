import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { useState } from "react";
import { Flex, useMediaQuery } from "@chakra-ui/react";
import { AccessTokenContext } from "../pages/home/index";
import axios from "axios";
import AddEventModal from "./AddEventModal";
import EditEventDrawer from "./EditEventDrawer";
import EditCalendarModal from "./EditCalendarModal";
import InviteMembersModal from "./InviteMembersModal";
import DateNavigations from "./ui/DateNavigations";
import CalendarViewsTab from "./ui/CalendarViewsTab";
import AvatarEventMenu from "./ui/AvatarEventMenu";
import { Views } from "@/constants";

export default function Calendar({
  selectedDate,
  setSelectedDate,
  setSelectedMonth,
  calendarRef,
  selectedCalendar,
  setCalendars,
  googleCalList,
  setSelectedCalendar,
  getEventListApi,
}) {
  const [events, setEvents] = useState([]);
  const [selectedView, setSelectedView] = useState(Views.Month);
  const [addEventModal, setAddEventModal] = useState(false);
  const [editEventDrawer, setEditEventDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [editCalendarModal, setEditCalendarModal] = useState(false);
  const [inviteMembersModal, setInviteMembersModal] = useState(false);
  const [calendarUsers, setCalendarUsers] = useState([]);
  const today = new Date();
  const [isPhoneSize] = useMediaQuery("(max-width: 500px)");
  const accessToken = useContext(AccessTokenContext);

  useEffect(() => {
    if (selectedDate.toLocaleDateString() !== today.toLocaleDateString()) {
      calendarRef.current.getApi().select(new Date(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    isPhoneSize && calendarRef.current.getApi().changeView("timeGridWeek");
  }, [isPhoneSize]);

  useEffect(() => {
    if (selectedCalendar) {
      getCalendarEventsApi(selectedCalendar.id);
      getAllUserInCalendarApi(selectedCalendar.id);
    }
  }, [selectedCalendar]);

  const getAllUserInCalendarApi = async (calendarId) => {
    const res = await axios.get(
      `${process.env.SERVER}/calendar/users/${calendarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setCalendarUsers(res.data[0].Users);
  };

  const getCalendarEventsApi = async (calendarId) => {
    const res = await axios.get(
      `${process.env.SERVER}/calendar/${calendarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setEvents(res.data.Events);
  };

  const editEventApi = async (eventId, editedValues) => {
    const editedEvent = await axios.put(
      `${process.env.SERVER}/event/edit/${eventId}`,
      { editedValues },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    getEventListApi(selectedCalendar.id);
  };

  const handleEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    // change database date upon resizing
    let start = event.start;
    let end = event.end;
    if (event.allDay) {
      start = moment(event.start).format("YYYY-MM-DD");
      end = moment(event.end).format("YYYY-MM-DD");
    }

    editEventApi(event.id, { start: start, end: end });
  };

  const handleEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;
    let start = event.start;
    let end = event.end;
    if (event.allDay) {
      start = moment(event.start).format("YYYY-MM-DD");
      end = moment(event.end).format("YYYY-MM-DD");
    }

    editEventApi(event.id, { start: start, end: end });
  };

  const handleSelectSlots = (selectSlotInfo) => {
    console.log("handle select");
  };

  const handleEventClick = (info) => {
    setEditEventDrawer((prev) => !prev);
    setSelectedEvent(info.event);
  };

  return (
    <div className="bg-slate-50 w-full pr-1">
      <Flex className="justify-between items-center py-[12px]">
        <DateNavigations
          calendarRef={calendarRef}
          selectedView={selectedView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedMonth={setSelectedMonth}
          today={today}
        />
        <CalendarViewsTab
          calendarRef={calendarRef}
          setSelectedView={setSelectedView}
          selectedDate={selectedDate}
          setSelectedMonth={setSelectedMonth}
          setSelectedDate={setSelectedDate}
        />
        <AvatarEventMenu
          calendarUsers={calendarUsers}
          setAddEventModal={setAddEventModal}
          setEditCalendarModal={setEditCalendarModal}
          setInviteMembersModal={setInviteMembersModal}
        />
      </Flex>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
          listPlugin,
        ]}
        initialView={"dayGridMonth"}
        headerToolbar={
          isPhoneSize ? { start: "", center: "title", end: "" } : false
        }
        events={events}
        editable={true}
        eventResizableFromStart={true}
        eventResize={handleEventResize}
        droppable={true}
        eventDrop={handleEventDrop}
        dayMaxEvents={true}
        selectable={true}
        select={handleSelectSlots}
        height={"92vh"}
        eventClick={handleEventClick}
      />
      <AddEventModal
        addEventModal={addEventModal}
        setAddEventModal={setAddEventModal}
        selectedCalendarId={selectedCalendar?.id}
        setEvents={setEvents}
        getEventListApi={getEventListApi}
        selectedCalendar={selectedCalendar}
      />
      <EditEventDrawer
        editEventDrawer={editEventDrawer}
        setEditEventDrawer={setEditEventDrawer}
        selectedEvent={selectedEvent}
        editEventApi={editEventApi}
        events={events}
        setEvents={setEvents}
        selectedCalendarId={selectedCalendar?.id}
        getEventListApi={getEventListApi}
      />
      <EditCalendarModal
        editCalendarModal={editCalendarModal}
        setEditCalendarModal={setEditCalendarModal}
        selectedCalendar={selectedCalendar}
        setCalendars={setCalendars}
        googleCalList={googleCalList}
        setEvents={setEvents}
        events={events}
        setSelectedCalendar={setSelectedCalendar}
      />
      <InviteMembersModal
        inviteMembersModal={inviteMembersModal}
        setInviteMembersModal={setInviteMembersModal}
        selectedCalendar={selectedCalendar}
      />
    </div>
  );
}
