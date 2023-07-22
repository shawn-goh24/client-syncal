import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { eventFormSchema } from "@/formSchema/formSchema";
import React, { useContext, useRef } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import CustomFormTextarea from "./ui/CustomFormTextarea";
import CustomFormCheckbox from "./ui/CustomFormCheckbox";
import moment from "moment";
import CustomSelect from "./ui/CustomSelect";
import { colorOptions } from "@/constants";
import axios from "axios";
import { AccessTokenContext, UserContext } from "@/pages/home";

export default function AddEventModal({
  addEventModal,
  setAddEventModal,
  selectedCalendarId,
  setEvents,
  getEventListApi,
  selectedCalendar,
}) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);
  const toast = useToast();

  const onAddEvent = (values, actions) => {
    const newValues = { ...values };
    if (newValues.allDay) {
      newValues.end = moment(newValues.end).add(1, "day").format("YYYY-MM-DD");
      newValues.start = moment(newValues.start).format("YYYY-MM-DD");
    }

    addEventApi(newValues, actions);
  };

  const addEventApi = async (newEventValues, actions) => {
    const newlyAddedEvent = await axios.post(
      `${process.env.SERVER}/event/add`,
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

    setEvents((prev) => [...prev, newlyAddedEvent.data]);
    getEventListApi(selectedCalendarId);
    actions.resetForm();
    setAddEventModal(false);
    toast({
      title: "New Event added",
      position: "top",
      isClosable: true,
      status: "success",
    });
  };

  const getColor = () => {
    const index = colorOptions.findIndex(
      (color) => color.value == selectedCalendar?.UserCalendar?.color
    );
    return colorOptions[index];
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
            start: moment().format("YYYY-MM-DDTHH:mm"),
            end: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
            color: getColor()?.value,
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
                  className="mb-4"
                />
                <CustomSelect
                  label="Color"
                  name="color"
                  className="mb-4"
                  options={colorOptions}
                  onChange={(value) =>
                    props.setFieldValue("color", value.value)
                  }
                  value={props.values.color}
                  defaultValue={colorOptions[0]}
                />
                <CustomFormCheckbox
                  name="allDay"
                  text="All Day"
                  className="mb-4"
                />
                <CustomFormInput
                  label="Starts"
                  name="start"
                  className="mb-4"
                  type={
                    props.getFieldMeta().value.allDay
                      ? "date"
                      : "datetime-local"
                  }
                  value={
                    props.getFieldMeta().value.allDay
                      ? moment(props.getFieldMeta().value.start).format(
                          "YYYY-MM-DD"
                        )
                      : moment(props.getFieldMeta().value.start).format(
                          "YYYY-MM-DDTHH:mm"
                        )
                  }
                />
                <CustomFormInput
                  label="Ends"
                  name="end"
                  className="mb-4"
                  min={
                    props.getFieldMeta().value.allDay
                      ? moment(props.getFieldMeta().value.start).format(
                          "YYYY-MM-DD"
                        )
                      : moment(props.getFieldMeta().value.start).format(
                          "YYYY-MM-DDTHH:mm"
                        )
                  }
                  type={
                    props.getFieldMeta().value.allDay
                      ? "date"
                      : "datetime-local"
                  }
                  value={
                    props.getFieldMeta().value.allDay
                      ? moment(props.getFieldMeta().value.end).format(
                          "YYYY-MM-DD"
                        )
                      : moment(props.getFieldMeta().value.end).format(
                          "YYYY-MM-DDTHH:mm"
                        )
                  }
                />
                <CustomFormTextarea
                  label="Description"
                  name="description"
                  placeholder="(Optional)"
                  className="mb-4"
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
