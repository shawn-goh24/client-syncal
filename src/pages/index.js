import NavigationBar from "@/components/NavigationBar";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import homeImage from "../assets/home.png";
import addEvent from "../assets/addEvent.png";
import calendar from "../assets/calendar.png";
import FeatureComponent from "@/components/ui/FeatureComponent";
import { useState } from "react";
import { getSession } from "@auth0/nextjs-auth0";
import Header from "@/components/Header";

const images = [addEvent, homeImage, calendar];
const imagesText = [
  "Plan your day",
  "See scheduled events",
  "Import google events",
];

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(1);

  return (
    <Box className="relative bg-grayish-cyan">
      <Header title="Syncal" />
      <div className="w-56 h-56 bg-red-300 absolute -rotate-[30deg] top-24 left-1/4 rounded-3xl" />
      <div className="w-36 h-36 bg-blue-300/80 absolute -rotate-[30deg] top-48 left-1/3 rounded-3xl" />
      <div className="w-56 h-56 bg-green-300/70 absolute rotate-45 top-80 left-1/4 rounded-3xl" />
      <div className="w-56 h-56 bg-red-300 absolute rotate-[30deg] top-24 right-1/4 rounded-3xl" />
      <div className="w-36 h-36 bg-blue-300/80 absolute rotate-[30deg] top-48 right-1/3 rounded-3xl" />
      <div className="w-56 h-56 bg-green-300/70 absolute -rotate-45 top-80 right-1/4 rounded-3xl" />
      <NavigationBar />
      <Center color="black" display="flex" flexDirection="column">
        <Heading
          as="h1"
          size="4xl"
          textAlign="center"
          mt={80}
          fontWeight="semibold"
        >
          Sync Your Life <br />
          with <span className="font-extrabold text-teal-600">Syncal</span>
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
          fontSize="5xl"
          className="mt-20 font-semibold transition-opacity duration-150 ease-in opacity-100"
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
        <Text fontSize="3xl" className="font-semibold">
          Achieve productivity <br />
          and peace with Syncal
        </Text>
        <Button colorScheme="teal" mt={8} mb={24}>
          Get Started
        </Button>
      </Flex>
      <Center>Created by Shawn Goh</Center>
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
