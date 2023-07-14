import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useContext, useRef, useState } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import CustomFormCheckbox from "./ui/CustomFormCheckbox";
import CustomSelect from "./ui/CustomSelect";
import CustomFormTextarea from "./ui/CustomFormTextarea";
import moment from "moment";
import { eventFormSchema } from "@/formSchema/formSchema";
import { colorOptions } from "@/contants";
import axios from "axios";
import { AccessTokenContext } from "@/pages/home";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleEditEvent = (values, actions) => {
    // console.log("Edited");
    // console.log(values);
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
    // console.log(editedEvent.data);
    let eventList = [...events];
    const eventToReplace = eventList.findIndex((event) => event.id == eventId);
    eventList[eventToReplace] = editedEvent.data;
    // console.log(eventList);
    setEvents(eventList);
    getEventListApi(selectedCalendarId);
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

    // console.log(newEvents.data);
    setEvents(newEvents.data.Events);
    getEventListApi(selectedCalendarId);
  };

  const getColor = () => {
    const index = colorOptions.findIndex(
      (color) => color.value == selectedEvent?.backgroundColor
    );
    return colorOptions[index];
  };

  return (
    // selectedEvent && (
    <>
      <Drawer
        onClose={() => setEditEventDrawer((prev) => !prev)}
        isOpen={editEventDrawer}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader display="flex" alignItems="center">
            Edit Event
            {/* {selectedEvent?.title} */}
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
          </DrawerHeader>

          <Formik
            initialValues={{
              title: selectedEvent?.title,
              start: moment(selectedEvent?.start).format("YYYY-MM-DDTHH:mm"),
              end: selectedEvent?.end
                ? moment(selectedEvent?.end).format("YYYY-MM-DDTHH:mm")
                : null,
              // startDateTime: moment(selectedEvent.start).format(
              //   "YYYY-MM-DDTHH:mm"
              // ),
              // endDateTime: moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm"),
              // startDate: moment(selectedEvent.start).format("YYYY-MM-DD"),
              // endDate: moment(selectedEvent.end).format("YYYY-MM-DD"),
              color: getColor()?.value, // need utils function to get the color
              description: selectedEvent?.description,
              location: selectedEvent?.location,
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
                    placeholder="Enter event title"
                  />
                  <CustomFormCheckbox
                    name="allDay"
                    text="All Day"
                    defaultChecked={props.getFieldMeta().value.allDay}
                  />
                  <CustomSelect
                    label="Color"
                    name="color"
                    options={colorOptions}
                    onChange={(value) =>
                      props.setFieldValue("color", value.value)
                    }
                    value={props.values.color}
                    // defaultValue={() => {
                    //   const index = colorOptions.findIndex(
                    //     (color) =>
                    //       color.value == selectedEvent?.backgroundColor
                    //   );
                    //   return colorOptions[index];
                    // }}
                  />
                  <CustomFormInput
                    label="Starts"
                    // name={
                    //   props.getFieldMeta().value.allDay
                    //     ? "startDate"
                    //     : "startDateTime"
                    // }
                    name="start"
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
                    // name={
                    //   props.getFieldMeta().value.allDay
                    //     ? "endDate"
                    //     : "endDateTime"
                    // }
                    name="end"
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
                  />
                  <CustomFormInput
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
                    <Button colorScheme="teal" type="submit">
                      Confirm
                    </Button>
                  </Flex>
                </DrawerBody>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} mr={4}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDeleteEvent();
                  onClose();
                  setEditEventDrawer((prev) => !prev);
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
    // )
  );
}
