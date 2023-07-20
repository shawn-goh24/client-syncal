import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import MiniCalendar from "./ui/MiniCalendar";
import "react-day-picker/dist/style.css";
import EventLists from "./EventLists";

export default function InfoBar({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  calendarRef,
  selectedCalendar,
  getEventListApi,
  eventList,
}) {
  useEffect(() => {
    if (selectedCalendar) {
      getEventListApi(selectedCalendar.id);
    }
  }, [selectedCalendar]);

  return (
    <div
      style={{ width: "300px", maxHeight: "100vh" }}
      className="bg-gradient-to-t from-slate-100 to-slate-50"
    >
      <MiniCalendar
        calendarRef={calendarRef}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <Accordion defaultIndex={[0]} allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Upcoming Events
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            maxHeight="calc(100vh - 394px)"
            pb={4}
            overflowY="scroll"
          >
            <EventLists events={eventList} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
