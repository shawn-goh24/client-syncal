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
import axios, { Axios } from "axios";
import { useRouter } from "next/router";

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
  // const router = useRouter();
  // const [googleCalList, setGoogleCalList] = useState();

  // console.log(user);
  // console.log("google cal", googleCalList);

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

  const getGroupsApi = async (userId, newCalendar) => {
    const res = await axios.get(`${process.env.SERVER}/user/group/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log(res.data.Calendars);
    setCalendars(res.data.Calendars);
    if (newCalendar) {
      setSelectedCalendar(res.data.Calendars[res.data.Calendars.length - 1]);
    } else {
      setSelectedCalendar(res.data.Calendars[0]);
    }
  };

  // useEffect(() => {
  //   if (accessToken) {
  //     const code = router.query.code && router.query.code;
  //     console.log(code);
  //     if (code) {
  //       window.localStorage.setItem("GOOGLE_AUTHORIZATION_CODE", code);
  //     }

  //     if (window.localStorage.getItem("GOOGLE_AUTHORIZATION_CODE")) {
  //       getGoogleCalendarApi();
  //       getGoogleRefreshToken();
  //     } else {
  //       getRfUrlApi();
  //     }
  //   }
  // }, [accessToken]);

  // const getGoogleRefreshToken = async () => {
  //   const response = await axios.post(
  //     `${process.env.SERVER}/googleCal/rf`,
  //     {
  //       code: window.localStorage.getItem("GOOGLE_AUTHORIZATION_CODE"),
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   console.log("rf: ", response.data);
  // };

  // const getGoogleCalendarApi = async () => {
  //   const sub = user.sub.split("|")[0];
  //   const id = user.sub.split("|")[1];
  //   const response = await axios.get(
  //     `${process.env.SERVER}/googleCal/${sub}/${id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   setGoogleCalList(response.data);
  //   // return response.data;
  // };
  // const getRfUrlApi = async () => {
  //   const res = await axios.get(`${process.env.SERVER}/googleCal/rfurl`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  //   console.log(res.data);
  //   window.location.replace(res.data);
  //   // return res.data;
  // };

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
              getGroupsApi={getGroupsApi}
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
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedCalendar={selectedCalendar}
              calendars={calendars}
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
    // const router = useRouter();
    // const code = context.query.code && context.query.code;
    // console.log(code);
    const code = context.query.code;
    let googleRft;
    try {
      /**
       * 1. Page loads
       * Check if user login or is already login
       * 2. Check user RFT from DB
       * 3a. If exist: check user accessToken
       * 3b: if doesnt exist: Load RFT and store in DB
       * 4: If user accessToken expire: load RFT and get new accesstoken
       * 5: If user accessToken doesnt expire: continue with process
       */

      // Check if refresh token exist in db
      const getRftFromDbApi = async () => {
        console.log("HERE");
        console.log(currUser);
        console.log(accessToken);
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
        console.log("response.data");
        dbUser = response.data;
        return response.data.rft;
      };
      let userRft = await getRftFromDbApi();
      console.log(userRft);

      // UPON LOGIN ONLY or NO REFRESH TOKEN
      if (!userRft) {
        if (!code) {
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

          if (rftUrl) {
            return {
              redirect: {
                destination: rftUrl,
                permanent: false,
              },
            };
          }
        } else {
          const getCodeApi = async () => {
            // console.log(code);
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

            console.log(response.data.refresh_token);

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
            // console.log(response);
            return response.data.refresh_token;
          };

          userRft = await getCodeApi();
        }
      }

      console.log("userRft", userRft);

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
      console.log("error");
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
