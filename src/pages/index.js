import { Inter } from "next/font/google";
import NavigationBar from "@/components/NavigationBar";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import homeImage from "../assets/home.png";
import addEvent from "../assets/addEvent.png";
import calendar from "../assets/calendar.png";
import FeatureComponent from "@/components/ui/FeatureComponent";
import { useState } from "react";
import { getSession } from "@auth0/nextjs-auth0";

const inter = Inter({ subsets: ["latin"] });

const images = [addEvent, homeImage, calendar];
const imagesText = [
  "Plan your day",
  "See scheduled events",
  "Import google events",
];

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(1);

  return (
    <Box className="bg-grayish-cyan">
      <NavigationBar />
      <Center color="black" display="flex" flexDirection="column">
        <Heading as="h1" size="4xl" textAlign="center" mt={80}>
          Sync Your Life <br />
          with Syncal
        </Heading>
        <Flex className="mt-40">
          {images.map((image, id) => (
            <FeatureComponent
              key={id}
              src={image}
              width={id === 1 ? 800 : 300}
              id={id}
              activeImage={activeFeature}
              setActiveFeature={setActiveFeature}
            />
          ))}
        </Flex>
        <Text
          fontSize="6xl"
          className="mt-40 font-bold transition-opacity duration-150 ease-in opacity-100"
        >
          {imagesText[activeFeature]}
        </Text>
      </Center>
      <Flex
        textAlign="center"
        justifyContent="center"
        direction="column"
        alignItems="center"
        mt={48}
      >
        <Text fontSize="4xl" className="font-semibold">
          Achieve productivity <br />
          and peace with Syncal
        </Text>
        <Button colorScheme="teal" mt={8} mb={24}>
          Get Started
        </Button>
      </Flex>
      <Center bg="gray.100">Created by Shawn Goh</Center>
    </Box>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const session = await getSession(context.req, context.res);
    if (session !== null) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  } catch (error) {
    console.log("error");
    return {
      redirect: {
        destination: "/api/auth/logout",
        permanent: false,
      },
    };
  }
};
