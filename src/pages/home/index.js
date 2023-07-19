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
  const [eventList, setEventList] = useState();

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

  const getEventListApi = async (calendarId) => {
    const res = await axios.get(
      `${process.env.SERVER}/calendar/${calendarId}/list`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setEventList(res.data);
  };

  const getUserApi = async (token) => {
    const request = await axios.post(
      `${process.env.SERVER}/user`,
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
              getEventListApi={getEventListApi}
              eventList={eventList}
            />
            <Calendar
              calendarRef={calendarRef}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedMonth={setSelectedMonth}
              selectedCalendar={selectedCalendar}
              setCalendars={setCalendars}
              googleCalList={googleCalList}
              setSelectedCalendar={setSelectedCalendar}
              getEventListApi={getEventListApi}
            />
          </Box>
        </AccessTokenContext.Provider>
      </UserContext.Provider>
    )
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { accessToken } = await getAccessToken(context.req, context.res);
    const session = await getSession(context.req, context.res);
    const currUser = session?.user;
    let dbUser;
    let googleCalList;
    const code = context.query.code;

    try {
      // Check if refresh token exist in db
      const getRftFromDbApi = async () => {
        const response = await axios.post(
          `${process.env.SERVER}/user`,
          {
            user: currUser,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dbUser = response.data;
        return response.data.rft;
      };

      // Store user refresh token from db
      let userRft = await getRftFromDbApi();

      // UPON NO REFRESH TOKEN
      if (!userRft) {
        if (!code) {
          // Get google url to get google refresh token
          const getGoogleRtfUrlApi = async () => {
            const response = await axios.get(
              `${process.env.SERVER}/googlecal/rfurl`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            // console.log(response.data);
            return response.data;
          };

          const rftUrl = await getGoogleRtfUrlApi();

          // once got url, redirect to google auth
          if (rftUrl) {
            return {
              redirect: {
                destination: rftUrl,
                permanent: false,
              },
            };
          }
        } else {
          const getGoogleRfApi = async () => {
            // Get refresh token from google
            const response = await axios.post(
              `${process.env.SERVER}/googlecal/rf`,
              {
                code: code,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            // Store refresh token into user database
            await axios.put(
              `${process.env.SERVER}/user/${dbUser.id}`,
              {
                rft: response.data.refresh_token,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            return response.data.refresh_token;
          };

          userRft = await getGoogleRfApi();
        }
      }

      const getGoogleCalendarApi = async () => {
        const sub = currUser.sub.split("|")[0];
        const id = currUser.sub.split("|")[1];
        const response = await axios.get(
          `${process.env.SERVER}/googleCal/${sub}/${id}/${dbUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      };

      googleCalList = await getGoogleCalendarApi();

      return {
        props: { googleCalList },
      };
    } catch (error) {
      const resetRftDb = async () => {
        await axios.put(
          `${process.env.SERVER}/user/${dbUser.id}`,
          {
            rft: null,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      };
      await resetRftDb();

      return {
        redirect: {
          destination: "/api/auth/logout",
          permanent: false,
        },
      };
    }
  },
});
