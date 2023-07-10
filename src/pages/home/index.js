import React, { createContext, createRef, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import Sidebar from "@/components/SideBar";
import InfoBar from "@/components/InfoBar";
import { Box } from "@chakra-ui/react";
import Calendar from "@/components/Calendar";
import axios from "axios";

export const AccessTokenContext = createContext();
export const UserContext = createContext();

export default function index({ googleCalList }) {
  const { user, error, isLoading } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [accessToken, setAccessToken] = useState();
  const [currUser, setCurrUser] = useState();
  const [selectedCalendar, setSelectedCalendar] = useState();
  const [calendars, setCalendars] = useState();
  const calendarRef = createRef();

  console.log(user);
  console.log("google cal", googleCalList);

  useEffect(() => {
    if (user) {
      const getAccessTokenApi = async () => {
        const res = await fetch(`/api/auth/getToken`);
        const token = await res.json();
        setAccessToken(token);
        getUserApi(token);
      };

      getAccessTokenApi();
    }
  }, [user]);

  const getUserApi = async (token) => {
    const request = await axios.post(
      `http://localhost:8080/user`,
      {
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCurrUser(request.data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user &&
    accessToken && (
      <UserContext.Provider value={currUser}>
        <AccessTokenContext.Provider value={accessToken}>
          <Box display="flex">
            <Sidebar
              selectedCalendar={selectedCalendar}
              setSelectedCalendar={setSelectedCalendar}
              calendars={calendars}
              setCalendars={setCalendars}
            />
            <InfoBar
              calendarRef={calendarRef}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedCalendar={selectedCalendar}
            />
            <Calendar
              calendarRef={calendarRef}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedCalendar={selectedCalendar}
              calendars={calendars}
              setCalendars={setCalendars}
              googleCalList={googleCalList}
            />
          </Box>
        </AccessTokenContext.Provider>
      </UserContext.Provider>
    )
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { accessToken } = await getAccessToken(context.req, context.res);
      const session = await getSession(context.req, context.res);
      const currUser = session?.user;

      const getGoogleCalendarApi = async () => {
        const sub = currUser.sub.split("|")[0];
        const id = currUser.sub.split("|")[1];
        const response = await axios.get(
          `http://localhost:8080/googleCal/${sub}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      };

      const googleCalList = await getGoogleCalendarApi();

      return {
        props: { googleCalList },
      };
    } catch (error) {
      console.log(error);
      // return {
      //   redirect: {
      //     destination: "/error",
      //     permanent: false,
      //   },
      // };
    }
  },
});
