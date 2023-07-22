import React from "react";
import { formatHhMm } from "../utils/utils";
import { isAfter, isSameDay } from "date-fns";
import { Flex } from "@chakra-ui/react";
import moment from "moment";

export default function EventLists({ events }) {
  const today = new Date();

  const groupEvents =
    events &&
    events.map((event, index) => {
      if (
        isSameDay(new Date(event.date), today) ||
        isAfter(new Date(event.date), today)
      )
        return (
          <div key={index} className="mb-2.5">
            <h1 className="bg-slate-300 rounded-lg text-gray-600 text-md pl-2">
              <span className="font-bold text-black">
                {moment(event.date).format("dddd").toUpperCase()}
              </span>{" "}
              {event.date}
            </h1>
            {event.events.map((item) => (
              <Flex
                key={item.id}
                alignItems="center"
                justifyContent="space-between"
                className="ml-2"
              >
                <Flex alignItems="center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mr-2`}
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm">{item.title}</p>
                </Flex>
                {item.allDay ? (
                  <p className="text-sm">All Day</p>
                ) : (
                  <p className="text-sm">
                    {formatHhMm(new Date(item.start))} -{" "}
                    {formatHhMm(new Date(item.end))}
                  </p>
                )}
              </Flex>
            ))}
          </div>
        );
    });

  return <div>{groupEvents}</div>;
}
