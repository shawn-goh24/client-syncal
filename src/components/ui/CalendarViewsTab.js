import { Select, Tab, TabList, Tabs, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Views } from "@/constants";

export default function CalendarViewsTab({
  calendarRef,
  setSelectedView,
  selectedDate,
  setSelectedMonth,
  setSelectedDate,
}) {
  const [isPhoneSize] = useMediaQuery("(max-width: 500px)");

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

  const handleViewChange = (e) => {
    if (e.target.value === "Day") handleDay();
    else if (e.target.value === "Week") handleWeek();
    else if (e.target.value === "Month") handleMonth();
    else if (e.target.value === "Year") handleYear();
  };

  return (
    <>
      <div className={isPhoneSize ? "hidden" : ""}>
        <Tabs variant="soft-rounded" colorScheme="green" defaultIndex={2}>
          <TabList>
            <Tab onClick={handleDay}>Day</Tab>
            <Tab onClick={handleWeek}>Week</Tab>
            <Tab onClick={handleMonth}>Month</Tab>
            <Tab onClick={handleYear}>Year</Tab>
          </TabList>
        </Tabs>
      </div>
      <div className={!isPhoneSize ? "hidden" : ""}>
        <Select defaultValue="Week" onChange={handleViewChange}>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Select>
      </div>
    </>
  );
}
