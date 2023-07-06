import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import axios from "axios";
import React from "react";

export default function index({ calendarDetails }) {
  return (
    <>
      <div>{calendarDetails.name}</div>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { accessToken } = await getAccessToken(context.req, context.res);
      // console.log(accessToken);
      // const res = await fetch(`/api/auth/getToken`);
      // const token = await res.json();
      // console.log(token);
      // const session = await getSession(context.req);
      // const accessToken = session?.accessToken;
      // console.log(accessToken);

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
        props: { calendarDetails },
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
