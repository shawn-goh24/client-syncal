import React from "react";
import { formatHhMm } from "../../utils/utils";

export default function EventLists({ events }) {
  const groupEvents =
    events &&
    events.map((event, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <h1 style={{ backgroundColor: "lightgray" }}>{event.date}</h1>
        {event.events.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: `${item.color}`,
                  borderRadius: "100%",
                }}
              />
              <p style={{ fontSize: "14px" }}>{item.title}</p>
            </div>
            {item.allDay ? (
              <p style={{ fontSize: "14px" }}>All Day</p>
            ) : (
              <p style={{ fontSize: "14px" }}>
                {formatHhMm(new Date(item.start))} -{" "}
                {formatHhMm(new Date(item.end))}
              </p>
            )}
          </div>
        ))}
      </div>
    ));

  return <div>{groupEvents}</div>;
}
