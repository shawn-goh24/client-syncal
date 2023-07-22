import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { CameraIcon } from "lucide-react";
import React, { useState } from "react";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { storage } from "../../../../firebase";
import { useRouter } from "next/router";

export default function index({ user, accessToken }) {
  const [account, setAccount] = useState(user);
  const [editAccount, setEditAccount] = useState(false);
  const [name, setName] = useState(user.name);
  const [userImagePreview, setUserImagePreview] = useState();
  const [userImageUrl, setUserImageUrl] = useState(user.avatarUrl);
  const router = useRouter();

  const toast = useToast();

  const handleSave = () => {
    editUserApi();
  };
  const editUserApi = async () => {
    const response = await axios.put(
      `${process.env.SERVER}/user/${account.id}`,
      {
        name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setAccount(response.data);
    setEditAccount(false);
    toast({
      title: "User's name edited",
      position: "top",
      isClosable: true,
      status: "info",
    });
  };

  const handleUserAvatar = async () => {
    let imageUrl;
    if (userImagePreview) {
      imageUrl = await handleUserImageStorage();
    } else {
      imageUrl = userImageUrl;
    }

    const response = await axios.put(
      `${process.env.SERVER}/user/${account.id}`,
      {
        avatarUrl: imageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setAccount(response.data);
    setUserImagePreview("");
    setUserImageUrl(response.data.avatarUrl);
  };

  const handleUserImageStorage = () => {
    const storageRef = sRef(
      storage,
      `users/${account.name}/avatar/${account.name}`
    );
    return new Promise((resolve, reject) => {
      if (userImagePreview !== "") {
        uploadBytes(storageRef, userImagePreview).then((snapshot) => {
          resolve(getDownloadURL(snapshot.ref));
        });
      } else {
        resolve(false);
      }
    });
  };

  const uploadUserImage = (event) => {
    const imagePreview = URL.createObjectURL(event.target.files[0]);
    setUserImagePreview(event.target.files[0]);
    setUserImageUrl(imagePreview);
  };

  const returnHome = () => {
    router.push("/home");
  };

  return (
    <div className="bg-slate-200 h-screen pt-2">
      <Container
        maxW="container.xl"
        className="w-full h-16 rounded-2xl bg-slate-50 shadow-lg shadow-slate-500 flex items-center justify-between"
      >
        <Box className="font-black text-2xl p-4">synCal</Box>
        <Button
          variant="ghost"
          colorScheme="red"
          onClick={() => router.push("/api/auth/logout")}
        >
          Logout
        </Button>
      </Container>
      <Container maxW="container.xl" className="flex mt-12 mb-3">
        <Text as="button" color="blue.500" onClick={returnHome}>
          {"< back"}
        </Text>
        <Breadcrumb className="ml-8">
          <BreadcrumbItem>
            <BreadcrumbLink onClick={returnHome}>Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Account Setting</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Container>
      <Container maxW="container.xl" className="bg-slate-50 rounded-2xl p-8">
        <Heading as="h1" size="xl" className="mb-4 pb-4">
          Account Settings
        </Heading>
        <Flex
          justifyContent="space-between"
          className="rounded-xl border-2 border-solid border-slate-200 p-8"
        >
          <Flex alignItems="center">
            <Box as="label" className="hover:cursor-pointer mr-4 w-fit">
              <input
                name="imageUrl"
                hidden
                accept="image/*"
                type="file"
                onChange={uploadUserImage}
              />
              <Avatar src={userImageUrl} size="2xl" className="relative">
                <CameraIcon
                  style={{ position: "absolute", right: 0, bottom: 0 }}
                  color="black"
                />
              </Avatar>
            </Box>
            <Box>
              <Text as="b" fontSize="2xl">
                {account.name}
              </Text>
              <Text color="gray.500" fontSize="xl">
                Caption
              </Text>
            </Box>
          </Flex>
          {userImageUrl !== account.avatarUrl && (
            <Flex>
              <Button
                variant="ghost"
                onClick={() => {
                  setUserImagePreview("");
                  setUserImageUrl(account.avatarUrl);
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleUserAvatar}>
                Save
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex
          justifyContent="space-between"
          className="rounded-xl border-2 border-solid border-slate-200 p-8 mt-8"
        >
          <Box>
            <Text as="b" fontSize="xl">
              Personal Information
            </Text>
            <Flex className="mt-4">
              <Box>
                <Text fontSize="lg" color="gray.500">
                  Name
                </Text>
                {editAccount ? (
                  <Flex>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Button mx={2} colorScheme="teal" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setName(account.name);
                        setEditAccount(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                ) : (
                  <Text fontSize="lg">{account.name}</Text>
                )}
              </Box>
              <Box className="ml-96">
                <Text fontSize="lg" color="gray.500">
                  Email
                </Text>
                <Text fontSize="lg">{account.email}</Text>
              </Box>
            </Flex>
          </Box>
          <Button
            variant="outline"
            rightIcon={<EditIcon />}
            onClick={() => setEditAccount((prev) => !prev)}
          >
            Edit
          </Button>
        </Flex>
      </Container>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { accessToken } = await getAccessToken(context.req, context.res);
      const session = await getSession(context.req, context.res);
      const currUser = session?.user;
      const userId = context.params.id;

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
        return response.data;
      };

      const user = await getUserApi();

      return {
        props: { user, accessToken },
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
