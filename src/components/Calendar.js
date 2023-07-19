import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { AccessTokenContext, UserContext } from "../pages/home/index";
import axios from "axios";
import { useRouter } from "next/router";
import AddEventModal from "./AddEventModal";
import EditEventDrawer from "./EditEventDrawer";
import EditCalendarModal from "./EditCalendarModal";
import InviteMembersModal from "./InviteMembersModal";

const Views = {
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
};

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
  const router = useRouter();
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  useEffect(() => {
    if (selectedDate.toLocaleDateString() !== today.toLocaleDateString()) {
      calendarRef.current.getApi().select(new Date(selectedDate));
    }
  }, [selectedDate]);

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
    <div style={{ width: "100%", padding: "0 20px 0 0" }}>
      <Flex justifyContent="space-between" alignItems="center" paddingY="12px">
        <DateNavigations
          calendarRef={calendarRef}
          Views={Views}
          selectedView={selectedView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedMonth={setSelectedMonth}
          today={today}
        />
        <div>
          <Tabs variant="soft-rounded" colorScheme="green" defaultIndex={2}>
            <TabList>
              <Tab
                onClick={() => {
                  calendarRef.current.getApi().changeView("timeGridDay");
                  calendarRef.current.getApi().gotoDate(selectedDate);
                  setSelectedView(Views.Day);
                }}
              >
                Day
              </Tab>
              <Tab
                onClick={() => {
                  calendarRef.current.getApi().changeView("timeGridWeek");
                  setSelectedView(Views.Week);
                  setSelectedMonth(
                    new Date(
                      calendarRef.current.calendar.currentData.currentDate
                    )
                  );
                  setSelectedDate(
                    new Date(
                      calendarRef.current.calendar.currentData.currentDate
                    )
                  );
                }}
              >
                Week
              </Tab>
              <Tab
                onClick={() => {
                  calendarRef.current.getApi().changeView("dayGridMonth");
                  setSelectedView(Views.Month);
                  setSelectedMonth(
                    new Date(
                      calendarRef.current.calendar.currentData.currentDate
                    )
                  );
                  setSelectedDate(
                    new Date(
                      calendarRef.current.calendar.currentData.currentDate
                    )
                  );
                }}
              >
                Month
              </Tab>
              <Tab
                onClick={() => {
                  calendarRef.current.getApi().changeView("multiMonthYear");
                  setSelectedView(Views.Year);
                }}
              >
                Year
              </Tab>
            </TabList>
          </Tabs>
        </div>
        <Flex alignItems="center" gap={3} zIndex={999}>
          <Tooltip
            label={
              calendarUsers?.length > 0 && (
                <Stack>
                  {calendarUsers?.map((user) => (
                    <Text key={user.id}>{user.name}</Text>
                  ))}
                </Stack>
              )
            }
          >
            <AvatarGroup max={3}>
              {calendarUsers &&
                calendarUsers.map((user) => (
                  <Avatar
                    key={user.id}
                    name={user && user.name}
                    src={user && user.avatarUrl}
                    bg="teal.500"
                  />
                ))}
            </AvatarGroup>
          </Tooltip>
          <Button
            colorScheme="teal"
            onClick={() => setAddEventModal((prev) => !prev)}
          >
            Add Event
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<SettingsIcon />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={() => router.push(`/profile/${currUser.id}`)}>
                Profile Setting
              </MenuItem>
              <MenuItem onClick={() => setEditCalendarModal((prev) => !prev)}>
                Calendar Setting
              </MenuItem>
              <MenuItem onClick={() => setInviteMembersModal((prev) => !prev)}>
                Invite Members
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => router.push("/api/auth/logout")}>
                <p className="text-red-500 font-bold">Logout</p>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
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
        events={events}
        editable={true}
        eventResizableFromStart={true}
        eventResize={handleEventResize}
        droppable={true}
        eventDrop={handleEventDrop}
        dayMaxEvents={true}
        selectable={true}
        select={handleSelectSlots}
        height={"80vh"}
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

const DateNavigations = ({
  calendarRef,
  Views,
  selectedView,
  selectedDate,
  setSelectedDate,
  setSelectedMonth,
  today,
}) => {
  return (
    <div>
      <IconButton
        variant="ghost"
        colorScheme="teal"
        aria-label="Previous"
        icon={<ArrowLeftIcon />}
        onClick={() => {
          calendarRef.current.getApi().prev();
          if (selectedView === Views.Day) {
            setSelectedDate((prev) => subDays(prev, 1));
            setSelectedMonth((prev) => subDays(prev, 1));
          } else if (selectedView === Views.Week) {
            setSelectedMonth((prev) => {
              setSelectedDate(subWeeks(prev, 1));
              return subWeeks(prev, 1);
            });
          } else if (selectedView === Views.Month) {
            setSelectedMonth((prev) => {
              setSelectedDate(subMonths(prev, 1));
              return subMonths(prev, 1);
            });
          } else if (selectedView === Views.Year) {
            setSelectedMonth((prev) => {
              setSelectedDate(subYears(prev, 1));
              return subYears(prev, 1);
            });
          }
        }}
      />
      <Button
        variant="ghost"
        colorScheme="teal"
        aria-label="Today"
        isDisabled={
          today.toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
            ? true
            : false
        }
        onClick={() => {
          calendarRef.current.getApi().today();
          setSelectedMonth(new Date());
          setSelectedDate(new Date());
        }}
      >
        Today
      </Button>
      <IconButton
        variant="ghost"
        colorScheme="teal"
        aria-label="Next"
        icon={<ArrowRightIcon />}
        onClick={() => {
          calendarRef.current.getApi().next();
          if (selectedView === Views.Day) {
            setSelectedDate((prev) => addDays(prev, 1));
            setSelectedMonth((prev) => addDays(prev, 1));
          } else if (selectedView === Views.Week) {
            setSelectedMonth((prev) => {
              setSelectedDate(addWeeks(prev, 1));
              return addWeeks(prev, 1);
            });
          } else if (selectedView === Views.Month) {
            setSelectedMonth((prev) => {
              setSelectedDate(addMonths(prev, 1));
              return addMonths(prev, 1);
            });
          } else if (selectedView === Views.Year) {
            setSelectedMonth((prev) => {
              setSelectedDate(addYears(prev, 1));
              return addYears(prev, 1);
            });
          }
        }}
      />
    </div>
  );
};
