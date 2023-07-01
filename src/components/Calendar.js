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
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
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

const eventLists = [
  {
    title: "Meeting 1",
    start: moment("2023-06-11T12:00:00").toDate(),
    end: moment("2023-06-11T13:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 3",
    start: moment("2023-06-11T13:00:00").toDate(),
    end: moment("2023-06-11T14:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 4",
    start: moment("2023-06-11T14:00:00").toDate(),
    end: moment("2023-06-11T15:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 5",
    start: moment("2023-06-11T15:00:00").toDate(),
    end: moment("2023-06-11T16:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 6",
    start: moment("2023-06-11T16:00:00").toDate(),
    end: moment("2023-06-11T17:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 7",
    start: moment("2023-06-11T17:00:00").toDate(),
    end: moment("2023-06-11T18:00:00").toDate(),
    backgroundColor: "#77DD77",
    borderColor: "#77DD77",
    allDay: false,
  },
  {
    title: "Meeting 2",
    start: moment("2023-06-12T12:00:00").toDate(),
    end: undefined,
    backgroundColor: "#DD77DD",
    borderColor: "#DD77DD",
    allDay: true,
  },
];

const Views = {
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
};

export default function Calendar({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  calendarRef,
  selectedCalendarId,
}) {
  const [events, setEvents] = useState([]);
  const [selectedView, setSelectedView] = useState(Views.Month);
  const [addEventModal, setAddEventModal] = useState(false);

  // const calendarRef = createRef();
  const today = new Date();

  const router = useRouter();

  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  useEffect(() => {
    if (selectedDate.toLocaleDateString() !== today.toLocaleDateString()) {
      // calendarRef.current.calendar.select(new Date("22/06/23"));
      calendarRef.current.getApi().select(new Date(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    selectedCalendarId && getCalendarEventsApi(selectedCalendarId);
  }, [selectedCalendarId]);

  const getCalendarEventsApi = async (calendarId) => {
    const res = await axios.get(
      `http://localhost:8080/calendar/${calendarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data.Events);
    setEvents(res.data.Events);
  };

  const handleEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    // change database date upon resizing
    console.log("Event Resize: ", event.start, event.end);
  };

  const handleEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;
    // change database date upon drag and drop
    console.log("Event DnD: ", event.start, event.end);
  };

  const handleSelectSlots = (selectSlotInfo) => {
    console.log("handle select");
    // const newEvent = {
    //   title: "Meeting Testing",
    //   start: selectSlotInfo.start,
    //   end: selectSlotInfo.end,
    //   backgroundColor: "#77DD77",
    //   borderColor: "#77DD77",
    //   allDay: false,
    // };

    // setEvents([...events, newEvent]);
  };

  const handleEventClick = (info) => {
    console.log(info.event.title);
    console.log(info.event.start);
    console.log(info.event.end);
    console.log(info.event.backgroundColor);
    console.log(info.event.borderColor);
    console.log(info.event.allDay);
  };

  // To be deleted
  const handleTestButton = () => {
    // console.log(calendarRef.current.calendar.currentData);
    // console.log(calendarRef.current.calendar.currentData.viewTitle);
    // setSelectedDate(
    //   new Date(calendarRef.current.calendar.currentData.viewTitle)
    // );
    async function getUser() {
      const res = await fetch("http://localhost:8080/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = await res.json();
      console.log(users);
    }
    getUser();
  };

  return (
    <div style={{ width: "100%", padding: "0 20px 0 0" }}>
      <Flex justifyContent="space-between" alignItems="center" paddingY="12px">
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
                }}
              >
                Week
              </Tab>
              <Tab
                onClick={() => {
                  calendarRef.current.getApi().changeView("dayGridMonth");
                  setSelectedView(Views.Month);
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
          <Tooltip label={currUser && currUser.name}>
            <Avatar
              name={currUser && currUser.name}
              src={currUser && currUser.avatarUrl}
              bg="teal.500"
            />
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
              <MenuItem>Profile Setting</MenuItem>
              <MenuItem>Calendar Setting</MenuItem>
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
        // weekends={false}
        headerToolbar={false}
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
        // eventMouseEnter={handleEventClick}
        // eventContent={renderEventContent}
      />
      <AddEventModal
        addEventModal={addEventModal}
        setAddEventModal={setAddEventModal}
      />
      <button onClick={handleTestButton}>Test</button> {/* To be deleted */}
    </div>
  );
}
