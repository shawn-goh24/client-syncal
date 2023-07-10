import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import { CameraIcon } from "lucide-react";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";
import { calendarFormSchema } from "@/formSchema/calendarFormSchema";
import { AccessTokenContext, UserContext } from "@/pages/home";
import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function EditCalendarModal({
  editCalendarModal,
  setEditCalendarModal,
  selectedCalendar,
  setCalendars,
  googleCalList,
}) {
  const [calendarImagePreview, setCalendarImagePreview] = useState();
  const [calendarImageUrl, setCalendarImageUrl] = useState();
  const [alertDialog, setAlertDialog] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleteInvalid, setIsDeleteInvalid] = useState(false);
  const [leaveAlertDialog, setLeaveAlertDialog] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);
  const cancelRef = useRef();
  const leaveCancelRef = useRef();

  useEffect(() => {
    if (selectedCalendar) {
      setCalendarImageUrl(selectedCalendar.imageUrl);
      isUserMember();
    }
  }, [selectedCalendar]);

  const handleEditCalendar = async (values, actions) => {
    let imageUrl;
    if (calendarImagePreview) {
      imageUrl = await handleCalendarImageStorage(values);
    } else {
      imageUrl = calendarImageUrl;
    }

    const response = await axios.put(
      `http://localhost:8080/calendar/edit/${selectedCalendar.id}/${currUser.id}`,
      {
        name: values.name,
        imageUrl: imageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data.Calendars);
    setCalendars(response.data.Calendars);
    setEditCalendarModal((prev) => !prev);
  };

  const uploadCalendarImage = (event) => {
    const imagePreview = URL.createObjectURL(event.target.files[0]);
    setCalendarImagePreview(event.target.files[0]);
    setCalendarImageUrl(imagePreview);
  };

  const handleCalendarImageStorage = (values) => {
    const storageRef = sRef(
      storage,
      `users/${currUser.name}/calendarImage/${values.name}`
    );
    return new Promise((resolve, reject) => {
      if (calendarImagePreview !== "") {
        uploadBytes(storageRef, calendarImagePreview).then((snapshot) => {
          resolve(getDownloadURL(snapshot.ref));
        });
      } else {
        resolve(false);
      }
    });
  };

  const isUserMember = async () => {
    const res = await axios.get(
      `http://localhost:8080/calendar/usercalendar/${currUser.id}/${selectedCalendar.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log(res.data.Users[0].UserCalendar.roleId);
    res.data && res.data.Users[0].UserCalendar.roleId === 2
      ? setIsMember(true)
      : setIsMember(false);
  };

  const handleDeleteCalendar = async () => {
    if (deleteInput === selectedCalendar.name) {
      const response = await axios.delete(
        `http://localhost:8080/calendar/delete/${selectedCalendar.id}/${currUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCalendars(response.data.Calendars);
      setAlertDialog((prev) => !prev);
      setIsDeleteInvalid(false);
    } else {
      setIsDeleteInvalid(true);
      setDeleteInput("");
    }
  };

  const handleLeaveCalendar = () => {
    const leaveCalendarApi = async () => {
      const response = await axios.delete(
        `http://localhost:8080/calendar/leave/${selectedCalendar.id}/${currUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCalendars(response.data.Calendars);
      setEditCalendarModal(false);
    };
    leaveCalendarApi();
    setLeaveAlertDialog(false);
  };

  console.log("Google Cal List: ", googleCalList);

  return (
    <>
      <Modal
        isOpen={editCalendarModal}
        onClose={() => setEditCalendarModal((prev) => !prev)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calendar Settings</ModalHeader>
          <ModalCloseButton />
          <Center>
            <Box as="label" style={{ position: "relative" }}>
              <input
                name="imageUrl"
                hidden
                accept="image/*"
                type="file"
                onChange={uploadCalendarImage}
              />
              <Box>
                <Avatar src={calendarImageUrl} size="2xl" />
                <CameraIcon
                  style={{ position: "absolute", right: 0, bottom: 0 }}
                />
              </Box>
            </Box>
          </Center>
          <ModalBody>
            <Formik
              initialValues={{ name: selectedCalendar?.name }}
              validationSchema={calendarFormSchema}
              onSubmit={handleEditCalendar}
            >
              {(props) => (
                <Form>
                  <FormLabel>Calendar Name</FormLabel>
                  <Box display="flex">
                    <CustomFormInput name="name" type="text" />
                    <Button
                      type="submit"
                      colorScheme="teal"
                      isDisabled={
                        props.getFieldMeta().initialValue.name ===
                          props.getFieldMeta().value.name &&
                        !calendarImagePreview
                          ? true
                          : false
                      }
                    >
                      Rename
                    </Button>
                  </Box>
                  <br />
                </Form>
              )}
            </Formik>
            <FormLabel>Calendars</FormLabel>
            <Text>Google</Text>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              style={{
                border: "1px solid gray",
                padding: "10px",
                borderRadius: "10px",
              }}
              align="stretch"
            >
              {googleCalList &&
                googleCalList.map((cal) => (
                  <Checkbox key={cal.id} id={cal.id}>
                    {cal.summary}
                    {/* | {cal.id} */}
                  </Checkbox>
                ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Box minWidth="100%">
              <Button colorScheme="teal" minWidth="100%" mb={2}>
                Done
              </Button>
              {isMember ? (
                <Button
                  colorScheme="red"
                  variant="outline"
                  minWidth="100%"
                  onClick={() => {
                    setEditCalendarModal((prev) => !prev);
                    setLeaveAlertDialog(true);
                  }}
                >
                  Leave Calendar
                </Button>
              ) : (
                <Button
                  colorScheme="red"
                  variant="outline"
                  minWidth="100%"
                  onClick={() => {
                    setEditCalendarModal((prev) => !prev);
                    setAlertDialog((prev) => !prev);
                  }}
                >
                  Delete Calendar
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={alertDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setAlertDialog((prev) => !prev);
          setIsDeleteInvalid(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Delete {selectedCalendar?.name}
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormLabel>
                To confirm, type "{selectedCalendar?.name}" in the box below
              </FormLabel>
              <Input
                isInvalid={isDeleteInvalid}
                errorBorderColor="crimson"
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
              />
              {isDeleteInvalid && (
                <Text color="red">Please enter the right calendar name</Text>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setAlertDialog((prev) => !prev);
                  setIsDeleteInvalid(false);
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteCalendar} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={leaveAlertDialog}
        leastDestructiveRef={leaveCancelRef}
        onClose={() => {
          setLeaveAlertDialog((prev) => !prev);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Delete {selectedCalendar?.name}
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to leave?</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={leaveCancelRef}
                onClick={() => {
                  setLeaveAlertDialog((prev) => !prev);
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLeaveCalendar} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
