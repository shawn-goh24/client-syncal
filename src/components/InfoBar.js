import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import MiniCalendar from "./ui/MiniCalendar";
import "react-day-picker/dist/style.css";
import EventLists from "./EventLists";
import { SearchIcon } from "@chakra-ui/icons";
import useDebounce from "@/hooks/useDebounce";
import { AccessTokenContext } from "@/pages/home";
import axios from "axios";

export default function InfoBar({
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  calendarRef,
  selectedCalendar,
  getEventListApi,
  eventList,
  setEventList,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [isPhoneSize] = useMediaQuery("(max-width: 500px)");
  const accessToken = useContext(AccessTokenContext);
  useDebounce(() => queryEventListApi(selectedCalendar.id), 1000, [
    searchInput,
  ]);

  const queryEventListApi = async (calendarId) => {
    const res = await axios.get(
      `${process.env.SERVER}/calendar/${calendarId}/list/?title=${searchInput}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setEventList(res.data);
  };

  useEffect(() => {
    if (selectedCalendar) {
      getEventListApi(selectedCalendar.id);
      setSearchInput("");
    }
  }, [selectedCalendar]);

  return (
    <div
      className={
        isPhoneSize
          ? "hidden"
          : "bg-gradient-to-t from-slate-200 to-slate-50 max-h-screen w-[300px]"
      }
    >
      <MiniCalendar
        calendarRef={calendarRef}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <div className="mx-1">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            size="sm"
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>
      </div>
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
