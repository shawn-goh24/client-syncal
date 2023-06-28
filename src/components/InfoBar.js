import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import MiniCalendar from "./ui/MiniCalendar";
import "react-day-picker/dist/style.css";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

export default function InfoBar({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  calendarRef,
}) {
  // const [selectedDate, onChange] = useState(new Date());

  const testItems = (count) => {
    const content = [];
    for (let i = 0; i < count; i++) {
      content.push(<p key={i}>Insert all upcoming events</p>);
    }
    return content;
  };

  return (
    <div style={{ width: "300px", maxHeight: "100vh" }}>
      {/* <Calendar onChange={setSelectedDate} value={selectedDate} /> */}
      <MiniCalendar
        calendarRef={calendarRef}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <Accordion
        // bg="red.50"
        defaultIndex={[0]}
        allowToggle
        // position="absolute"
        // width="300px"
        // bottom="0px"
        // top="270px"
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Events - To be completed
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            maxHeight="calc(100vh - 394px)"
            pb={4}
            overflowY="scroll"
          >
            {testItems(50)}
          </AccordionPanel>
        </AccordionItem>
        {/* <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Categories?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Tasks?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem> */}
      </Accordion>
    </div>
  );
}
