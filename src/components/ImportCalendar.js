import { AccessTokenContext, UserContext } from "@/pages/home";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Heading,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";

export default function ImportCalendar({
  googleCalList,
  selectedCalendar,
  events,
  setEvents,
  setEditCalendarModal,
}) {
  const { user } = useUser();
  const [google, setGoogle] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  const checkedItem = (e) => {
    const id = e.target.id;
    const existingCal = [...google];
    const index = existingCal.indexOf(id);
    existingCal.includes(id)
      ? existingCal.splice(index, 1)
      : existingCal.push(id);
    setGoogle(existingCal);
  };

  const handleImport = () => {
    handleGoogleEventApi();
  };

  const handleGoogleEventApi = async () => {
    setIsImporting(true);
    const sub = user.sub.split("|")[0];
    const id = user.sub.split("|")[1];
    const response = await axios.post(
      `${process.env.SERVER}/googleCal/${sub}/${id}/${currUser.id}`,
      {
        selectedCalendarIds: google,
        dbCalendarId: selectedCalendar.id,
        event: events,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setEvents((prev) => [...prev, ...response.data]);
    setEditCalendarModal(false);
    setIsImporting(false);
  };

  return (
    <Box>
      <Heading as="h2" size="md" mb={2}>
        Calendars
      </Heading>
      <Text>Google</Text>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        style={{
          border: "1px solid gray",
          padding: "10px",
          borderRadius: "10px",
        }}
        align="stretch"
      >
        {googleCalList &&
          googleCalList.map((cal) => (
            <Checkbox key={cal.id} id={cal.id} onChange={checkedItem}>
              {cal.summary}
            </Checkbox>
          ))}
      </VStack>
      <Button
        isLoading={isImporting}
        colorScheme="teal"
        minWidth="100%"
        mt={2}
        isDisabled={google.length === 0 && true}
        onClick={handleImport}
      >
        Import
      </Button>
    </Box>
  );
}
