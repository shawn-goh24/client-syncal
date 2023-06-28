import React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useNavigation } from "react-day-picker";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function MiniCalendar({
  calendarRef,
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
}) {
  const CustomCaption = (props) => {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <h2>{format(props.displayMonth, "MMM yyy")}</h2>
        <Flex>
          <IconButton
            variant="ghost"
            colorScheme="teal"
            aria-label="Previous"
            disabled={!previousMonth}
            onClick={() => {
              if (previousMonth) {
                goToMonth(previousMonth);
                calendarRef.current.getApi().prev();
              }
            }}
            icon={<ChevronLeftIcon />}
          >
            Previous
          </IconButton>
          <IconButton
            variant="ghost"
            colorScheme="teal"
            aria-label="Next"
            disabled={!nextMonth}
            onClick={() => {
              if (previousMonth) {
                goToMonth(nextMonth);
                calendarRef.current.getApi().next();
              }
            }}
            icon={<ChevronRightIcon />}
          >
            Next
          </IconButton>
        </Flex>
      </Flex>
    );
  };

  return (
    <DayPicker
      mode="single"
      required
      showOutsideDays
      fixedWeeks
      selected={selectedDate}
      onSelect={setSelectedDate}
      month={selectedMonth}
      onMonthChange={setSelectedMonth}
      components={{
        Caption: CustomCaption,
      }}
    />
  );
}
