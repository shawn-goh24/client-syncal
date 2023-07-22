import {
  Avatar,
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { calendarFormSchema } from "@/formSchema/calendarFormSchema";
import React, { useContext, useRef, useState } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import axios from "axios";
import { AccessTokenContext, UserContext } from "@/pages/home";
import { CameraIcon } from "lucide-react";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { storage } from "../../firebase";

export default function AddCalendarModal({
  addCalendarModal,
  setAddCalendarModal,
  setCalendars,
  getGroupsApi,
}) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);
  const [calendarImagePreview, setCalendarImagePreview] = useState();
  const [calendarImageUrl, setCalendarImageUrl] = useState();
  const toast = useToast();

  const uploadCalendarImage = (event) => {
    const imagePreview = URL.createObjectURL(event.target.files[0]);
    setCalendarImagePreview(event.target.files[0]);
    setCalendarImageUrl(imagePreview);
  };

  const onAddCalendar = (values, actions) => {
    addCalendarApi(values);
    actions.resetForm();
    setCalendarImagePreview("");
    setCalendarImageUrl("");
    setAddCalendarModal((prev) => !prev);
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

  const addCalendarApi = async (values) => {
    let imageUrl;
    if (calendarImagePreview) {
      imageUrl = await handleCalendarImageStorage(values);
    } else {
      imageUrl = "";
    }

    const response = await axios.post(
      `${process.env.SERVER}/calendar/add`,
      {
        name: values.name,
        imageUrl: imageUrl,
        userId: currUser.id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setCalendars((prev) => [...prev, response.data]);
    getGroupsApi(currUser.id, true);
    toast({
      title: "New calendar added",
      position: "top",
      isClosable: true,
      status: "success",
    });
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={addCalendarModal}
      onClose={() => setAddCalendarModal((prev) => !prev)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new calendar</ModalHeader>
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
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={calendarFormSchema}
          onSubmit={onAddCalendar}
        >
          {(props) => (
            <Form>
              <ModalBody pb={6}>
                <CustomFormInput
                  label="Calendar Name"
                  name="name"
                  type="text"
                  placeholder="Enter event title"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" mr={3} type="submit">
                  Add
                </Button>
                <Button onClick={() => setAddCalendarModal((prev) => !prev)}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
