import React from "react";
import {
  Flex,
  Spacer,
  Box,
  Button,
  ButtonGroup,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function NavigationBar() {
  const router = useRouter();
  const [isPhoneSize] = useMediaQuery("(max-width: 500px)");

  const handleLoginClick = () => {
    router.push("/api/auth/login");
  };

  return (
    <Flex
      className="bg-white/62 backdrop-blur-lg fixed w-full"
      px={isPhoneSize ? "2" : "16"}
    >
      <Box p="4">synCal</Box>
      <Spacer />
      <ButtonGroup py="4" gap="2">
        <Button
          size={isPhoneSize ? "xs" : "sm"}
          colorScheme="teal"
          variant="ghost"
          onClick={handleLoginClick}
        >
          Login
        </Button>
        <Button
          size={isPhoneSize ? "xs" : "sm"}
          colorScheme="teal"
          onClick={handleLoginClick}
        >
          Try for free
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export const getStaticProps = async () => {
  const res = await fetch(`/api/testing`);
  const result = await res.json();
  console.log(result);
};
