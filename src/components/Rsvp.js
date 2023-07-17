import { AccessTokenContext, UserContext } from "@/pages/home";
import { EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Button,
  Tag,
  Flex,
  IconButton,
  Tooltip,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

export default function Rsvp({ userEvent, member, selectedEvent }) {
  const [isRsvped, setIsRsvped] = useState(userEvent === null ? true : false);
  const [eventWithUser, setEventWithUser] = useState(
    userEvent ? userEvent : ""
  );
  const [rsvpCounts, setRsvpCounts] = useState({});
  const [rsvpNames, setRsvpNames] = useState({});
  const currUser = useContext(UserContext);
  const accessToken = useContext(AccessTokenContext);

  useEffect(() => {
    setIsRsvped(userEvent === null ? true : false);
    setEventWithUser(userEvent ? userEvent : "");
    console.log(userEvent);
    getRsvpCount();
    getUsersInEvent();
  }, [userEvent]);

  const editUserEventApi = async (rsvpId) => {
    const response = await axios.put(
      `${process.env.SERVER}/event/userevent/${selectedEvent.id}/${currUser.id}`,
      {
        rsvpId: rsvpId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response data", response.data);
    // console.log("userevent", eventWithUser);
    setEventWithUser(response.data);
    getRsvpCount();
    getUsersInEvent();
  };

  const getRsvpCount = async (rsvp) => {
    const rsvpCount = await axios.get(
      `${process.env.SERVER}/event/rsvpcount/${selectedEvent.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(rsvpCount.data);
    setRsvpCounts(rsvpCount.data);
  };

  const getUsersInEvent = async () => {
    const usersInEvent = await axios.get(
      `${process.env.SERVER}/event/userevent/${selectedEvent.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(usersInEvent.data.Users);
    const obj = { yes: [], no: [], maybe: [] };
    const tmp = usersInEvent.data.Users;
    tmp.map((item) => {
      if (item.UserEvent.rsvpId === 1) {
        obj.yes.push(item.name);
      } else if (item.UserEvent.rsvpId === 2) {
        obj.no.push(item.name);
      } else {
        obj.maybe.push(item.name);
      }
    });
    console.log(obj);
    setRsvpNames(obj);
  };

  const handleYes = () => {
    console.log("Yes");
    // Update userEvents rsvp number to 1
    editUserEventApi(1);
    setIsRsvped((prev) => !prev);
  };
  const handleNo = () => {
    console.log("No");
    // Update userEvents rsvp number to 2
    editUserEventApi(2);
    setIsRsvped((prev) => !prev);
  };
  const handleMaybe = () => {
    console.log("Maybe");
    // Update userEvents rsvp number to 3
    editUserEventApi(3);
    setIsRsvped((prev) => !prev);
  };

  const rsvpChip = (rsvpId) => {
    if (rsvpId === 1)
      return (
        <Tag size="md" colorScheme="teal">
          Yes
        </Tag>
      );
    else if (rsvpId === 2)
      return (
        <Tag size="md" colorScheme="red">
          No
        </Tag>
      );
    else if (rsvpId === 3) return <Tag size="md">Maybe</Tag>;
  };

  return (
    <>
      <StatGroup>
        <Tooltip
          label={
            rsvpNames?.yes?.length > 0 && (
              <Stack>
                {rsvpNames?.yes?.map((item) => (
                  <Text key={item}>{item}</Text>
                ))}
              </Stack>
            )
          }
        >
          <Stat>
            <StatLabel>Yes</StatLabel>
            <StatNumber>{rsvpCounts.yes}</StatNumber>
          </Stat>
        </Tooltip>
        <Tooltip
          label={
            rsvpNames?.no?.length > 0 && (
              <Stack>
                {rsvpNames?.no?.map((item) => (
                  <Text key={item}>{item}</Text>
                ))}
              </Stack>
            )
          }
        >
          <Stat>
            <StatLabel>No</StatLabel>
            <StatNumber>{rsvpCounts.no}</StatNumber>
          </Stat>
        </Tooltip>
        <Tooltip
          label={
            rsvpNames?.maybe?.length > 0 && (
              <Stack>
                {rsvpNames?.maybe?.map((item) => (
                  <Text key={item}>{item}</Text>
                ))}
              </Stack>
            )
          }
        >
          <Stat>
            <StatLabel>Maybe</StatLabel>
            <StatNumber>{rsvpCounts.maybe}</StatNumber>
          </Stat>
        </Tooltip>
      </StatGroup>
      {isRsvped ? (
        <ButtonGroup display={isRsvped ? "block" : "none"}>
          <Button size="sm" onClick={handleYes}>
            Yes
          </Button>
          <Button size="sm" onClick={handleNo}>
            No
          </Button>
          <Button size="sm" onClick={handleMaybe}>
            Maybe
          </Button>
        </ButtonGroup>
      ) : (
        <Flex>
          {eventWithUser && rsvpChip(eventWithUser.rsvpId)}
          <IconButton
            ml={4}
            colorScheme="teal"
            variant="ghost"
            size="sm"
            aria-label="Edit"
            icon={<EditIcon />}
            onClick={() => setIsRsvped((prev) => !prev)}
          />
        </Flex>
      )}
    </>
  );
}
