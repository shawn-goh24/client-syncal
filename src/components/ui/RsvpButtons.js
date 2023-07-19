import { Button } from "@chakra-ui/react";
import React from "react";

export default function RsvpButtons({ rsvp, handleClick }) {
  return (
    <Button size="sm" onClick={() => handleClick(rsvp)}>
      {rsvp}
    </Button>
  );
}
