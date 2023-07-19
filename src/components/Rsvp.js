import { AccessTokenContext, UserContext } from "@/pages/home";
import { EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  StatGroup,
  Tag,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import RsvpStats from "./ui/RsvpStats";
import { rsvps } from "@/constants";
import RsvpButtons from "./ui/RsvpButtons";

export default function Rsvp({ userEvent, selectedEvent }) {
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

    const rsvpObj = { Yes: [], No: [], Maybe: [] };
    const usersArray = usersInEvent.data.Users;
    usersArray.map((item) => {
      if (item.UserEvent.rsvpId === 1) {
        rsvpObj.Yes.push(item.name);
      } else if (item.UserEvent.rsvpId === 2) {
        rsvpObj.No.push(item.name);
      } else {
        rsvpObj.Maybe.push(item.name);
      }
    });
    setRsvpNames(rsvpObj);
  };

  const handleClick = (rsvp) => {
    editUserEventApi(rsvps.indexOf(rsvp) + 1);
    setIsRsvped((prev) => !prev);
  };

  const rsvpChip = (rsvpId) => {
    const colorScheme = ["teal", "red", ""];
    return (
      <Tag size="md" colorScheme={colorScheme[[rsvpId - 1]]}>
        {rsvps[rsvpId - 1]}
      </Tag>
    );
  };

  return (
    <>
      <StatGroup>
        {rsvps.map((rsvp) => (
          <RsvpStats
            key={rsvp}
            rsvp={rsvp}
            rsvpCounts={rsvpCounts}
            rsvpNames={rsvpNames}
          />
        ))}
      </StatGroup>
      {isRsvped ? (
        <ButtonGroup display={isRsvped ? "block" : "none"}>
          {rsvps.map((rsvp) => (
            <RsvpButtons key={rsvp} rsvp={rsvp} handleClick={handleClick} />
          ))}
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
