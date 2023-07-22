import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function index({
  calendarDetails,
  isUserValid,
  currUser,
  accessToken,
  dbUser,
}) {
  const router = useRouter();

  const handleAccept = () => {
    const addUserCalendar = async () => {
      const res = await axios.post(
        `${process.env.SERVER}/calendar/new/usercalendar`,
        {
          userEmail: currUser.email,
          calendarId: calendarDetails.id,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    };
    addUserCalendar();
    router.push("/home");
  };

  const handleReject = () => {
    const deletePending = async () => {
      await axios.delete(
        `${process.env.SERVER}/pending/delete/${currUser.email}/${calendarDetails.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    };
    deletePending();
    router.push("/home");
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute overflow-hidden rotate-45 h-[1080px] blur-3xl w-[3000px] -z-10 bg-gradient-to-r from-emerald-200 to-yellow-200" />
      <Flex className="bg-slate-200/40 backdrop-blur-lg absolute w-full z-50 items-center justify-between h-16 shadow-md">
        <Box className="font-black text-2xl p-4">synCal</Box>
        <Flex alignItems="center">
          <Avatar className="mr-2" name={dbUser.name} src={dbUser.avatarUrl} />
          <Button className="mr-4" size="sm" colorScheme="red">
            Logout
          </Button>
        </Flex>
      </Flex>
      {isUserValid ? (
        <Flex className="h-screen items-center justify-center flex-col">
          <Image
            src={
              calendarDetails.imageUrl
                ? calendarDetails.imageUrl
                : "https://images.unsplash.com/photo-1504238624541-bca0f332da07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
            }
            alt="CalendarImage"
            width={300}
            height={0}
            className="rounded-xl"
          />
          <Text fontSize="3xl" className="font-semibold my-3">
            Do you want to join{" "}
            <span className="text-teal-600">{calendarDetails.name}</span>?
          </Text>
          <Flex>
            <Button
              onClick={handleReject}
              variant="ghost"
              colorScheme="red"
              className="mr-3 w-32"
            >
              No
            </Button>
            <Button onClick={handleAccept} colorScheme="teal" className="w-32">
              Yes
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex
          height="100vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          No access to calendar, ask owner to invite
        </Flex>
      )}
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { accessToken } = await getAccessToken(context.req, context.res);
      const session = await getSession(context.req, context.res);
      const currUser = session?.user;
      let dbUser;

      const getUserApi = async () => {
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
      };

      getUserApi();

      const checkIfInPending = await axios.get(
        `${process.env.SERVER}/pending/${currUser.email}/${context.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const isUserValid = checkIfInPending.data.length > 0 ? true : false;

      const response = await axios.get(
        `${process.env.SERVER}/calendar/invite/${context.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const calendarDetails = response.data;
      return {
        props: { calendarDetails, isUserValid, currUser, accessToken, dbUser },
      };
    } catch (error) {
      console.log(error);
      return {
        redirect: {
          destination: "/error",
          permanent: false,
        },
      };
    }
  },
});
