import { Tab, TabList, Tabs } from "@chakra-ui/react";
import React from "react";

export default function CalendarViewsTab({
  calendarRef,
  Views,
  setSelectedView,
  selectedDate,
  setSelectedMonth,
  setSelectedDate,
}) {
  const handleDay = () => {
    calendarRef.current.getApi().changeView("timeGridDay");
    calendarRef.current.getApi().gotoDate(selectedDate);
    setSelectedView(Views.Day);
  };

  const handleWeek = () => {
    calendarRef.current.getApi().changeView("timeGridWeek");
    setSelectedView(Views.Week);
    setSelectedMonth(
      new Date(calendarRef.current.calendar.currentData.currentDate)
    );
    setSelectedDate(
      new Date(calendarRef.current.calendar.currentData.currentDate)
    );
  };

  const handleMonth = () => {
    calendarRef.current.getApi().changeView("dayGridMonth");
    setSelectedView(Views.Month);
    setSelectedMonth(
      new Date(calendarRef.current.calendar.currentData.currentDate)
    );
    setSelectedDate(
      new Date(calendarRef.current.calendar.currentData.currentDate)
    );
  };

  const handleYear = () => {
    calendarRef.current.getApi().changeView("multiMonthYear");
    setSelectedView(Views.Year);
  };

  return (
    <div>
      <Tabs variant="soft-rounded" colorScheme="green" defaultIndex={2}>
        <TabList>
          <Tab onClick={handleDay}>Day</Tab>
          <Tab onClick={handleWeek}>Week</Tab>
          <Tab onClick={handleMonth}>Month</Tab>
          <Tab onClick={handleYear}>Year</Tab>
        </TabList>
      </Tabs>
    </div>
  );
}
