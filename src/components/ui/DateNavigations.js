import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Button, IconButton } from "@chakra-ui/react";
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
import React from "react";

export default function DateNavigations({
  calendarRef,
  Views,
  selectedView,
  selectedDate,
  setSelectedDate,
  setSelectedMonth,
  today,
}) {
  const handlePrevDate = () => {
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
  };

  const handleNextDate = () => {
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
  };

  const handleToday = () => {
    calendarRef.current.getApi().today();
    setSelectedMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div>
      <IconButton
        variant="ghost"
        colorScheme="teal"
        aria-label="Previous"
        icon={<ArrowLeftIcon />}
        onClick={handlePrevDate}
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
        onClick={handleToday}
      >
        Today
      </Button>
      <IconButton
        variant="ghost"
        colorScheme="teal"
        aria-label="Next"
        icon={<ArrowRightIcon />}
        onClick={handleNextDate}
      />
    </div>
  );
}
