import React, { useContext, useEffect, useState } from "react";
import syncalLogo from "../assets/syncal-logo.svg";
import { Box, Center, IconButton, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import { AccessTokenContext, UserContext } from "@/pages/home";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import AddCalendarModal from "./AddCalendarModal";

export default function Sidebar({
  selectedCalendar,
  setSelectedCalendar,
  calendars,
  setCalendars,
}) {
  const [addCalendarModal, setAddCalendarModal] = useState(false);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  const handleSelectGroup = (cal) => {
    setSelectedCalendar(cal);
  };

  const getGroupsApi = async (userId, newCalendar) => {
    const res = await axios.get(`${process.env.SERVER}/user/group/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setCalendars(res.data.Calendars);
    if (newCalendar) {
      setSelectedCalendar(res.data.Calendars[res.data.Calendars.length - 1]);
    } else {
      setSelectedCalendar(res.data.Calendars[0]);
    }
  };

  useEffect(() => {
    currUser && getGroupsApi(currUser.id);
  }, [currUser]);

  return (
    <Box className="w-24 min-h-screen bg-gradient-to-t from-slate-100 to-slate-50 border-solid border-r-2 border-gray-300">
      <Center py="10px">
        <Image src={syncalLogo} alt="Syncal Logo" width={50} height={50} />
      </Center>
      <Center h="1px" border="1px solid gray" m="0 0 10px 0" />
      <Center flexDirection="column">
        {calendars &&
          calendars.map((calendar, id) => (
            <Box key={calendar.id} className="my-1.5 relative">
              <div
                className={
                  selectedCalendar.id === calendar.id
                    ? "block absolute -inset-0.5 my-0 bg-teal-600 rounded-lg blur opacity-75"
                    : "hidden"
                }
              />
              <Tooltip hasArrow label={calendar.name} placement="right">
                <Center boxSize="50px" className="relative">
                  {calendar.imageUrl ? (
                    <Image
                      className={
                        selectedCalendar.id === calendar.id
                          ? "group-button-active"
                          : "group-button"
                      }
                      width="50"
                      height="50"
                      src={calendar.imageUrl}
                      alt={calendar.name}
                      onClick={() => handleSelectGroup(calendar)}
                    />
                  ) : (
                    <Center
                      boxSize="50px"
                      className={
                        selectedCalendar.id === calendar.id
                          ? "group-button-active"
                          : "group-button"
                      }
                      onClick={() => handleSelectGroup(calendar)}
                    >
                      <p style={{ color: "white" }}>
                        {calendar.name.charAt(0)}
                      </p>
                    </Center>
                  )}
                </Center>
              </Tooltip>
            </Box>
          ))}
      </Center>
      <Center my="6px">
        <IconButton
          colorScheme="teal"
          aria-label="New calendar"
          size="lg"
          isRound
          icon={<AddIcon />}
          onClick={() => setAddCalendarModal((prev) => !prev)}
        />
      </Center>
      <AddCalendarModal
        addCalendarModal={addCalendarModal}
        setAddCalendarModal={setAddCalendarModal}
        setCalendars={setCalendars}
        getGroupsApi={getGroupsApi}
      />
    </Box>
  );
}
