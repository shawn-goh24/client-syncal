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
import React, { useRef } from "react";
import CustomFormInput from "./ui/CustomFormInput";
import CustomFormTextarea from "./ui/CustomFormTextarea";
import CustomFormCheckbox from "./ui/CustomFormCheckbox";
import moment from "moment";
import CustomSelect from "./ui/CustomSelect";
import { colorOptions } from "@/contants";

export default function AddEventModal({ addEventModal, setAddEventModal }) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const onSubmit = (values, actions) => {
    console.log("Submitted", values);
    actions.resetForm();
    setAddEventModal((prev) => !prev);
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
            startDateTime: moment(new Date()).format("YYYY-MM-DDThh:mm"),
            endDateTime: moment(new Date())
              .add(1, "hour")
              .format("YYYY-MM-DDThh:mm"),
            startDate: moment(new Date()).format("YYYY-MM-DD"),
            endDate: moment(new Date()).format("YYYY-MM-DD"),
            color: colorOptions[0],
            description: "",
            location: "",
            allDay: false,
          }}
          validationSchema={eventFormSchema}
          onSubmit={onSubmit}
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
