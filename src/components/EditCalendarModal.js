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
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import { CameraIcon } from "lucide-react";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";
import { calendarFormSchema } from "@/formSchema/calendarFormSchema";
import { AccessTokenContext, UserContext } from "@/pages/home";

export default function EditCalendarModal({
  editCalendarModal,
  setEditCalendarModal,
  selectedCalendar,
  setCalendars,
}) {
  const [calendarImagePreview, setCalendarImagePreview] = useState();
  const [calendarImageUrl, setCalendarImageUrl] = useState();
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  useEffect(() => {
    selectedCalendar && setCalendarImageUrl(selectedCalendar.imageUrl);
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

  return (
    <Modal
      isOpen={editCalendarModal}
      onClose={() => setEditCalendarModal((prev) => !prev)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit calendar</ModalHeader>
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
        <Formik
          initialValues={{ name: selectedCalendar?.name }}
          validationSchema={calendarFormSchema}
          onSubmit={handleEditCalendar}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <FormLabel>Calendar Name</FormLabel>
                <Box display="flex">
                  <CustomFormInput name="name" type="text" />
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isDisabled={
                      props.getFieldMeta().initialValue.name ===
                        props.getFieldMeta().value.name && !calendarImagePreview
                        ? true
                        : false
                    }
                  >
                    Rename
                  </Button>
                </Box>

                <br />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" variant="outline" minWidth="100%">
                  Delete Calendar
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
