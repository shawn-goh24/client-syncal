import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import CustomFormCheckbox from "./ui/CustomFormCheckbox";
import CustomSelect from "./ui/CustomSelect";
import CustomFormTextarea from "./ui/CustomFormTextarea";
import moment from "moment";
import { eventFormSchema } from "@/formSchema/formSchema";
import { colorOptions } from "@/constants";
import axios from "axios";
import { AccessTokenContext, UserContext } from "@/pages/home";
import { DeleteIcon } from "@chakra-ui/icons";
import Rsvp from "./Rsvp";
import DeleteEventAlert from "./DeleteEventAlert";

export default function EditEventDrawer({
  editEventDrawer,
  setEditEventDrawer,
  selectedEvent: selectedEvent,
  events,
  setEvents,
  selectedCalendarId,
  getEventListApi,
}) {
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [userEvent, setUserEvent] = useState();
  const [member, setMember] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    if (selectedEvent) {
      checkUserIsInEvent();
      setEndDate(moment(selectedEvent?.end).format("YYYY-MM-DD"));
    }
  }, [selectedEvent]);

  const handleEditEvent = (values, actions) => {
    const newValues = { ...values };
    if (newValues.allDay) {
      newValues.end = moment(newValues.end).add(1, "day").format("YYYY-MM-DD");
      newValues.start = moment(newValues.start).format("YYYY-MM-DD");
    }
    editEventApi(selectedEvent?.id, newValues);
    setEditEventDrawer((prev) => !prev);
  };

  const handleDeleteEvent = () => {
    deleteEventApi(selectedEvent?.id);
  };

  const editEventApi = async (eventId, editedValues) => {
    const editedEvent = await axios.put(
      `${process.env.SERVER}/event/edit/${eventId}`,
      { editedValues },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    let eventList = [...events];
    const eventToReplace = eventList.findIndex((event) => event.id == eventId);
    eventList[eventToReplace] = editedEvent.data;
    setEvents(eventList);
    getEventListApi(selectedCalendarId);
    toast({
      title: "Event edited",
      position: "top",
      isClosable: true,
      status: "info",
    });
  };

  const deleteEventApi = async (eventId) => {
    const newEvents = await axios.delete(
      `${process.env.SERVER}/event/delete/${eventId}/${selectedCalendarId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setEvents(newEvents.data.Events);
    getEventListApi(selectedCalendarId);
    toast({
      title: "Event deleted",
      position: "top",
      isClosable: true,
      status: "success",
    });
  };

  const getColor = () => {
    const index = colorOptions.findIndex(
      (color) => color.value == selectedEvent?.backgroundColor
    );
    return colorOptions[index];
  };

  // get event include user
  const checkUserIsInEvent = async () => {
    const eventWithUser = await axios.get(
      `${process.env.SERVER}/event/userevent/${selectedEvent.id}/${currUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setUserEvent(eventWithUser.data);
    eventWithUser.data === null || eventWithUser.data.roleId === 2
      ? setMember(true)
      : setMember(false);
  };

  return (
    <>
      <Drawer
        onClose={() => setEditEventDrawer((prev) => !prev)}
        isOpen={editEventDrawer}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems="center">
              Edit Event
              <span>
                <IconButton
                  ml={4}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  aria-label="Delete event"
                  icon={<DeleteIcon />}
                  onClick={onOpen}
                />
              </span>
            </Flex>
            <Rsvp
              userEvent={userEvent}
              member={member}
              selectedEvent={selectedEvent}
            />
          </DrawerHeader>
          <Formik
            initialValues={{
              title: selectedEvent?.title,
              start: moment(selectedEvent?.start).format("YYYY-MM-DDTHH:mm"),
              end: selectedEvent?.allDay
                ? selectedEvent?.end
                  ? moment(selectedEvent?.end)
                      .subtract(8, "hours")
                      .format("YYYY-MM-DDTHH:mm")
                  : null
                : selectedEvent?.end
                ? moment(selectedEvent?.end).format("YYYY-MM-DDTHH:mm")
                : null,
              color: getColor()?.value, // need utils function to get the color
              description: selectedEvent?.extendedProps.description,
              location: selectedEvent?.extendedProps.location,
              allDay: selectedEvent?.allDay,
            }}
            validationSchema={eventFormSchema}
            onSubmit={handleEditEvent}
          >
            {(props) => (
              <Form>
                <DrawerBody pb={6}>
                  <CustomFormInput
                    label="Title*"
                    name="title"
                    type="text"
                    className="mb-4"
                    placeholder="Enter event title"
                    isReadOnly={member ? true : false}
                  />
                  <CustomSelect
                    label="Color"
                    name="color"
                    isDisabled={member ? true : false}
                    options={colorOptions}
                    className="mb-4"
                    onChange={(value) =>
                      props.setFieldValue("color", value.value)
                    }
                    value={props.values.color}
                  />
                  <CustomFormCheckbox
                    name="allDay"
                    text="All Day"
                    defaultChecked={props.getFieldMeta().value.allDay}
                    isReadOnly={member ? true : false}
                  />
                  <CustomFormInput
                    isReadOnly={member ? true : false}
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
                    isReadOnly={member ? true : false}
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
                    isReadOnly={member ? true : false}
                    label="Description"
                    name="description"
                    placeholder="(Optional)"
                  />
                  <CustomFormInput
                    isReadOnly={member ? true : false}
                    label="Location"
                    name="location"
                    type="text"
                    placeholder="(Optional)"
                  />
                  <Flex justifyContent="flex-end" mt={4}>
                    <Button
                      variant="ghost"
                      mr={4}
                      onClick={() => setEditEventDrawer((prev) => !prev)}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="teal"
                      type="submit"
                      isDisabled={member ? true : false}
                    >
                      Confirm
                    </Button>
                  </Flex>
                </DrawerBody>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
      <DeleteEventAlert
        handleDeleteEvent={handleDeleteEvent}
        setEditEventDrawer={setEditEventDrawer}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
