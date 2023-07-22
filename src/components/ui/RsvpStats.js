import {
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

export default function RsvpStats({ rsvp, rsvpCounts, rsvpNames }) {
  const stack = (rsvp) =>
    rsvpNames[rsvp]?.length > 0 && (
      <Stack>
        {rsvpNames[rsvp]?.map((item) => (
          <Text key={item}>{item}</Text>
        ))}
      </Stack>
    );
  return (
    <Tooltip label={stack(rsvp)}>
      <Stat>
        <StatLabel>{rsvp}</StatLabel>
        <StatNumber>{rsvpCounts[rsvp]}</StatNumber>
      </Stat>
    </Tooltip>
  );
}
