import {
  Avatar,
  Box,
  Button,
  Center,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
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
import ImportCalendar from "./ImportCalendar";
import { colorOptions } from "@/constants";
import Select from "react-select";
import { colourStyles } from "@/constants";
import { defaultColorValue } from "@/utils/utils";
import DeleteCalendarAlert from "./DeleteCalendarAlert";
import LeaveCalendarAlert from "./LeaveCalendarAlert";

export default function EditCalendarModal({
  editCalendarModal,
  setEditCalendarModal,
  selectedCalendar,
  setCalendars,
  googleCalList,
  setEvents,
  events,
  setSelectedCalendar,
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
  const toast = useToast();

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
      `${process.env.SERVER}/calendar/edit/${selectedCalendar.id}/${currUser.id}`,
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

    setCalendars(response.data.Calendars);
    setEditCalendarModal((prev) => !prev);
    toast({
      title: "Calendar edited",
      position: "top",
      isClosable: true,
      status: "info",
    });
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
      `${process.env.SERVER}/calendar/usercalendar/${currUser.id}/${selectedCalendar.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.data && res.data.Users[0].UserCalendar.roleId === 2
      ? setIsMember(true)
      : setIsMember(false);
  };

  const handleDeleteCalendar = async () => {
    if (deleteInput === selectedCalendar.name) {
      const response = await axios.delete(
        `${process.env.SERVER}/calendar/delete/${selectedCalendar.id}/${currUser.id}`,
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
    }
    setDeleteInput("");
    toast({
      title: "Calendar deleted",
      position: "top",
      isClosable: true,
      status: "success",
    });
  };

  const handleLeaveCalendar = () => {
    const leaveCalendarApi = async () => {
      const response = await axios.delete(
        `${process.env.SERVER}/calendar/leave/${selectedCalendar.id}/${currUser.id}`,
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

  const changeDefaultColor = (selectedColor) => {
    const changeColorApi = async () => {
      const response = await axios.put(
        `${process.env.SERVER}/usercalendar/editcolor/${currUser.id}/${selectedCalendar.id}`,
        {
          color: selectedColor.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSelectedCalendar((prev) => ({ ...prev, UserCalendar: response.data }));
    };
    changeColorApi();
  };

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
            <FormLabel>Default Color</FormLabel>
            <Select
              name="color"
              options={colorOptions}
              defaultValue={
                selectedCalendar &&
                defaultColorValue(
                  colorOptions,
                  selectedCalendar.UserCalendar?.color
                )
              }
              onChange={changeDefaultColor}
              styles={colourStyles}
            />
            <ImportCalendar
              googleCalList={googleCalList}
              selectedCalendar={selectedCalendar}
              events={events}
              setEvents={setEvents}
              setEditCalendarModal={setEditCalendarModal}
            />
          </ModalBody>
          <ModalFooter>
            <Box minWidth="100%">
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
      <DeleteCalendarAlert
        alertDialog={alertDialog}
        setAlertDialog={setAlertDialog}
        setIsDeleteInvalid={setIsDeleteInvalid}
        selectedCalendar={selectedCalendar}
        isDeleteInvalid={isDeleteInvalid}
        deleteInput={deleteInput}
        setDeleteInput={setDeleteInput}
        handleDeleteCalendar={handleDeleteCalendar}
      />
      <LeaveCalendarAlert
        leaveAlertDialog={leaveAlertDialog}
        setLeaveAlertDialog={setLeaveAlertDialog}
        selectedCalendar={selectedCalendar}
        handleLeaveCalendar={handleLeaveCalendar}
      />
    </>
  );
}
