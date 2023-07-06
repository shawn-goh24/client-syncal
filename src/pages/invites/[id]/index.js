import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function index({
  calendarDetails,
  isUserValid,
  currUser,
  accessToken,
}) {
  const router = useRouter();

  const handleAccept = () => {
    console.log("Accept");
    const addUserCalendar = async () => {
      const res = await axios.post(
        `http://localhost:8080/calendar/new/usercalendar`,
        {
          userEmail: currUser.email,
          calendarId: calendarDetails.id,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(res.data);
    };
    addUserCalendar();
    router.push("/home");
  };

  const handleReject = () => {
    const deletePending = async () => {
      await axios.delete(
        `http://localhost:8080/pending/delete/${currUser.email}/${calendarDetails.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    };
    deletePending();
    console.log("Reject");
    router.push("/home");
  };

  return (
    <>
      <Flex
        position="absolute"
        alignItems="center"
        justifyContent="space-between"
        width="100vw"
        height="60px"
        className="bg-red-300"
      >
        <p>Logo</p>

        <Flex alignItems="center">
          <p>Avatar</p>
          <Button size="sm" colorScheme="red">
            Logout
          </Button>
        </Flex>
      </Flex>
      {isUserValid ? (
        <Flex
          height="100vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Image
            src={
              calendarDetails.imageUrl
                ? calendarDetails.imageUrl
                : "https://images.unsplash.com/photo-1504238624541-bca0f332da07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
            }
            alt="CalendarImage"
            width={100}
            height={100}
          />
          <Text>Do you want to join {calendarDetails.name}?</Text>
          <Flex>
            <Button onClick={handleReject}>No</Button>
            <Button onClick={handleAccept}>Yes</Button>
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
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { accessToken } = await getAccessToken(context.req, context.res);
      const session = await getSession(context.req, context.res);
      const currUser = session?.user;

      const checkIfInPending = await axios.get(
        `http://localhost:8080/pending/${currUser.email}/${context.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Pending: ", checkIfInPending.data);
      const isUserValid = checkIfInPending.data.length > 0 ? true : false;

      const response = await axios.get(
        `http://localhost:8080/calendar/invite/${context.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const calendarDetails = response.data;
      return {
        props: { calendarDetails, isUserValid, currUser, accessToken },
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
