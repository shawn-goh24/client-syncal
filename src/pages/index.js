import { Inter } from "next/font/google";
import NavigationBar from "@/components/NavigationBar";
import { Box, Center } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Box>
      <NavigationBar />
      <Center bg="pink.100" h="100vh" color="white">
        Hero section
      </Center>
      <Center bg="blue.400" h="100vh" color="white">
        Basic feature section - user interaction
      </Center>
      <Center bg="green.400" h="100vh" color="white">
        Carousel section - additional features
      </Center>
      <Center bg="purple.400" h="100vh" color="white">
        Get started feature
      </Center>
      <Center bg="gray.400" color="white">
        footer
      </Center>
    </Box>
  );
}
