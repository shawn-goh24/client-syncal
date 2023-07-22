import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";

export default function DeleteCalendarAlert({
  alertDialog,
  setAlertDialog,
  setIsDeleteInvalid,
  selectedCalendar,
  isDeleteInvalid,
  deleteInput,
  setDeleteInput,
  handleDeleteCalendar,
}) {
  const cancelRef = useRef();

  return (
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
          <AlertDialogHeader>Delete {selectedCalendar?.name}</AlertDialogHeader>
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
  );
}
