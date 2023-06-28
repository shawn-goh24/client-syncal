import React, { useState } from "react";
import syncalLogo from "../assets/syncal-logo.svg";
import { Box, Center, Tooltip } from "@chakra-ui/react";
import grpImg1 from "../assets/broccoli.jpg";
import grpImg2 from "../assets/broc.jpg";
import Image from "next/image";
import { useRouter } from "next/router";

const groupObjects = [
  {
    name: "Personal",
    url: grpImg1,
  },
  {
    name: "Friends",
    url: grpImg2,
  },
  {
    name: "Family",
    url: grpImg1,
  },
  {
    name: "Work",
    url: grpImg2,
  },
  {
    name: "Girlfriend",
    url: undefined,
  },
  {
    name: "Drinking Buddies",
    url: undefined,
  },
];

export default function Sidebar() {
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const handleSelectGroup = (id) => {
    setSelected(id);
  };

  const handleLogoutClick = () => {
    router.push("/api/auth/logout");
  };

  return (
    <Box bg="blue.100" width="75px" minHeight="100vh">
      <Center py="10px">
        <Image src={syncalLogo} alt="Syncal Logo" width={50} height={50} />
      </Center>
      <Center h="1px" border="1px solid gray" m="0 0 10px 0" />
      <Center flexDirection="column">
        {groupObjects.map((image, id) => (
          <Tooltip key={id} hasArrow label={image.name} placement="right">
            <Box boxSize="50px" my="6px">
              {image.url ? (
                <Image
                  className={
                    selected === id ? "group-button-active" : "group-button"
                  }
                  width="100%"
                  height="100%"
                  src={image.url}
                  alt="grpImg"
                  onClick={() => handleSelectGroup(id)}
                />
              ) : (
                <Center
                  boxSize="50px"
                  className={
                    selected === id ? "group-button-active" : "group-button"
                  }
                  onClick={() => handleSelectGroup(id)}
                >
                  <p style={{ color: "white" }}>{image.name.charAt(0)}</p>
                </Center>
              )}
            </Box>
          </Tooltip>
        ))}
      </Center>
      <button onClick={handleLogoutClick}>Logout</button>
    </Box>
  );
}
// "bg-fuchsia-300 rounded-xl" : "bg-slate-500 rounded-full transition-all hover:bg-fuchsia-300 hover:rounded-xl hover:cursor-pointer"
