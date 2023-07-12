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
  // const [calendars, setCalendars] = useState();
  const [addCalendarModal, setAddCalendarModal] = useState(false);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  const handleSelectGroup = (cal) => {
    console.log(cal);
    setSelectedCalendar(cal);
  };

  const getGroupsApi = async (userId) => {
    const res = await axios.get(`http://localhost:8080/user/group/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log(res.data.Calendars);
    setCalendars(res.data.Calendars);
    setSelectedCalendar(res.data.Calendars[0]);
  };

  useEffect(() => {
    currUser && getGroupsApi(currUser.id);
  }, [currUser]);

  return (
    <Box bg="blue.100" width="100px" minHeight="100vh">
      <Center py="10px">
        <Image src={syncalLogo} alt="Syncal Logo" width={50} height={50} />
      </Center>
      <Center h="1px" border="1px solid gray" m="0 0 10px 0" />
      <Center flexDirection="column">
        {calendars &&
          calendars.map((calendar, id) => (
            <Box
              width="100%"
              pl="15px"
              key={calendar.id}
              style={{ position: "relative" }}
            >
              <Tooltip hasArrow label={calendar.name} placement="right">
                <Box boxSize="50px" my="6px">
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
                </Box>
              </Tooltip>
              <div
                className={
                  selectedCalendar.id === calendar.id ? "block" : "hidden"
                }
                style={{
                  width: "5px",
                  height: "50px",
                  backgroundColor: "red",
                  position: "absolute",
                  borderRadius: "5px 0px 0px 5px",
                  top: 6,
                  right: 0,
                }}
              />
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
      />
    </Box>
  );
}
// "bg-fuchsia-300 rounded-xl" : "bg-slate-500 rounded-full transition-all hover:bg-fuchsia-300 hover:rounded-xl hover:cursor-pointer"
