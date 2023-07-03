import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { eventFormSchema } from "@/formSchema/formSchema";
import React, { useContext, useRef } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import CustomFormTextarea from "./ui/CustomFormTextarea";
import CustomFormCheckbox from "./ui/CustomFormCheckbox";
import moment from "moment";
import CustomSelect from "./ui/CustomSelect";
import { colorOptions } from "@/contants";
import axios from "axios";
import { AccessTokenContext, UserContext } from "@/pages/home";

export default function AddEventModal({
  addEventModal,
  setAddEventModal,
  // addEventApi,
  selectedCalendarId,
  setEvents,
}) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  const onAddEvent = (values, actions) => {
    addEventApi(values, actions);
    // console.log("Submitted", values);
    // actions.resetForm();
    // setAddEventModal((prev) => !prev);
  };

  const addEventApi = async (newEventValues, actions) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const newlyAddedEvent = await axios.post(
      `http://localhost:8080/event/add`,
      {
        newEventValues: newEventValues,
        calendarId: selectedCalendarId,
        userId: currUser.id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(newlyAddedEvent.data);
    setEvents((prev) => [...prev, newlyAddedEvent.data]);
    actions.resetForm();
    setAddEventModal();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={addEventModal}
      onClose={() => setAddEventModal((prev) => !prev)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new event</ModalHeader>
        <Formik
          initialValues={{
            title: "",
            startDateTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endDateTime: moment(new Date())
              .add(1, "hour")
              .format("YYYY-MM-DDTHH:mm"),
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            endDate: moment(new Date()).format("YYYY-MM-DD"),
            color: colorOptions[0],
            description: "",
            location: "",
            allDay: false,
          }}
          validationSchema={eventFormSchema}
          onSubmit={onAddEvent}
        >
          {(props) => (
            <Form>
              <ModalBody pb={6}>
                <CustomFormInput
                  label="Title*"
                  name="title"
                  type="text"
                  placeholder="Enter event title"
                />
                <CustomFormCheckbox name="allDay" />
                <CustomSelect
                  label="Color"
                  name="color"
                  options={colorOptions}
                  onChange={(value) =>
                    props.setFieldValue("color", value.value)
                  }
                  value={props.values.color}
                  defaultValue={colorOptions[0]}
                />
                <CustomFormInput
                  label="Starts"
                  name={
                    props.getFieldMeta().value.allDay
                      ? "startDate"
                      : "startDateTime"
                  }
                  type={
                    props.getFieldMeta().value.allDay
                      ? "date"
                      : "datetime-local"
                  }
                />
                <CustomFormInput
                  label="Ends"
                  name={
                    props.getFieldMeta().value.allDay
                      ? "endDate"
                      : "endDateTime"
                  }
                  type={
                    props.getFieldMeta().value.allDay
                      ? "date"
                      : "datetime-local"
                  }
                />
                <CustomFormTextarea
                  label="Description"
                  name="description"
                  placeholder="(Optional)"
                />
                <CustomFormInput
                  label="Location"
                  name="location"
                  type="text"
                  placeholder="(Optional)"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" mr={3} type="submit">
                  Add
                </Button>
                <Button onClick={() => setAddEventModal((prev) => !prev)}>
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
